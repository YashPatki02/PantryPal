"use client";
import { FC } from "react";
import PantryItemInput from "@/types/pantry";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "./ui/card";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { TableRow, TableCell } from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";


interface PantryItemProps {
    item: PantryItemInput;
    isEditing: boolean;
    onEdit: () => void;
    onCancelEdit: () => void;
    onUpdate: (item: PantryItemInput) => void;
    onDelete: () => void;
    editedItem: PantryItemInput;
    setEditedItem: (item: PantryItemInput) => void;
}

const validationSchema = Yup.object({
    name: Yup.string().required("Required"),
    count: Yup.number()
        .required("Required")
        .min(0, "Must be at least 0")
        .integer("Must be a whole number"),
    cost: Yup.number()
        .required("Required")
        .min(0, "Must be at least 0")
        .test("two-decimal", "Must have exactly two decimal places", (value) =>
            value ? /^\d+(\.\d{2})?$/.test(value.toString()) : true
        ),
    store: Yup.string().required("Required"),
});

const PantryItem: FC<PantryItemProps> = ({
    item,
    isEditing,
    onEdit,
    onCancelEdit,
    onUpdate,
    onDelete,
    editedItem,
    setEditedItem,
}) => {
    const handleSubmit = async (values: PantryItemInput) => {
        try {
            setEditedItem(values);
            onUpdate(values); // Pass the updated item
            console.log("Item updated successfully!");
        } catch (error) {
            console.error("Error updating item: ", error);
        }
    };

    const increment = () => {
        try {
            const updatedItem = { ...item, count: item.count + 1 };
            setEditedItem(updatedItem);
            onUpdate(updatedItem);
            console.log("Item updated successfully!");
        } catch (error) {
            console.error("Error updating item: ", error);
        }
    };

    const decrement = () => {
        try {
            const updatedItem = { ...item, count: item.count - 1 };
            setEditedItem(updatedItem);
            onUpdate(updatedItem);
            console.log("Item updated successfully!");
        } catch (error) {
            console.error("Error updating item: ", error);
        }
    };

    return isEditing && editedItem.name === item.name ? (
        <Card>
            <Formik
                initialValues={editedItem}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({ isSubmitting }) => (
                    <Form className="grid w-full max-w-sm items-center gap-1.5">
                        <div className="space-y-1">
                            <Label htmlFor="name">Name</Label>
                            <Field
                                as={Input}
                                type="text"
                                id="name"
                                name="name"
                            />
                            <ErrorMessage
                                name="name"
                                component="div"
                                className="text-red-500"
                            />
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="count">Count</Label>
                            <Field
                                as={Input}
                                type="number"
                                id="count"
                                name="count"
                            />
                            <ErrorMessage
                                name="count"
                                component="div"
                                className="text-red-500"
                            />
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="cost">Cost</Label>
                            <Field
                                as={Input}
                                type="number"
                                id="cost"
                                name="cost"
                            />
                            <ErrorMessage
                                name="cost"
                                component="div"
                                className="text-red-500"
                            />
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="store">Store</Label>
                            <Field
                                as={Input}
                                type="text"
                                id="store"
                                name="store"
                            />
                            <ErrorMessage
                                name="store"
                                component="div"
                                className="text-red-500"
                            />
                        </div>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? "Updating..." : "Save"}
                        </Button>
                        <Button type="button" onClick={onCancelEdit}>
                            Cancel
                        </Button>
                    </Form>
                )}
            </Formik>
        </Card>
    ) : (
        <TableRow>
            <TableCell>{item.name}</TableCell>
            <TableCell>{item.count}</TableCell>
            <TableCell>${item.cost.toFixed(2)}</TableCell>
            <TableCell>{item.store}</TableCell>
            <TableCell>
                <div className="flex gap-2 justify-end">
                    <Button onClick={increment}>+</Button>
                    <Button onClick={decrement}>-</Button>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={onEdit}>
                                Update
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={onDelete}>
                                Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </TableCell>
        </TableRow>
    );
};

export default PantryItem;
