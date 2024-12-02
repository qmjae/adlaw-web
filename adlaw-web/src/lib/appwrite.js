import { Client, Account, Databases, Storage, Query } from 'appwrite';

const client = new Client()
    .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT)
    .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID);

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);

// Database and collection IDs
export const DATABASES = {
    DEFAULT: import.meta.env.VITE_APPWRITE_DATABASE_ID // "adlaw-db"
};

export const COLLECTIONS = {
    USERS: import.meta.env.VITE_APPWRITE_USERS_COLLECTION_ID,
    DEFECTS: import.meta.env.VITE_APPWRITE_DEFECTS_COLLECTION_ID,
    HISTORY: import.meta.env.VITE_APPWRITE_HISTORY_COLLECTION_ID
};

// Analysis service
export const analysisService = {
    async createAnalysis(userId, images, results) {
        return await databases.createDocument(
            DATABASES.DEFAULT,
            COLLECTIONS.HISTORY,
            'unique()',
            {
                userId,
                images,
                results,
                createdAt: new Date().toISOString(),
                status: 'completed'
            }
        );
    },

    async getAnalysisHistory(userId) {
        return await databases.listDocuments(
            DATABASES.DEFAULT,
            COLLECTIONS.HISTORY,
            [
                Query.equal('userId', userId),
                Query.orderDesc('createdAt')
            ]
        );
    },

    async uploadImage(file) {
        const result = await storage.createFile(
            import.meta.env.VITE_APPWRITE_STORAGE_BUCKET_ID, // "defect-images"
            'unique()',
            file
        );
        return result.$id;
    },

    getImageUrl(fileId) {
        return storage.getFileView(
            import.meta.env.VITE_APPWRITE_STORAGE_BUCKET_ID,
            fileId
        );
    }
};

// Defect service
export const defectService = {
    async saveDefectData(userId, imageUrl, defectData) {
        return await databases.createDocument(
            DATABASES.DEFAULT,
            COLLECTIONS.DEFECTS,
            'unique()',
            {
                userId,
                imageUrl,
                defectType: defectData.type,
                severity: defectData.severity || 'medium',
                timestamp: new Date().toISOString()
            }
        );
    },

    async getDefectsByUserId(userId) {
        return await databases.listDocuments(
            DATABASES.DEFAULT,
            COLLECTIONS.DEFECTS,
            [
                Query.equal('userId', userId),
                Query.orderDesc('timestamp')
            ]
        );
    }
};

// User service
export const userService = {
    async createUser(email, password, username) {
        // Create account
        await account.create('unique()', email, password, username);
        // Create user document
        return await databases.createDocument(
            DATABASES.DEFAULT,
            COLLECTIONS.USERS,
            'unique()',
            {
                username,
                email,
                createdAt: new Date().toISOString(),
                avatar: null,
                bio: ''
            }
        );
    },

    async updateProfile(userId, data) {
        return await databases.updateDocument(
            DATABASES.DEFAULT,
            COLLECTIONS.USERS,
            userId,
            data
        );
    },

    async getCurrentUser() {
        return await account.get();
    }
};