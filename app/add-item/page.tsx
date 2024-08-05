"use client";

import AddItem from "@/components/AddItem";
import Nav from "@/components/Nav";
import React from "react";
import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { redirect } from "next/navigation";

const AddItemPage = () => {
    const { authUser, isLoading: authLoading } = useAuth();

    useEffect(() => {
        if (!authUser) {
            redirect("/login");
        }
    }, [authUser]);
    
    return (
        <div className="flex min-h-screen flex-col items-center justify-start p-4">
            <Nav />
            <AddItem />
        </div>
    );
};

export default AddItemPage;
