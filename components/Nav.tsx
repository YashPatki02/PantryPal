import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Logout from "./Logout";

function Nav() {
    return (
        <nav className="flex justify-between w-full max-w-4xl p-4">
            <Link href="/">
                <h1 className="text-2xl font-bold">Pantry</h1>
            </Link>
            <div className="flex flex-row gap-2">
                <Link href="/add-item">
                    <Button>Add Item</Button>
                </Link>
                <Link href="/cart">
                    <Button> Cart</Button>
                </Link>
                <Logout />
            </div>
        </nav>
    );
}

export default Nav;
