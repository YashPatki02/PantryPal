"use client";
import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    ReactNode,
} from "react";
import PantryItem from "@/types/pantry";
import {
    getUserPantryItems,
    addPantryToDB,
    updatePantryItemInDB,
    deletePantryItemFromDB,
} from "@/config/firestore";
import { useAuth } from "@/context/AuthContext";

interface PantryContextProps {
    pantry: PantryItem[];
    setPantry: (pantry: PantryItem[]) => void;
    pantryLoading: boolean;
    addPantryItem: (item: PantryItem) => Promise<void>;
    updatePantryItem: (item: PantryItem) => Promise<void>;
    deletePantryItem: (item: PantryItem) => Promise<void>;
}

const PantryContext = createContext<PantryContextProps | undefined>(undefined);

export const PantryProvider = ({ children }: { children: ReactNode }) => {
    const { authUser, isLoading: authLoading } = useAuth();
    const [pantry, setPantry] = useState<PantryItem[]>([]);
    const [pantryLoading, setPantryLoading] = useState(false);

    useEffect(() => {
        const fetchPantryItems = async () => {
            setPantryLoading(true);
            try {
                if (authUser) {
                    const items = await getUserPantryItems();
                    setPantry(items);
                }
            } catch (error) {
                console.error("Error fetching pantry items:", error);
            } finally {
                setPantryLoading(false);
            }
        };

        if (!authLoading) {
            if (authUser) {
                fetchPantryItems();
            } else {
                setPantry([]); // Reset pantry if the user is not logged in
            }
        }
    }, [authLoading, authUser]);

    const addPantryItem = async (item: PantryItem) => {
        setPantryLoading(true);

        try {
            await addPantryToDB(item);

            // Update local state
            const existingItem = pantry.find(
                (i) => i.name === item.name && i.store === item.store
            );
            if (existingItem) {
                const updatedItem = {
                    ...existingItem,
                    count: existingItem.count + item.count,
                };
                setPantry(
                    pantry.map((i) =>
                        i.name === item.name && i.store === item.store
                            ? updatedItem
                            : i
                    )
                );
            } else {
                setPantry([...pantry, item]);
            }
        } catch (error) {
            console.error("Error adding item to pantry:", error);
        } finally {
            setPantryLoading(false);
        }
    };

    const updatePantryItem = async (updatedItem: PantryItem) => {
        try {
            await updatePantryItemInDB(updatedItem);
            setPantry(
                pantry.map((item) =>
                    item.name === updatedItem.name ? updatedItem : item
                )
            );
        } catch (error) {
            console.error("Error updating pantry item:", error);
        } 
    };

    const deletePantryItem = async (itemToDelete: PantryItem) => {
        setPantryLoading(true);

        try {
            await deletePantryItemFromDB(itemToDelete);
            setPantry(
                pantry.filter(
                    (item) =>
                        item.name !== itemToDelete.name ||
                        item.store !== itemToDelete.store
                )
            );
        } catch (error) {
            console.error("Error deleting pantry item:", error);
        } finally {
            setPantryLoading(false);
        }
    };

    return (
        <PantryContext.Provider
            value={{
                pantry,
                setPantry,
                pantryLoading,
                addPantryItem,
                updatePantryItem,
                deletePantryItem,
            }}
        >
            {children}
        </PantryContext.Provider>
    );
};

export const usePantry = () => {
    const context = useContext(PantryContext);
    if (!context) {
        throw new Error("usePantry must be used within a PantryProvider");
    }
    return context;
};
