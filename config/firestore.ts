import { db, auth } from "./firebase";
import {
    doc,
    getDoc,
    setDoc,
    updateDoc,
    arrayUnion,
    arrayRemove,
} from "firebase/firestore";

interface PantryItem {
    id?: string;
    name: string;
    count: number;
    cost: number;
    store: string;
}

export const addPantryToDB = async (item: PantryItem) => {
    const user = auth.currentUser;

    if (!user) {
        throw new Error("No user is signed in");
    }

    const userId = user.uid;
    const userDocRef = doc(db, "pantries", userId);

    try {
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
            const pantryData = userDoc.data()?.pantry || [];

            // Check if the item already exists
            const existingItemIndex = pantryData.findIndex(
                (i: PantryItem) =>
                    i.name === item.name && i.store === item.store
            );

            if (existingItemIndex > -1) {
                // Item exists, update its count
                const updatedPantry = [...pantryData];
                updatedPantry[existingItemIndex] = {
                    ...updatedPantry[existingItemIndex],
                    count: updatedPantry[existingItemIndex].count + item.count,
                };

                await updateDoc(userDocRef, { pantry: updatedPantry });
            } else {
                // Item does not exist, add it to the pantry
                await updateDoc(userDocRef, {
                    pantry: arrayUnion(item),
                });
            }
        } else {
            // Document does not exist, create it with the new item
            await setDoc(userDocRef, {
                pantry: [item],
            });
        }

        console.log("Document successfully written!");
    } catch (error) {
        console.error("Error adding document: ", error);
    }
};

export const getUserPantryItems = async (): Promise<PantryItem[]> => {
    const user = auth.currentUser;

    if (!user) {
        throw new Error("No user is signed in");
    }

    const userId = user.uid;
    const userDocRef = doc(db, "pantries", userId);

    try {
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
            const data = userDoc.data();
            const items: PantryItem[] = data.pantry || [];
            return items;
        } else {
            console.log("No such document!");
            return [];
        }
    } catch (error) {
        console.error("Error fetching pantry items: ", error);
        return [];
    }
};

export const updatePantryItemInDB = async (item: PantryItem) => {
    const user = auth.currentUser;

    if (!user) {
        throw new Error("No user is signed in");
    }

    const userId = user.uid;
    const userDocRef = doc(db, "pantries", userId);

    try {
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
            const data = userDoc.data();
            const items: PantryItem[] = data.pantry || [];

            const updatedItems = items.map((i) =>
                i.name === item.name ? item : i
            );

            await setDoc(userDocRef, {
                pantry: updatedItems,
            });

            console.log("Document successfully updated!");
        }
    } catch (error) {
        console.error("Error updating document: ", error);
    }
};

export const deletePantryItemFromDB = async (itemToDelete: PantryItem) => {
    const user = auth.currentUser;

    if (!user) {
        throw new Error("No user is signed in");
    }

    const userId = user.uid;
    const userDocRef = doc(db, "pantries", userId);

    try {
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
            const data = userDoc.data();
            const items: PantryItem[] = data.pantry || [];

            // const itemToDelete = items.find(
            //     (item) => item.name === itemName && item.store === itemStore
            // );
            if (itemToDelete) {
                await updateDoc(userDocRef, {
                    pantry: arrayRemove(itemToDelete),
                });
            }
        }

        console.log("Document successfully deleted!");
    } catch (error) {
        console.error("Error deleting document: ", error);
    }
};

interface CartItem {
    id?: string;
    name: string;
    count: number;
    cost: number;
    store: string;
}

export const addCartItemToDB = async (item: CartItem) => {
    const user = auth.currentUser;

    if (!user) {
        throw new Error("No user is signed in");
    }

    const userId = user.uid;
    const userDocRef = doc(db, "carts", userId);

    try {
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
            const cartData = userDoc.data()?.cart || [];

            // Check if the item already exists
            const existingItemIndex = cartData.findIndex(
                (i: CartItem) => i.name === item.name && i.store === item.store
            );

            if (existingItemIndex > -1) {
                // Item exists, update its count
                const updatedCart = [...cartData];
                updatedCart[existingItemIndex] = {
                    ...updatedCart[existingItemIndex],
                    count: updatedCart[existingItemIndex].count + item.count,
                };

                await updateDoc(userDocRef, { cart: updatedCart });
            } else {
                // Item does not exist, add it to the cart
                await updateDoc(userDocRef, {
                    cart: arrayUnion(item),
                });
            }
        } else {
            // Document does not exist, create it with the new item
            await setDoc(userDocRef, {
                cart: [item],
            });
        }

        console.log("Document successfully written!");
    } catch (error) {
        console.error("Error adding document: ", error);
    }
};

export const getUserCartItems = async (): Promise<CartItem[]> => {
    const user = auth.currentUser;

    if (!user) {
        throw new Error("No user is signed in");
    }

    const userId = user.uid;
    const userDocRef = doc(db, "carts", userId);

    try {
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
            const data = userDoc.data();
            const items: CartItem[] = data.cart || [];
            return items;
        } else {
            console.log("No such document!");
            return [];
        }
    } catch (error) {
        console.error("Error fetching cart items: ", error);
        return [];
    }
};

export const updateCartItemInDB = async (item: CartItem) => {
    const user = auth.currentUser;

    if (!user) {
        throw new Error("No user is signed in");
    }

    const userId = user.uid;
    const userDocRef = doc(db, "carts", userId);

    try {
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
            const data = userDoc.data();
            const items: CartItem[] = data.cart || [];

            const updatedItems = items.map((i) =>
                i.name === item.name && i.store === item.store ? item : i
            );

            await setDoc(userDocRef, {
                cart: updatedItems,
            });

            console.log("Document successfully updated!");
        }
    } catch (error) {
        console.error("Error updating document: ", error);
    }
};

export const deleteCartItemFromDB = async (itemToDelete: CartItem) => {
    const user = auth.currentUser;

    if (!user) {
        throw new Error("No user is signed in");
    }

    const userId = user.uid;
    const userDocRef = doc(db, "carts", userId);

    try {
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
            const data = userDoc.data();
            const items: CartItem[] = data.cart || [];

            if (itemToDelete) {
                await updateDoc(userDocRef, {
                    cart: arrayRemove(itemToDelete),
                });
            }
        }

        console.log("Document successfully deleted!");
    } catch (error) {
        console.error("Error deleting document: ", error);
    }
};
