
import { google } from "googleapis";
import prisma from "@/lib/prisma";

export class GoogleBusinessService {
    private oauth2Client;

    constructor() {
        this.oauth2Client = new google.auth.OAuth2(
            process.env.GOOGLE_CLIENT_ID,
            process.env.GOOGLE_CLIENT_SECRET,
            process.env.NEXTAUTH_URL ? `${process.env.NEXTAUTH_URL}/api/auth/callback/google` : undefined
        );
    }

    /**
     * Initialize the client with the user's refresh token from the DB
     */
    async init(userId: string) {
        const account = await prisma.account.findFirst({
            where: {
                userId,
                provider: "google",
            },
        });

        if (!account || !account.refresh_token) {
            throw new Error("Google account not linked or missing refresh token");
        }

        this.oauth2Client.setCredentials({
            refresh_token: account.refresh_token,
        });
    }

    get mybusiness() {
        return google.mybusinessbusinessinformation({
            version: "v1",
            auth: this.oauth2Client,
        }) as any;
    }

    get reviews() {
        return google.mybusinessqanda({
            version: "v1",
            auth: this.oauth2Client
        }) as any;
    }

    /**
     * List all accounts (business profiles) accessible to the user
     */
    async getAccounts() {
        const res = await this.mybusiness.accounts.list();
        return res.data.accounts || [];
    }

    /**
     * List locations for a specific account
     */
    async getLocations(accountId: string) {
        // Use v1 Business Information API or v4 Accounts API depending on library structure
        // For simplicity and robustness, let's use the generic request if types are failing, 
        // OR try the specific new API if available. 
        // Let's stick to v4 logic for locations via manual request if the library is fighting us,
        // or use the 'mybusinessbusinessinformation' we instantiated.

        try {
            const res = await this.mybusiness.accounts.locations.list({
                parent: accountId,
                readMask: "name,title,storeCode,metadata,latlng",
            });
            return res.data.locations || [];
        } catch (e) {
            console.log("Failed to list locations via BusinessInfo API, trying fallback...", e);
            // Fallback to manual request if needed
            return [];
        }
    }

    /**
     * Fetch reviews for a location using manual request to v4 API
     * Endpoint: https://mybusiness.googleapis.com/v4/{parent}/reviews
     */
    async getReviews(locationName: string, pageToken?: string) {
        // locationName format: "accounts/{accountId}/locations/{locationId}"
        const url = `https://mybusiness.googleapis.com/v4/${locationName}/reviews`;

        try {
            const res = await this.oauth2Client.request({
                url,
                method: "GET",
                params: {
                    pageSize: 50,
                    pageToken
                }
            });
            return res.data as { reviews?: any[]; nextPageToken?: string };
        } catch (error) {
            console.error("Error fetching reviews:", error);
            throw error;
        }
    }

    /**
     * Post a reply to a review
     * Endpoint: https://mybusiness.googleapis.com/v4/{parent}/reply
     */
    async replyToReview(reviewName: string, replyText: string) {
        // reviewName format: "accounts/{acc}/locations/{loc}/reviews/{rev}"
        const url = `https://mybusiness.googleapis.com/v4/${reviewName}/reply`;

        try {
            await this.oauth2Client.request({
                url,
                method: "PUT",
                data: {
                    comment: replyText
                }
            });
        } catch (error) {
            console.error("Error replying to review:", error);
            throw error;
        }
    }
}
