const OpenAI = require('openai');
const dotenv = require('dotenv');

// Importing environment variables
dotenv.config();

// Initialize OpenAI instance
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// Function to run GPT4Vision
const gpt4Vision = async (base64Image) => {
    // Prompt for GPT4Vision
    const prompt = `
        Hello! I need your expertise as a medication specialist. I'll be providing you with images of medication bottles, medicine scripts, medicine wrapper images, or any images containing medication labels. Your task is to extract the medication data and provide it to me in JSON format.

        The JSON format should include the following fields:
        - "name": The name of the medication (string).
        - "strength": The strength of the medication (string).
        - "instructions": Any instructions related to the medication (string).
        - "reason for use": The reason for using the medication (string).
        - "prescribing physician": The name of the prescribing physician (string).
        - "start date": The start date of medication usage (string).
        - "end date": The end date of medication usage (string).

        Here is the Ouput JSON format: 
        {
            "name": "Botulinum Toxin Type A",
            "strength": "100 units/vial",
            "instructions": "For Injection",
            "reason for use": "Nausea, Headache",
            "prescribing physician": "Dr. Sean",
            "start date": "6 June 2023",
            "end date": "12 August 2025"
        }

        If any of the data mentioned above is not present in the image, please use your expertise to suggest the correct data. If you are unable to determine any specific information, simply write "Not Given" in the respective field.

        Please ensure that you only return the extracted medication data in JSON format according to the specified structure,and please donot!!! return anything except JSON structure it's important to note to not return anything rahter than JSON.

        Don't return anything like "I'm sorry, but I can't assist with that request." or anyother thing rather than JSON response if you are not able to retrieve then simply respond "Not able to Parse".
    `;

    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-4-turbo',
            messages: [
                {
                    role: 'user',
                    content: [
                        { type: 'text', text: prompt },
                        {
                            type: 'image_url',
                            image_url: {
                                url: `data:image/jpeg;base64,${base64Image}`,
                            },
                        },
                    ],
                }
            ],
            max_tokens: 1000,
        });

        // Extract the JSON string from response.message.content
        const jsonString = response.choices[0].message.content;

        // Remove the starting and ending backticks and any additional formatting
        const jsonResponse = jsonString.replace(/^```json\n/, '').replace(/```$/, '');

        return jsonResponse;

    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};

module.exports = gpt4Vision;
