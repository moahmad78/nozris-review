
import dotenv from 'dotenv';
import path from 'path';

// Explicitly load .env from project root
const envPath = path.resolve(process.cwd(), '.env');
console.log("Loading .env from:", envPath);
dotenv.config({ path: envPath });

console.log("Current Working Directory:", process.cwd());
console.log("OPENAI_API_KEY Status:", process.env.OPENAI_API_KEY ? "EXISTS" : "MISSING");
if (process.env.OPENAI_API_KEY) {
    console.log("OPENAI_API_KEY Length:", process.env.OPENAI_API_KEY.length);
    console.log("OPENAI_API_KEY Start:", process.env.OPENAI_API_KEY.substring(0, 5));
}

async function testAI() {
    console.log("Starting AI Test...");
    try {
        const { generateReviewReply } = await import('../src/lib/openai');

        const mockReview = {
            text: "The service was a bit slow but the food was amazing!",
            name: "Rahul Sharma",
            rating: 4
        };

        console.log(`\nReview: "${mockReview.text}"`);

        const reply = await generateReviewReply(
            mockReview.text,
            mockReview.name,
            mockReview.rating
        );

        console.log("--- AI Generated Reply ---\n");
        console.log(reply);
        console.log("\n--------------------------");
    } catch (error: any) {
        console.error("Test Failed Message:", error.message);
        if (error.response) {
            console.error("Status:", error.status);
            console.error("Code:", error.code);
        }
    }
}

testAI();
