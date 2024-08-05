"use client";
import { FC } from "react";
import { useRouter } from "next/navigation";
import { usePantry } from "@/context/PantryContext";
import { addPantryToDB } from "@/config/firestore";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

interface PantryItem {
    id?: string;
    name: string;
    count: number;
    cost: number;
    store: string;
}

const initialValues: PantryItem = {
    name: "",
    count: 0,
    cost: 0,
    store: "",
};

const validationSchema = Yup.object({
    name: Yup.string().required("Required"),
    count: Yup.number()
        .required("Required")
        .min(1, "Must be at least 1")
        .integer("Must be a whole number"),
    cost: Yup.number()
        .required("Required")
        .min(0, "Must be at least 0")
        .test("two-decimal", "Must have exactly two decimal places", (value) =>
            value ? /^\d+(\.\d{2})?$/.test(value.toString()) : true
        ),
    store: Yup.string().required("Required"),
});

const AddItem: FC = () => {
    const { addPantryItem } = usePantry();
    const router = useRouter();

    const handleSubmit = async (
        values: PantryItem,
        { resetForm }: { resetForm: () => void }
    ) => {
        try {
            await addPantryToDB(values);
            console.log("Document successfully written!", values);
            addPantryItem(values);
            resetForm();
            router.push("/");
        } catch (error) {
            console.error("Error adding document: ", error);
        }
    };

    return (
        <main className="flex min-h-screen flex-col items-center justify-start p-4">
            <h2 className="text-xl font-semibold mb-4 text-start">
                Add to Pantry
            </h2>
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({ isSubmitting }) => (
                    <Form className="space-y-4 w-full sm:max-w-sm">
                        <div className="space-y-1">
                            <Label htmlFor="name">Name</Label>
                            <Field
                                as={Input}
                                type="text"
                                id="name"
                                name="name"
                                placeholder="Broccoli"
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
                                placeholder="Grocery Store"
                            />
                            <ErrorMessage
                                name="store"
                                component="div"
                                className="text-red-500"
                            />
                        </div>
                        <Button className="justify-self-center" type="submit" disabled={isSubmitting}>
                            {isSubmitting ? "Adding..." : "Add to Pantry"}
                        </Button>
                    </Form>
                )}
            </Formik>
        </main>
    )
}

export default AddItem;
