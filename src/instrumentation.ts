export async function register() {
    if (process.env.NEXT_RUNTIME === 'nodejs') {
        const cron = await import('node-cron');
        const { syncReviews } = await import('@/actions/google-actions');

        console.log("Initializing Cron Jobs...");

        // Run every 15 minutes
        cron.schedule('*/15 * * * *', async () => {
            console.log("Running Scheduled Sync...");
            try {
                await syncReviews();
                console.log("Scheduled Sync Complete.");
            } catch (error) {
                console.error("Scheduled Sync Failed:", error);
            }
        });
    }
}
