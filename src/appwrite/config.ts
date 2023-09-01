import { Account, Client, Databases, Query, ID, Models } from "appwrite";

const client = new Client();

client
  .setEndpoint(String(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT))
  .setProject(String(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID));

const account = new Account(client);
const databases = new Databases(client);

export { account, databases, Query, ID, client };
export type { Models };
