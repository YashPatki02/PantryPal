"use client";
import { FC } from "react";
import { useCart } from "@/context/CartContext"; // Update with correct context
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

interface CartItem {
    id?: string;
    name: string;
    count: number;
    cost: number;
    store: string;
}

const initialValues: CartItem = {
    name: "",
    count: 1,
    cost: 0,
    store: "",
};

const validationSchema = Yup.object({
    name: Yup.string().required("Required"),
    count: Yup.number().required("Required").min(1, "Must be at least 1").integer("Must be a whole number"),
    cost: Yup.number().required("Required").min(0, "Must be at least 0").test(
        "two-decimal",
        "Must have exactly two decimal places",
        (value) => (value ? /^\d+(\.\d{2})?$/.test(value.toString()) : true)
    ),
    store: Yup.string().required("Required"),
});

const AddCart: FC = () => {
    const { addCartItem } = useCart();

    const handleSubmit = async (
        values: CartItem,
        { resetForm }: { resetForm: () => void }
    ) => {
        try {
            // await addCartItemToDB(values); // Add item to DB
            console.log("Document successfully written!", values);
            addCartItem(values); // Update context
            resetForm();
        } catch (error) {
            console.error("Error adding document: ", error);
        }
    };

    return (
        <div className="flex min-h-screen flex-col items-start justify-start max-sm:items-center">
            <h2 className="text-xl font-semibold mb-4 text-start">Add to Cart</h2>
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({ isSubmitting }) => (
                    <Form className="space-y-4 w-full max-w-sm">
                        <div className="space-y-1">
                            <Label htmlFor="name">Name</Label>
                            <Field
                                as={Input}
                                type="text"
                                id="name"
                                name="name"
                                placeholder="Item Name"
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
                                placeholder="1"
                                min="1"
                            />
                            <ErrorMessage
                                name="count"
                                component="div"
                                className="text-red-500"
                            />
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="cost">Cost (per item)</Label>
                            <Field
                                as={Input}
                                type="number"
                                id="cost"
                                name="cost"
                                placeholder="0.00"
                                step="0.01"
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
                                placeholder="Store Name"
                            />
                            <ErrorMessage
                                name="store"
                                component="div"
                                className="text-red-500"
                            />
                        </div>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? "Adding..." : "Add to  Cart"}
                        </Button>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default AddCart;
