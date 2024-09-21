"use server";
import { ID } from "node-appwrite";
import { createAdminClient, createSessionClient } from "../appwrite";
import { cookies } from "next/headers";
import { parseStringify } from "../utils";

export const signUp = async (data: SignUpParams) => {
  const { email, password, firstName, lastName } = data;
  try {
    //create appwrite admin instance to be able to communicate with appwrite
    //in creating account with user form details

    const { account } = await createAdminClient();

    //retrieve new account
    const newUserAccount = await account.create(
      ID.unique(),
      email,
      password,
      `${firstName}${lastName}`
    );

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
    return parseStringify(newUserAccount);
  } catch (error) {
    console.log(error);
  }
};

export const signIn = async ({ email, password }: signInProps) => {
  try {
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

    return session;

  } catch (error) {
    console.log('Error signing into application', error);
  }
};

export async function getLoggedInUser() {
  try {
    const { account } = await createSessionClient();
    const user = await account.get();
    return parseStringify(user);
  } catch (error) {
    console.log("Error fetching logged-in user due to :", error);
    return null;
  }
}

export async function logoutAccount() {
  try {
    const { account } = await createSessionClient();

    //delete cookie
    cookies().delete("appwrite-session");

    //delete session
    await account.deleteSession("current");
  } catch (error) {
    console.log("Error", error);
  }
}
