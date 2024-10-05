//refer docs for appwrite with next

"use server";
import { Client, Account, Databases, Users } from "node-appwrite";
import { cookies } from "next/headers";

// Here we use an SDK provided by app-write to generate a client
// and this client will be used to interact with the backend app securely
// on behalf of the user. This will occur once we know that there is a valid session
// cookie present in the browser that appwrite stores post auth. So if a user wants to access
// a resource using front end, then this utility is called to check for an existing session cookie
// if present, we read off of it and associate the newly created client with that session exposing
// the methods to access appwrite resources
// if no session, we error out and handle with redirection to login

export async function createSessionClient() {
  const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!);

  const session = cookies().get("appwrite-session");
  if (!session || !session.value) {
    throw new Error("No session");
  }

  client.setSession(session.value);

  return {
    get account() {
      return new Account(client);
    },
    get dataBase() {
      return new Databases(client);
    },
    get users() {
      return new Users(client);
    },
  };
}

// used to interact with the appwrite DB, provide resources
// with which we can create account when user tries to sign up
export async function createAdminClient() {
  //Typescript by default will check for env vars and assume them to
  //be undefined. We use the non-null assertion operator in TS to ensure that the compiler
  // understands that this is always defined
  const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!)
    .setKey(process.env.NEXT_APPWRITE_KEY!);

  return {
    get account() {
      return new Account(client);
    },
    get database() {
      return new Databases(client);
    },
    get users() {
      return new Users(client);
    },
  };
}


