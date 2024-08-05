"use client";

import React, { useState } from "react";
import { usePantry } from "@/context/PantryContext";
import { useCart } from "@/context/CartContext";
import PantryItem from "./PantryItem";
import PantryItemInput from "@/types/pantry";
import CartItemInput from "@/types/cart";
import {
    Table,
    TableHeader,
    TableRow,
    TableHead,
    TableBody,
    TableCell,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

const Pantry = () => {
    const { pantry, updatePantryItem, deletePantryItem } = usePantry();
    const { addCartItem } = useCart();
    const [isEditing, setIsEditing] = useState<string | null>(null);
    const [editedItem, setEditedItem] = useState<PantryItemInput | null>(null);
    const [showDialog, setShowDialog] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<PantryItemInput | null>(
        null
    );
    const [deleteCount, setDeleteCount] = useState<number>(1); // State for input value

    const handleUpdate = async (updatedItem: PantryItemInput) => {
        if (updatedItem) {
            try {
                await updatePantryItem(updatedItem);

                if (updatedItem.count === 0) {
                    setItemToDelete(updatedItem);
                    setShowDialog(true);
                } else {
                    setIsEditing(null);
                    setEditedItem(null);
                }
            } catch (error) {
                console.error("Error updating item: ", error);
            }
        }
    };

    const handleDelete = async () => {
        if (itemToDelete) {
            try {
                await deletePantryItem(itemToDelete);
                setShowDialog(false);
                setItemToDelete(null);
            } catch (error) {
                console.error("Error deleting item: ", error);
            }
        }
    };

    const handleAddToCart = async (count: number) => {
        if (itemToDelete) {
            try {
                const cartItem: CartItemInput = {
                    ...itemToDelete,
                    count,
                };
                await addCartItem(cartItem);
                await handleDelete();
            } catch (error) {
                console.error("Error adding item to cart: ", error);
            }
        }
    };

    return (
        <>
            {pantry.length === 0 ? (
                <div className="flex flex-col items-center justify-center mt-8">
                    <div className="text-center text-muted-foreground">
                        No items in your pantry...
                    </div>
                </div>
            ) : isEditing ? (
                <PantryItem
                    item={editedItem as PantryItemInput}
                    isEditing={true}
                    onEdit={() => {}}
                    onCancelEdit={() => {
                        setIsEditing(null);
                        setEditedItem(null);
                    }}
                    onUpdate={handleUpdate}
                    onDelete={() => {}}
                    editedItem={editedItem as PantryItemInput}
                    setEditedItem={setEditedItem}
                />
            ) : (
                <div className="flex items-center justify-center w-[60%] max-md:w-[80%] max-sm:[90%]">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Count</TableHead>
                                <TableHead>Cost</TableHead>
                                <TableHead>Store</TableHead>
                                <TableHead className="text-end">
                                    Actions
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {pantry.map((item, index) => (
                                <PantryItem
                                    key={index}
                                    item={item}
                                    isEditing={isEditing === item.name}
                                    onEdit={() => {
                                        setIsEditing(item.name);
                                        setEditedItem(item);
                                    }}
                                    onCancelEdit={() => {
                                        setIsEditing(null);
                                        setEditedItem(null);
                                    }}
                                    onUpdate={handleUpdate}
                                    onDelete={() => {
                                        setItemToDelete(item);
                                        setShowDialog(true);
                                    }}
                                    editedItem={editedItem || item}
                                    setEditedItem={setEditedItem}
                                />
                            ))}
                        </TableBody>
                    </Table>
                </div>
            )}

            {/* Confirmation Dialog */}
            {showDialog && (
                <Dialog open={showDialog} onOpenChange={setShowDialog}>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Confirm Deletion</DialogTitle>
                            <DialogDescription>
                                Do you want to add this item to the shopping
                                cart before deleting it?
                            </DialogDescription>
                        </DialogHeader>
                        <div className="flex flex-row justify-between items-center">
                            <div className="mb-4">
                                <Label className="block mb-1">Item Name</Label>
                                <span className="text-md font-semibold">
                                    {itemToDelete?.name}
                                </span>
                            </div>
                            <div className="mb-4">
                                <Label className="block mb-1">Store</Label>
                                <span className="text-md font-semibold">
                                    {itemToDelete?.store}
                                </span>
                            </div>
                            <div className="mb-4">
                                <Label className="block mb-1">Cost</Label>
                                <span className="text-md font-semibold">
                                    ${itemToDelete?.cost.toFixed(2)}
                                </span>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <Label htmlFor="count" className="w-auto">
                                Add Count:
                            </Label>
                            <Input
                                type="number"
                                id="count"
                                min="1"
                                value={deleteCount}
                                onChange={(e) =>
                                    setDeleteCount(parseInt(e.target.value, 10))
                                }
                                className="w-auto"
                            />
                        </div>
                        <DialogFooter>
                            <Button
                                onClick={() => {
                                    handleAddToCart(deleteCount);
                                }}
                            >
                                Add to Cart
                            </Button>
                            <Button
                                variant="destructive"
                                onClick={handleDelete}
                            >
                                Delete
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}
        </>
    );
};

export default Pantry;
