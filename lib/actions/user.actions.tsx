"use server";
import { ID, Query } from "node-appwrite";
import { createAdminClient, createSessionClient } from "../appwrite";
import { cookies } from "next/headers";
import { encryptId, extractCustomerIdFromUrl, handlePlaidError, isAxiosError, isCreateError, parseStringify, TokenParams } from "../utils";
import { CountryCode, ProcessorTokenCreateRequest, ProcessorTokenCreateRequestProcessorEnum, Products } from "plaid";
import { plaidClient } from "../plaid";
import { addFundingSource, createDwollaCustomer } from "./dwolla.actions";
import { revalidatePath } from "next/cache";

const {  APPWRITE_DATABASE_ID: DATABASE_ID,
  APPWRITE_BANK_COLLECTION_ID: BANK_COLLECTION_ID,
  APPWRITE_USER_COLLECTION_ID: USER_COLLECTION_ID,
 }  = process.env;

// on sign up we not only create sser in backend
// but also we create entry for user in bank
export const signUp = async ({password, ...data}: SignUpParams) => {
  const { email, firstName, lastName } = data;
  
  let newUserAccount;
  
  try {
    //create appwrite admin instance to be able to communicate with appwrite
    //in creating account with user auth details

    //note: Account is used to manage user auth and session info
    //whilst database is oriented on structured collection in this case;
    //complete User data

    const { account, database } = await createAdminClient();

    //retrieve new account instance 
    newUserAccount = await account.create(
      ID.unique(),
      email,
      password,
      `${firstName}${lastName}`
    );

    if (!newUserAccount){
      throw new Error('Error creating User Account in Appwrite');
    }

    //once we have userAccount, we create the dwolla Customer
    const dwollaCustomerUrl = await createDwollaCustomer({
      ...data,
      type: 'personal'
    });

    if(!dwollaCustomerUrl){
      throw new Error('Error creating dwolla customer');
    };

    //once we have confirmed creation of customer in dwolla we extract the ID 
    //from dwolla of that created entity; 

    const dwollaCustomerId = extractCustomerIdFromUrl(dwollaCustomerUrl);

    //create document entry in appwrite for the customer using all custoer provided details

    const newUser = await database.createDocument( 
      DATABASE_ID!,
      USER_COLLECTION_ID!,
      ID.unique(),
      {
        ...data,
        userId: newUserAccount.$id,
        dwollaCustomerId,
        dwollaCustomerUrl
      }      
    )

    if(!newUser){
      throw new Error('Error creating User profile document in database');
    }


    //create session since we want user to be authenticated and logged in post sign up
    //Note: to use JWTs instead

    const session = await account.createEmailPasswordSession(email, password);

    //set cookie in browser for login identification via the key
    cookies().set("appwrite-session", session.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });

    //we return a stringified version of the user object due to size limitations
    return parseStringify(newUser);
  } catch (error) {
    console.log(error);
  }
};

export const getUserInfo = async ({ userId }: getUserInfoProps) => {

  try {
    const { database } = await createAdminClient();
    const response = await database.listDocuments(
      DATABASE_ID!,
      USER_COLLECTION_ID!,
      // checking for docs in appwrite that matches the value unde the userId column
      [Query.equal('userId', [userId])]
    );

    return parseStringify(response.documents[0]);
  } catch (error) {
    console.log("Error fetching user Info from appwrite ", error);
  }
};

export const signIn = async ({ email, password }: signInProps) => {
    const { account } = await createAdminClient();

    //create session off of retrieved account from appwrite client
    const session = await account.createEmailPasswordSession(email, password);

    //set cookie in browser for login identification via the key
    cookies().set("appwrite-session", session.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });

    //fetch actual user record from db
    const user = await getUserInfo({userId: session.userId});
    return parseStringify(user);
};

export async function getLoggedInUser() {
  try {
    //fetching user info from session 
    const { account } = await createSessionClient();
    const user = await account.get();
    
    //fetching user info from db
    const userData = await getUserInfo({userId: user.$id});
    
    return parseStringify(userData);
  } catch (error) {
    console.log("Error fetching logged-in user");
    return null;
  }
}

export async function logoutAccount() {
  try {
    const { account } = await createSessionClient();

    //delete cookie
    cookies().delete("appwrite-session");

    //delete session
    const response =  await account.deleteSession("current");
    console.log("logged out response", response);
    return response;
  } catch (error) {
    console.log("Error", error);
  }
}

