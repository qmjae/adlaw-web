import { Client, Account, Databases, Storage, ID, Query } from 'appwrite';

const client = new Client()
    .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT)
    .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID);

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);

const requiredEnvVars = [
  'VITE_APPWRITE_ENDPOINT',
  'VITE_APPWRITE_PROJECT_ID',
  'VITE_APPWRITE_DATABASE_ID',
  'VITE_APPWRITE_DEFECTS_COLLECTION_ID'
];

requiredEnvVars.forEach(varName => {
  if (!import.meta.env[varName]) {
    throw new Error(`Missing required environment variable: ${varName}`);
  }
});

// Save defect analysis result
export const saveDefectAnalysis = async (analysisData) => {
    try {
        return await databases.createDocument(
            import.meta.env.VITE_APPWRITE_DATABASE_ID,
            import.meta.env.VITE_APPWRITE_DEFECTS_COLLECTION_ID,
            ID.unique(),
            {
                userId: analysisData.userId,
                imageUrl: analysisData.imageUrl,
                defectType: analysisData.defectType,
                confidence: analysisData.confidence,
                severity: analysisData.severity,
                timestamp: new Date().toISOString()
            }
        );
    } catch (error) {
        throw error;
    }
};

// Get user's defect history
export const getUserDefects = async (userId) => {
    try {
        return await databases.listDocuments(
            import.meta.env.VITE_APPWRITE_DATABASE_ID,
            import.meta.env.VITE_APPWRITE_DEFECTS_COLLECTION_ID,
            [
                Query.equal('userId', userId),
                Query.orderDesc('timestamp'),
                Query.limit(100)
            ]
        );
    } catch (error) {
        throw error;
    }
};