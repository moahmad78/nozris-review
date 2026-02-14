import OpenAI from 'openai';

interface AIResponse {
    reply: string;
    sentiment: "Positive" | "Neutral" | "Negative";
}

export async function generateReviewReply(
    reviewText: string,
    reviewerName: string,
    starRating: number,
    preferredTone: string = "Professional"
): Promise<AIResponse | null> {

    if (!process.env.OPENAI_API_KEY) {
        console.warn("OpenAI API Key missing. Skipping AI generation.");
        return null;
    }

    const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
    });

    const systemPrompt = `
    Identity:
    You are "Nozris AI", an expert Reputation Manager.
    
    Goal:
    1. Analyze the sentiment of the review (Positive, Neutral, Negative).
    2. Write a reply in a "${preferredTone}" tone.
    3. Output the result in valid JSON format ONLY.

    Rules:
    - **Language Matching**: Reply in the SAME language as the review (Hindi, English, Hinglish).
    - **Context**: Use the reviewer's name ("${reviewerName}") and reference specific details from their review.
    - **Star Rating Logic**:
       - 5 Stars: Thank warmly + Loyalty Reward.
       - 4 Stars: Thank + Ask for feedback.
       - 1-3 Stars: Apologize + Direct to support@nozris.com.
    - **Signature**: Sign off as "Regards, Team Nozris".
    
    Input Review:
    "${reviewText}" (Rating: ${starRating}/5)

    Output Format (JSON):
    {
        "sentiment": "Positive" | "Neutral" | "Negative",
        "reply": "Your reply here..."
    }
  `;

    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [{ role: "system", content: systemPrompt }],
            temperature: 0.7,
            response_format: { type: "json_object" } // Force JSON
        });

        const content = response.choices[0].message?.content;
        if (!content) return null;

        const result = JSON.parse(content) as AIResponse;
        return result;

    } catch (error: any) {
        if (error.code === 'insufficient_quota') {
            console.error("CRITICAL: OpenAI Quota Exceeded.");
            throw new Error("OPENAI_QUOTA_EXCEEDED");
        }
        console.error("AI Reply Error:", error);
        return null;
    }
}
