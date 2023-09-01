import { databases } from "./config";

class DatabaseServices {
  async createDocument(
    databaseId: string,
    collectionId: string,
    documentId: string,
    data: object
  ) {
    try {
      const document = await databases.createDocument(
        databaseId,
        collectionId,
        documentId,
        data
      );

      if (document) {
        return document;
      }
    } catch (error) {
      throw error;
    }
  }

  async listDocuments(
    databaseId: string,
    collectionId: string,
    queries: string[]
  ) {
    try {
      const documents = await databases.listDocuments(
        databaseId,
        collectionId,
        queries
      );

      if (documents) {
        return documents;
      }
    } catch (error) {
      throw error;
    }
  }

  async getDocument(
    databaseId: string,
    collectionId: string,
    documentId: string
  ) {
    try {
      const document = await databases.getDocument(
        databaseId,
        collectionId,
        documentId
      );

      if (document) {
        return document;
      }
    } catch (error) {
      throw error;
    }
  }
}

const databaseServices = new DatabaseServices();

export default databaseServices;
