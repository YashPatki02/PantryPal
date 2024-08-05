"use client";
import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    ReactNode,
} from "react";
import { useAuth } from "@/context/AuthContext";
import CartItem from "@/types/cart"; // Adjust import path as needed
import {
    getUserCartItems,
    addCartItemToDB,
    updateCartItemInDB,
    deleteCartItemFromDB,
} from "@/config/firestore"; // Adjust import path as needed

interface CartContextProps {
    cart: CartItem[];
    setCart: (cart: CartItem[]) => void;
    cartLoading: boolean;
    addCartItem: (item: CartItem) => void;
    updateCartItem: (item: CartItem) => void;
    removeCartItem: (item: CartItem) => void;
}

const CartContext = createContext<CartContextProps | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
    const { authUser, isLoading: authLoading } = useAuth();
    const [cart, setCart] = useState<CartItem[]>([]);
    const [cartLoading, setCartLoading] = useState(false);

    useEffect(() => {
        const fetchCartItems = async () => {
            setCartLoading(true);
            try {
                if (authUser) {
                    const items = await getUserCartItems();
                    setCart(items);
                }
            } catch (error) {
                console.error("Error fetching cart items:", error);
            } finally {
                setCartLoading(false);
            }
        };

        if (!authLoading) {
            if (authUser) {
                fetchCartItems();
            } else {
                setCart([]); // Reset cart if the user is not logged in
            }
        }
    }, [authLoading, authUser]);

    const addCartItem = async (item: CartItem) => {
        setCartLoading(true);

        // If item name already in cart, append count to it
        const existingItem = cart.find(
            (i) => i.name === item.name && i.store === item.store
        );
        if (existingItem) {
            const updatedItem = {
                ...existingItem,
                count: existingItem.count + item.count,
                cost: existingItem.cost + item.cost, // Assuming cost accumulates; adjust if necessary
            };
            setCart(
                cart.map((i) =>
                    i.name === item.name && i.store === item.store
                        ? updatedItem
                        : i
                )
            );
            await updateCartItemInDB(updatedItem); 
        } else {
            setCart([...cart, item]);
            await addCartItemToDB(item); 
        }

        setCartLoading(false);
    };

    const updateCartItem = async (updatedItem: CartItem) => {
        setCart(
            cart.map((item) =>
                item.name === updatedItem.name &&
                item.store === updatedItem.store
                    ? updatedItem
                    : item
            )
        );
        await updateCartItemInDB(updatedItem); // Update in Firestore
    };

    const removeCartItem = async (itemToRemove: CartItem) => {
        setCart(
            cart.filter(
                (item) =>
                    item.name !== itemToRemove.name ||
                    item.store !== itemToRemove.store
            )
        );
        await deleteCartItemFromDB(itemToRemove); // Remove from Firestore
    };

    return (
        <CartContext.Provider
            value={{
                cart,
                setCart,
                cartLoading,
                addCartItem,
                updateCartItem,
                removeCartItem,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
};
