import React, { useState } from "react";
import { useCart } from "@/context/CartContext";
import { usePantry } from "@/context/PantryContext";
import CartItem from "./CartItem";
import CartItemType from "@/types/cart";
import PantryItemInput from "@/types/pantry";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableHead,
    TableHeader,
    TableRow,
    TableCell,
} from "@/components/ui/table";
import { Button } from "./ui/button";

const Cart = () => {
    const { cart, setCart, updateCartItem, removeCartItem } = useCart();
    const { addPantryItem } = usePantry(); // Function to add item to pantry
    const [isEditing, setIsEditing] = useState<string | null>(null);
    const [editedItem, setEditedItem] = useState<CartItemType | null>(null);
    const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());


    // Group cart items by store
    const stores = cart.reduce((acc, item) => {
        if (!acc[item.store]) {
            acc[item.store] = [];
        }
        acc[item.store].push(item);
        return acc;
    }, {} as Record<string, CartItemType[]>);

    // Calculate total cost per store
    const storeTotals = Object.entries(stores).map(([store, items]) => {
        const total = items.reduce(
            (sum, item) => sum + item.cost * item.count,
            0
        );
        return { store, total, items };
    });

    const handleUpdate = async (updatedItem: CartItemType) => {
        if (updatedItem) {
            try {
                await updateCartItem(updatedItem);
                setIsEditing(null);
                setEditedItem(null);
            } catch (error) {
                console.error("Error updating item: ", error);
            }
        }
    };

    const handleDelete = async (itemToDelete: CartItemType) => {
        try {
            await removeCartItem(itemToDelete);
        } catch (error) {
            console.error("Error deleting item: ", error);
        }
    };

    const handleAddToPantry = async (items: CartItemType[]) => {
        try {
            const pantryItems: PantryItemInput[] = items.map((item) => ({
                name: item.name,
                count: item.count,
                cost: item.cost,
                store: item.store,
            }));
            for (const pantryItem of pantryItems) {
                await addPantryItem(pantryItem);
            }

            // Delete items from cart
            const updatedCart = cart.filter(
                (item) =>
                    !items.some(
                        (selected) =>
                            selected.name === item.name &&
                            selected.store === item.store
                    )
            );
            setCart(updatedCart);

            console.log(updatedCart);
        } catch (error) {
            console.error("Error adding items to pantry: ", error);
        }
    };

    const handleSelectedItems = async (action: "add" | "delete") => {
        const itemsToProcess = cart.filter((item) =>
            selectedItems.has(item.name + item.store)
        );
        if (action === "add") {
            await handleAddToPantry(itemsToProcess);
        } else if (action === "delete") {
            for (const item of itemsToProcess) {
                await handleDelete(item);
            }
        }
        // Clear selected items after action
        setSelectedItems(new Set());
    };

    const toggleItemSelection = (item: CartItemType) => {
        setSelectedItems((prevSelected) => {
            const key = item.name + item.store;
            const newSelected = new Set(prevSelected);
            if (newSelected.has(key)) {
                newSelected.delete(key);
            } else {
                newSelected.add(key);
            }
            return newSelected;
        });
    };

    return (
        <div>
            {cart.length === 0 ? (
                <div className="flex flex-grow items-center justify-center">
                    No items in your cart...
                </div>
            ) : (
                <>
                    {storeTotals.map(({ store, total, items }) => (
                        <div key={store} className="mb-8 max-sm:bg-red max-sm:p-6">
                            <div className="flex flex-row justify-between items-center">
                                <h2 className="text-xl font-bold">{store}</h2>
                                <h3 className="text-l text-primary">
                                    Total: ${total.toFixed(2)}
                                </h3>
                            </div>
                            {isEditing ? (
                                <CartItem
                                    item={editedItem as CartItemType}
                                    isEditing={true}
                                    onEdit={() => {}}
                                    onCancelEdit={() => {
                                        setIsEditing(null);
                                        setEditedItem(null);
                                    }}
                                    onUpdate={handleUpdate}
                                    onDelete={() => {}}
                                    editedItem={editedItem as CartItemType}
                                    setEditedItem={setEditedItem}
                                    isSelected={false}
                                    toggleItemSelection={() => {}}
                                />
                            ) : (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Select</TableHead>
                                            <TableHead>Name</TableHead>
                                            <TableHead>Count</TableHead>
                                            <TableHead>Cost</TableHead>
                                            <TableHead>Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {items.map((item, index) => (
                                            
                                                <CartItem
                                                    key={index}
                                                    item={item}
                                                    isEditing={
                                                        isEditing ===
                                                            item.name &&
                                                        item.store ===
                                                            item.store
                                                    }
                                                    onEdit={() => {
                                                        setIsEditing(item.name);
                                                        setEditedItem(item);
                                                    }}
                                                    onCancelEdit={() => {
                                                        setIsEditing(null);
                                                        setEditedItem(null);
                                                    }}
                                                    onUpdate={handleUpdate}
                                                    onDelete={() =>
                                                        handleDelete(item)
                                                    }
                                                    editedItem={
                                                        editedItem || item
                                                    }
                                                    setEditedItem={
                                                        setEditedItem
                                                    }
                                                    isSelected={selectedItems.has(
                                                    item.name + item.store
                                                )}
                                                toggleItemSelection={() =>
                                                    toggleItemSelection(item)
                                                }
                                                />
                                        ))}
                                    </TableBody>
                                </Table>
                            )}
                        </div>
                    ))}
                    {selectedItems.size > 0 && (
                        <div className="fixed bottom-0 left-0 right-0 p-4 bg-gray-100 flex justify-between items-center">
                            <Button
                                className="px-4 py-2 bg-green-500 text-white rounded"
                                onClick={() => handleSelectedItems("add")}
                            >
                                Add to Pantry
                            </Button>
                            <Button
                                className="px-4 py-2 bg-red-500 text-white rounded"
                                onClick={() => handleSelectedItems("delete")}
                            >
                                Delete
                            </Button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default Cart;


