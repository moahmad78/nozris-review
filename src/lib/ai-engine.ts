
import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export class AIEngine {
    async generateReply(
        reviewText: string,
        starRating: number,
        reviewerName: string,
        tone: string = "Professional"
    ): Promise<{ reply: string; language: string; sentiment: string }> {

        const prompt = `
      You are a helpful customer support agent for a business. 
      Act with a ${tone} tone.
      Write a polite and professional reply to the following Google Review.
      
      Reviewer: ${reviewerName}
      Rating: ${starRating} Stars
      Review: "${reviewText}"
      
      Instructions:
      1. Detect the language of the review (e.g. "en", "es", "ja").
      2. Analyze sentiment: "Positive", "Neutral", "Negative".
      3. If rating is 4-5 stars: Thank them warmly.
      4. If rating is 1-3 stars: Apologize for the experience, be empathetic, and offer to resolve it.
      5. Keep it concise (max 3 sentences).
      6. Reply in the SAME language as the review.
      
      Output format JSON:
      {
        "language": "en",
        "sentiment": "Positive",
        "reply": "The reply text..."
      }
      `;

        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: "You are a helpful assistant that generates JSON responses." },
                { role: "user", content: prompt }
            ],
            response_format: { type: "json_object" }
        });

        const content = response.choices[0].message.content;
        if (!content) throw new Error("No response from AI");

        return JSON.parse(content);
    }
}
