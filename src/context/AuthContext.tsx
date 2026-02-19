"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, User, signOut, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

interface AuthContextType {
    user: User | null;
    role: "admin" | "employee" | null;
    loading: boolean;
    signInWithEmail: (email: string, password: string) => Promise<void>;
    signUpWithEmail: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    role: null,
    loading: true,
    signInWithEmail: async () => { },
    signUpWithEmail: async () => { },
    logout: async () => { },
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [role, setRole] = useState<"admin" | "employee" | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            setUser(currentUser);
            if (currentUser) {
                // Check user role in Firestore
                const userDocRef = doc(db, "users", currentUser.uid);
                const userDoc = await getDoc(userDocRef);

                if (userDoc.exists()) {
                    setRole(userDoc.data().role as "admin" | "employee");
                } else {
                    // Default to employee for new users
                    // We might want to do this only on signup, but doing it here ensures it exists
                    // However, for email signup, we should probably set it during creation to be safe, 
                    // but onAuthStateChanged triggers after signup too.
                    // checking if it exists handles the case where we set it during signup
                    // If it doesn't exist (e.g. google sign in first time), we create it.
                    // For email signup, we can set it explicitly in the signUp function.
                    if (!userDoc.exists()) {
                        await setDoc(userDocRef, { email: currentUser.email, role: "employee" });
                        setRole("employee");
                    }
                }
            } else {
                setRole(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const signInWithEmail = async (email: string, password: string) => {
        await signInWithEmailAndPassword(auth, email, password);
    }

    const signUpWithEmail = async (email: string, password: string) => {
        const res = await createUserWithEmailAndPassword(auth, email, password);
        // Create user doc immediately
        await setDoc(doc(db, "users", res.user.uid), {
            email: res.user.email,
            role: "employee"
        });
        setRole("employee"); // Optimistic update
    }

    const logout = async () => {
        await signOut(auth);
    };

    return (
        <AuthContext.Provider value={{ user, role, loading, signInWithEmail, signUpWithEmail, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
