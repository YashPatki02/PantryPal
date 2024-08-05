"use client";

import AddItem from "@/components/AddItem";
import Nav from "@/components/Nav";
import Link from "next/link";
import React from "react";

const AddItemPage = () => {
    
    return (
        <div className="flex min-h-screen flex-col items-center justify-start p-4">
            <Nav />
            <AddItem />
        </div>
    );
};

export default AddItemPage;