export const getBanks = async({userId}: getBanksProps) => {

  //get database resource
  const { database }  = await createAdminClient();
  const response = await database.listDocuments(
    DATABASE_ID!,
    BANK_COLLECTION_ID!,
    [Query.equal('userId', [userId])]
  );

  return parseStringify(response.documents);
}

export const getBank = async({ documentId} : getBankProps) => {

  const { database }  = await createAdminClient();
  const response = await database.listDocuments(
    DATABASE_ID!,
    BANK_COLLECTION_ID!,
    [Query.equal( '$id', [documentId])]
  );

  return parseStringify(response.documents[0]);
}

export const createBankAccount = async( {userId,
  bankId,   
  accountId,
  accessToken,
  fundingSourceUrl,
  shareableId  
} : createBankAccountProps) => {

   const { database } = await createAdminClient();

   const bankAccount = await database.createDocument(
    DATABASE_ID!,
    BANK_COLLECTION_ID!,  
    ID.unique(),
    {
      userId,
      bankId, 
      accountId,
      accessToken,
      fundingSourceUrl,
      shareableId  
    });

    return parseStringify(bankAccount);
}


export const createLinkToken = async (user: User, variant?: string, access_token?: string) => {
  try {
    const tokenParams = {
      user: {
        client_user_id: user.$id,
      },
      client_name: `${user.firstName}${user.lastName}`,
      language: "en",
      // requesting the products/ resources from plaid to perform comms
      // in this case we need the auth product to authenticate bank account info
      products: ["auth"] as Products[],
      country_codes: ["US"] as CountryCode[],
    } as TokenParams;

      // If accessToken exists, set update mode for re-authentication
      if (access_token) {
        tokenParams.access_token = access_token;
      }

      if (variant && variant === 'addConsent'){
        tokenParams.additional_consented_products = ["transactions"] as Products[];
      }

    const response = await plaidClient.linkTokenCreate(tokenParams);
    //get link token response
    return parseStringify({linkToken : response.data.link_token});
  } catch (error) {
    console.log('Error calling linkTokenCreate API', error);

  }
};

export const exchangePublicToken = async ({
  publicToken,
  user,
}: exchangePublicTokenProps) => {

  try {
    // Exchange public token for access token and item ID
    const response = await plaidClient.itemPublicTokenExchange({
      public_token: publicToken,
    });

    const accessToken = response.data.access_token;
    const itemId = response.data.item_id;

    // Get account information from Plaid using the access token
    const accountsResponse = await plaidClient.accountsGet({
      access_token: accessToken,
    });

    const accountData = accountsResponse.data.accounts[0];

    // Create a processor token for Dwolla using the access token and account ID
    const request: ProcessorTokenCreateRequest = {
      access_token: accessToken,
      account_id: accountData.account_id,
      processor: "dwolla" as ProcessorTokenCreateRequestProcessorEnum,
    };

    const processorTokenResponse =
      await plaidClient.processorTokenCreate(request);
    const processorToken = processorTokenResponse.data.processor_token;

    // Create a funding source URL for the account using the Dwolla customer ID, processor token, and bank name
    const fundingSourceUrl = await addFundingSource({
      dwollaCustomerId: user.dwollaCustomerId,
      processorToken, 
      bankName: accountData.name,
    });

    // If the funding source URL is not created, throw an error
    if (!fundingSourceUrl) throw Error;

    // Create a bank account using the user ID, item ID, account ID, access token, funding source URL, and sharable ID
    await createBankAccount({
      userId: user.$id,
      bankId: itemId,
      accountId: accountData.account_id,
      accessToken,
      fundingSourceUrl,
      shareableId: encryptId(accountData.account_id),
    });

    // Revalidate the path to reflect the changes
    revalidatePath("/");

    // Return a success message
    return parseStringify({
      publicTokenExchange: "complete",
    });
  } catch (error) {
    // Log any errors that occur during the process
    console.error("An error occurred while creating exchanging token:", error);
  }
};


// get specific bank from bank collection by account id
export const getBankByAccountId = async ({
  accountId,
}: getBankByAccountIdProps) => {
  try {
    const { database } = await createAdminClient();

    const bank = await database.listDocuments(
      DATABASE_ID!,
      BANK_COLLECTION_ID!,
      [Query.equal("accountId", [accountId])]
    );

    if (bank.total !== 1) return null;

    return parseStringify(bank.documents[0]);
  } catch (error) {
    console.error("Error", error);
    return null;
  }
};