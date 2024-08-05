import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Logout from "./Logout";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

function Nav() {
    const { signOut } = useAuth();

    const handleLogout = async () => {
        try {
            await signOut();
            console.log("Logged out successfully!");
        } catch (error: Error | any) {
            alert(error.message);
            return;
        }
    };
    return (
        <nav className="flex justify-between items-center w-full max-w-4xl p-4">
            <Link href="/">
                <h1 className="text-2xl font-bold">PantryPal</h1>
            </Link>
            <div className="flex flex-row gap-2 max-sm:hidden">
                <Link href="/add-item">
                    <Button>Add Item</Button>
                </Link>
                <Link href="/cart">
                    <Button> Cart</Button>
                </Link>
                <Logout />
            </div>
            <div className="hidden max-sm:flex">
            <DropdownMenu>
                <DropdownMenuTrigger>
                    <MoreVertical size={24} />
                </DropdownMenuTrigger>
                <DropdownMenuContent side="bottom" align="end">
                    <DropdownMenuItem>
                        <Link href="/add-item">
                            Add Item
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <Link href="/cart">
                            Cart
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleLogout}>
                        Logout
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            </div>
        </nav>
    );
}

export default Nav;
