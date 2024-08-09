import PantryItemInput from "@/types/pantry";
import {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
} from "@google/generative-ai";

// Access your API key as an environment variable (see "Set up your API key" above)
const genAI = new GoogleGenerativeAI(
    process.env.NEXT_PUBLIC_GEMINI_API_KEY || ""
);
const generationConfig = {
    temperature: 0.7,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 2048,
    responseMimeType: "text/plain",
};
const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    generationConfig,
});

// Define the prompts
const recipePrompt = `You are a master chef. Please provide a recipe using the following ingredients. You don't have to use all of them, but take into account their counts. Feel free to include common items like spices, water, butter, etc. Return the recipe in a JSON format that can be parsed with JSON.parse. The JSON should have the following structure:
    {
        "name": "Recipe Name",
        "description": "Recipe Description",
        "servings": "Number of servings",
        "prep-time": "Preparation time",
        "cook-time": "Cooking time",
        "ingredients": [
            "Ingredient 1",
            "Ingredient 2",
            ...
        ],
        "instructions": [
            "Step 1",
            "Step 2",
            ...
        ]
    }
    Here are the ingredients: `;

const healthierPrompt = `You are a nutritionist. Provide up to 3 healthier alternatives for the following ingredients, given in form (ingredient-store). If no valid ingredients are provided, return just the word 'null'. Return an array of objects in JSON format with the structure: 
    {
        "name": "Ingredient Name",
        "cost": "10.00",
        "count": 2,
        "store": "Store of the item provided"
    }. 
    Here are the ingredients: `;

const shoppingPrompt = `You are a chef. Suggest up to 3 shopping items that complement the following ingredients, given in form (ingredient-store), and provide possible recipes. If no valid ingredients are provided, return just the word 'null'. Return an array of objects in JSON format with the structure: 
    {
        "name": "Item Name",
        "cost": "10.00",
        "count": 1,
        "store": "Store of the item provided"
    }. 
    Here are the ingredients: `;

const recipeResponse = async (pantry: PantryItemInput[]) => {
    if (pantry.length === 0) {
        return null
    }

    const items = pantry.map((item) => `${item.name} - (Count ${item.count})`);
    const prompt = `${recipePrompt} ${items.join(", ")}`;

    try {
        // Generate content using the model
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = await response.text();
        const cleanedText = text.replace(/```json|```/g, "").trim();
        const recipeObject = JSON.parse(cleanedText);

        return recipeObject;
    } catch (error) {
        console.error("Error generating recipe:", error);
        return "Error generating recipe";
    }
};

const healthierResponse = async (selectedItems: Set<string>) => {
    const items = Array.from(selectedItems);
    const prompt = `${healthierPrompt} ${items.join(", ")}`;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = await response.text();
        const cleanedText = text.replace(/```json|```/g, "").trim();

        const healthierObject = JSON.parse(cleanedText);
        return healthierObject;
    } catch (error) {
        console.error("Error generating healthier alternatives:", error);
        return "Error generating healthier alternatives";
    }
};

const shoppingResponse = async (selectedItems: Set<string>) => {
    const items = Array.from(selectedItems);
    const prompt = `${shoppingPrompt} ${items.join(", ")}`;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = await response.text();
        const cleanedText = text.replace(/```json|```/g, "").trim();
    
        const shoppingObject = JSON.parse(cleanedText);
        return shoppingObject;
    } catch (error) {
        console.error("Error generating shopping list:", error);
        return "Error generating shopping list";
    }
};

export { recipeResponse, healthierResponse, shoppingResponse };
