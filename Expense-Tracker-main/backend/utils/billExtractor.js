import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs/promises";

// Get the API key from environment variables
const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

// Initialize the Gemini model
const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
});

const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain",
};

// Extract bill details using Gemini API
export async function extractBill(filePath) {
    try {
        // Read the file and convert to base64
        const imageBuffer = await fs.readFile(filePath);
        const imageBase64 = imageBuffer.toString("base64");

        // Correct API call using generateContent()
        const result = await model.generateContent({
            contents: [
                {
                    role: "user",
                    parts: [
                        {
                            inlineData: {
                                mimeType: "image/jpeg",
                                data: imageBase64,
                            },
                        },
                        {
                            text: "Extract the following details from the bill image:\n" +
                                "- Vendor Name\n" +
                                "- Type of the Expense\n" +
                                "- Category of the Expense\n" +
                                "- Bill Date\n" +
                                "- Total Amount\n" +
                                "Return the data in valid JSON format.",
                        },
                    ],
                },
            ],
            generationConfig,
        });

        // ✅ Correct way to get the response text
        console.log("Raw result:", JSON.stringify(result, null, 2));

        // Extract text response correctly
        const responseText = result.response.candidates[0].content.parts[0].text.trim();

        // ✅ Remove backticks and parse clean JSON
        const cleanedResponse = responseText.replace(/```json\n|```/g, "").trim();


        console.log("Extracted Bill Data:", cleanedResponse);
        return cleanedResponse;
    } catch (error) {
        console.error("Error while extracting bill:", error.message);
        throw error;
    }
}
