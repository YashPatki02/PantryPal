"use client";
import {
    createContext,
    useContext,
    useEffect,
    useState,
    ReactNode,
} from "react";
import {
    getAuth,
    onAuthStateChanged,
    signOut as authSignOut,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "@/config/firebase";

interface AuthContextProps {
    authUser: any;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, password: string) => Promise<void>;
    signOut: () => Promise<void>;
}

const AuthUserContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthUserProvider = ({ children }: { children: ReactNode }) => {
    const [authUser, setAuthUser] = useState<any>(null);
    const [isLoading, setLoading] = useState<boolean>(true);

    const clear = () => {
        setAuthUser(null);
        setLoading(false);
    };

    const authStateChanged = (user: any) => {
        if (!user) {
            clear();
            return;
        }
        setAuthUser({
            id: user.uid,
            email: user.email,
            name: user.displayName,
        });
        setLoading(false);
    };

    const login = async (email: string, password: string) => {
        // const auth = getAuth();
        setLoading(true);
        await signInWithEmailAndPassword(auth, email, password);
    };

    const register = async (email: string, password: string) => {
        // const auth = getAuth();
        setLoading(true);
        await createUserWithEmailAndPassword(auth, email, password);
    };

    const signOut = async () => {
        // const auth = getAuth();
        setLoading(true);
        await authSignOut(auth);
        clear();
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, authStateChanged);
        return unsubscribe;
    }, []);

    return (
        <AuthUserContext.Provider
            value={{ authUser, isLoading, login, register, signOut }}
        >
            {children}
        </AuthUserContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthUserContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthUserProvider");
    }
    return context;
};
