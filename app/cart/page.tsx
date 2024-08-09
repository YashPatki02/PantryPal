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
        <div className="flex min-h-screen flex-col items-center justify-center">
            <Nav />
            <div className="grid grid-cols-1 md:grid-cols-3 mb-8 mt-6 gap-4">
                <div className="col-span-2 flex justify-start items-start overflow-scroll px-2">
                    <Cart />
                </div>
                <div className="col-span-1 md:border-l w-full flex justify-center items-center ">
                    <AddCart />
                </div>
            </div>
        </div>
    );
};

export default Home;
