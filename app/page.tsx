"use client";
import Pantry from "@/components/Pantry";
import { usePantry } from "@/context/PantryContext";
import { useAuth } from "@/context/AuthContext";
import LoginPage from "./login/page";
import Nav from "@/components/Nav";
import { recipeResponse } from "@/config/gemini";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { LoaderCircle, Sparkles } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Recipe {
    name: string;
    description: string;
    servings: string;
    "prep-time": string;
    "cook-time": string;
    ingredients: string[];
    instructions: string[];
}

const Home = () => {
    const { authUser, isLoading: authLoading } = useAuth();
    const { pantry, pantryLoading } = usePantry();

    const [recipe, setRecipe] = useState<Recipe | null>(null);
    const [recipeLoading, setRecipeLoading] = useState(false);

    const handleGenerateRecipe = async () => {
        setRecipe(null);
        setRecipeLoading(true);
        try {
            const result = await recipeResponse(pantry);
            console.log(result);
            setRecipe(result);
        } catch (error) {
            console.error("Error generating recipe:", error);
        } finally {
            setRecipeLoading(false);
        }
    };

    // const openai = new OpenAI({
    //     apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
    // });

    // const response = async () => {
    //     const completion = await openai.chat.completions.create({
    //         messages: [
    //             {
    //                 role: "user",
    //                 content:
    //                     "You are a helpful assistant. Give me workout plans for each of the 7 days to become a better tennis player.",
    //             },
    //         ],
    //         model: "gpt-3.5-turbo",
    //     });

    //     console.log(completion.choices[0].message.content);
    // };

    // response();

    if (authUser && (authLoading || pantryLoading)) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                Loading...
            </div>
        );
    }
    return (
        <div>
            {!authUser ? (
                <LoginPage />
            ) : (
                <main className="flex min-h-screen flex-col items-center justify-start p-4">
                    <Nav />
                    <Pantry />
                    <div className="flex fixed bottom-6 right-6 rounded-full p-4">
                        <Button
                            onClick={handleGenerateRecipe}
                            disabled={recipeLoading}
                        >
                            {recipeLoading ? (
                                <LoaderCircle className="mr-2 animate-spin" />
                            ) : (
                                <Sparkles className="mr-2" />
                            )}
                            {recipeLoading
                                ? "Generating Recipe..."
                                : "Generate A Recipe"}
                        </Button>
                    </div>
                    {recipe && (
                        <>
                            <Card className="mt-6 p-4 max-w-lg mx-auto bg-white shadow-lg rounded-lg">
                                <CardHeader>
                                    <h2 className="text-xl font-semibold text-gray-800">
                                        {recipe.name}
                                    </h2>
                                    <p className="text-gray-600">
                                        {recipe.description}
                                    </p>
                                </CardHeader>
                                <CardContent className="mt-2">
                                    <div className="mb-4 flex flex-row gap-2 flex-wrap">
                                        <Badge
                                            variant="outline"
                                            className="bg-primary text-white"
                                        >
                                            {recipe.servings} Servings
                                        </Badge>
                                        <Badge
                                            variant="outline"
                                            className="bg-primary text-white"
                                        >
                                            Prep Time: {recipe["prep-time"]}
                                        </Badge>
                                        <Badge
                                            variant="outline"
                                            className="bg-primary text-white"
                                        >
                                            Cook Time: {recipe["cook-time"]}
                                        </Badge>
                                    </div>
                                    <div className="mb-4">
                                        <h3 className="text-lg font-semibold text-gray-700">
                                            Ingredients
                                        </h3>
                                        <ul className="list-disc list-inside pl-4">
                                            {recipe.ingredients.map(
                                                (ingredient, index) => (
                                                    <li key={index}>
                                                        {ingredient}
                                                    </li>
                                                )
                                            )}
                                        </ul>
                                    </div>
                                    <div className="mb-4">
                                        <h3 className="text-lg font-semibold text-gray-700">
                                            Instructions
                                        </h3>
                                        <ol className="list-decimal list-inside pl-4">
                                            {recipe.instructions.map(
                                                (instruction, index) => (
                                                    <li key={index}>
                                                        {instruction}
                                                    </li>
                                                )
                                            )}
                                        </ol>
                                    </div>
                                </CardContent>
                            </Card>
                        </>
                    )}
                </main>
            )}
        </div>
    );
};

export default Home;
