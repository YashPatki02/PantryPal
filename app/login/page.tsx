"use client";
import Register from "@/components/Register";
import Login from "@/components/Login";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/context/AuthContext";
import { redirect } from "next/navigation";
import { useEffect } from "react";

export default function LoginPage() {
    const { authUser, isLoading } = useAuth();

    useEffect(() => {
        if (authUser) {
            redirect("/");
        }
    }, [authUser]);

    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                Loading...
            </div>
        );
    }

    return (
        <main className="flex min-h-screen flex-col items-center p-4">
            <h1 className="text-2xl font-bold">PantryPal</h1>
            <div className="flex items-center justify-center min-h-auto mt-6 space-x-2">
                <Tabs defaultValue="register" className="w-[400px]">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="register">Register</TabsTrigger>
                        <TabsTrigger value="login">Login</TabsTrigger>
                    </TabsList>
                    <TabsContent value="register">
                        <Card>
                            <CardHeader>
                                <CardTitle>Register</CardTitle>
                                <CardDescription>
                                    Register a new account here.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <Register />
                            </CardContent>
                        </Card>
                    </TabsContent>
                    <TabsContent value="login">
                        <Card>
                            <CardHeader>
                                <CardTitle>Login</CardTitle>
                                <CardDescription>
                                    Login to your account here.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <Login />
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </main>
    );
}
