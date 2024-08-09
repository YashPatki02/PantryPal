import React, { useEffect, useState } from "react";
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
import { LoaderCircle, Plus, Salad, ShoppingCart, Trash } from "lucide-react";
import { healthierResponse, shoppingResponse } from "@/config/gemini";

const Cart = () => {
    const { cart, setCart, updateCartItem, removeCartItem } = useCart();
    const { addPantryItem } = usePantry(); // Function to add item to pantry
    const [isEditing, setIsEditing] = useState<string | null>(null);
    const [editedItem, setEditedItem] = useState<CartItemType | null>(null);
    const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
    const [alternativesLoading, setAlternativesLoading] = useState(false);
    const [shoppingLoading, setShoppingLoading] = useState(false);
    const [healthierAlternatives, setHealthierAlternatives] = useState([]);
    const [shoppingItems, setShoppingItems] = useState([]);

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
            selectedItems.has(`${item.name}-${item.store}`)
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
            const key = `${item.name}-${item.store}`;
            const newSelected = new Set(prevSelected);
            if (newSelected.has(key)) {
                newSelected.delete(key);
            } else {
                newSelected.add(key);
            }
            return newSelected;
        });
    };

    const giveHealthierAlternatives = async () => {
        setAlternativesLoading(true);
        console.log(selectedItems);
        try {
            const result = await healthierResponse(selectedItems);
            setHealthierAlternatives(result);
        } catch (error) {
            console.error("Error generating healthier alternatives:", error);
        } finally {
            setAlternativesLoading(false);
        }
    };

    const giveShoppingItems = async () => {
        setShoppingLoading(true);
        try {
            const result = await shoppingResponse(selectedItems);
            setShoppingItems(result);
        } catch (error) {
            console.error("Error generating shopping items:", error);
        } finally {
            setShoppingLoading(false);
        }
    };

    useEffect(() => {
        if (selectedItems.size === 0) {
            setHealthierAlternatives([]);
            setShoppingItems([]);
        }
    }, [selectedItems]);

    return (
        <div>
            {cart.length === 0 ? (
                <div className="flex flex-grow items-center justify-center">
                    No items in your cart...
                </div>
            ) : (
                <>
                    {selectedItems && healthierAlternatives.length > 0 && (
                        <div className="w-auto p-4 flex flex-col justify-start items-start gap-2 rounded-md shadow-lg flex-wrap">
                            <h3 className="text-lg font-bold">
                                Healthier Alternatives
                            </h3>
                            <ul className="list-disc ml-6 list-inside">
                                {healthierAlternatives.map(
                                    (item: PantryItemInput, index) => (
                                        <li key={index}>{item.name}</li>
                                    )
                                )}
                            </ul>
                        </div>
                    )}
                    {selectedItems && shoppingItems.length > 0 && (
                        <div className="w-auto p-4 flex flex-col justify-start items-start gap-2 rounded-md shadow-lg flex-wrap">
                            <h3 className="text-lg font-bold">
                                Shopping Suggestions
                            </h3>
                            <ul className="list-disc ml-6 list-inside">
                                {shoppingItems.map(
                                    (item: PantryItemInput, index) => (
                                        <li key={index}>{item.name}</li>
                                    )
                                )}
                            </ul>
                        </div>
                    )}
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
                        storeTotals.map(({ store, total, items }) => (
                            <div
                                key={store}
                                className="mb-8 flex flex-col items-start gap-2 rounded-md shadow-lg"
                            >
                                <div className="flex flex-col items-start px-6">
                                    <h2 className="text-xl font-bold">
                                        {store}
                                    </h2>
                                    <h3 className="text-l text-primary right-0">
                                        Total: ${total.toFixed(2)}
                                    </h3>
                                </div>

                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Select</TableHead>
                                            <TableHead>Name</TableHead>
                                            <TableHead>Count</TableHead>
                                            <TableHead>Cost</TableHead>
                                            <TableHead>Store</TableHead>
                                            <TableHead>Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {items.map((item, index) => (
                                            <CartItem
                                                key={index}
                                                item={item}
                                                isEditing={
                                                    isEditing === item.name &&
                                                    item.store === item.store
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
                                                editedItem={editedItem || item}
                                                setEditedItem={setEditedItem}
                                                isSelected={selectedItems.has(
                                                    `${item.name}-${item.store}`
                                                )}
                                                toggleItemSelection={() =>
                                                    toggleItemSelection(item)
                                                }
                                            />
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        ))
                    )}

                    {selectedItems.size > 0 && (
                        <div className="fixed bg-white bottom-4 left-4 right-4 w-auto p-4 flex justify-center items-center gap-2 rounded-md shadow-lg flex-wrap">
                            <Button
                                className="px-4 py-2 rounded"
                                onClick={() => handleSelectedItems("add")}
                                variant="outline"
                            >
                                <Plus className="mr-2" />
                                Add to Pantry
                            </Button>
                            <Button
                                onClick={giveHealthierAlternatives}
                                disabled={alternativesLoading}
                            >
                                {alternativesLoading ? (
                                    <LoaderCircle className="mr-2 animate-spin" />
                                ) : (
                                    <Salad className="mr-2" />
                                )}
                                {alternativesLoading
                                    ? "Getting Alternatives..."
                                    : "Get Alternatives"}
                            </Button>
                            <Button
                                onClick={giveShoppingItems}
                                disabled={shoppingLoading}
                            >
                                {shoppingLoading ? (
                                    <LoaderCircle className="mr-2 animate-spin" />
                                ) : (
                                    <ShoppingCart className="mr-2" />
                                )}
                                {shoppingLoading
                                    ? "Getting Suggestions..."
                                    : "Get Suggestions"}
                            </Button>
                            <Button
                                className="px-4 py-2"
                                variant="destructive"
                                onClick={() => handleSelectedItems("delete")}
                            >
                                <Trash className="mr-2" />
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
