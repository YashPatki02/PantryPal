// /auth.ts
import { auth } from "./firebase";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    UserCredential,
} from "firebase/auth";

export const registerUser = async (
    email: string,
    password: string
): Promise<UserCredential> => {
    try {
        const userCredential = await createUserWithEmailAndPassword(
            auth,
            email,
            password
        );
        return userCredential;
    } catch (error) {
        throw new Error(`Registration failed: ${error}`);
    }
};

export const loginUser = async (
    email: string,
    password: string
): Promise<UserCredential> => {
    try {
        const userCredential = await signInWithEmailAndPassword(
            auth,
            email,
            password
        );
        return userCredential;
    } catch (error) {
        throw new Error(`Login failed: ${error}`);
    }
};

export const logoutUser = async (): Promise<void> => {
    try {
        await signOut(auth);
    } catch (error) {
        throw new Error(`Logout failed: ${error}`);
    }
};
