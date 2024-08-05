"use client";
import Pantry from "@/components/Pantry";
import { usePantry } from "@/context/PantryContext";
import { useAuth } from "@/context/AuthContext";
import LoginPage from "./login/page";
import Nav from "@/components/Nav";

const Home = () => {
    const { authUser, isLoading: authLoading } = useAuth();
    const { pantry, pantryLoading } = usePantry();

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
