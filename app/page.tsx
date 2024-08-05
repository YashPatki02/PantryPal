"use client";
import Pantry from "@/components/Pantry";
import { usePantry } from "@/context/PantryContext";
import { useAuth } from "@/context/AuthContext";
import LoginPage from "./login/page";
import Nav from "@/components/Nav";

// import OpenAI from "openai";

const Home = () => {
    const { authUser, isLoading: authLoading } = useAuth();
    const { pantry, pantryLoading } = usePantry();

    // const openai = new OpenAI({
    //     apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
    //     dangerouslyAllowBrowser: true,
    // });

    // const fun = async () => {
    //     const completion = await openai.chat.completions.create({
    //         messages: [
    //             { role: "system", content: "You are a helpful assistant." },
    //         ],
    //         model: "gpt-3.5-turbo",
    //     });
    //     console.log(completion.choices[0]);
    // };

    // fun();
    // console.log(authUser, authLoading, pantry, pantryLoading);

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
                </main>
            )}
        </div>
    );
};

export default Home;
