"use client";

import { usePantry } from "@/context/PantryContext";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import Cart from "@/components/Cart";
import AddCart from "@/components/AddCart";
import Nav from "@/components/Nav";
import { useEffect } from "react";
import { redirect } from "next/navigation";

const Home = () => {
    const { authUser, isLoading: authLoading } = useAuth();
    const { pantry, pantryLoading } = usePantry();
    const { cart, cartLoading } = useCart();

    useEffect(() => {
        if (!authUser) {
            redirect("/login");
        }
    }, [authUser]);

    if (authUser && (authLoading || pantryLoading || cartLoading)) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                Loading...
            </div>
        );
    }
    return (
        <div className="flex min-h-screen flex-col items-center justify-start p-4">
            <Nav />
            <div className="flex flex-row max-sm:flex-col gap-2 min-w-[80%] justify-center items-start mt-6">
                <div className="max-sm:w-full w-[70%] flex justify-center items-center">
                    <Cart />
                </div>
                <div className="max-sm:w-full max-sm:border-none border-l w-[30%]">
                    <AddCart />
                </div>
            </div>
        </div>
    );
};

export default Home;
