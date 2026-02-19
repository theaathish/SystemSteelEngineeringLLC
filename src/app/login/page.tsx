"use client";

import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Eye, EyeOff, AlertCircle, ArrowLeft } from "lucide-react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function LoginPage() {
    const { user, signInWithEmail, signUpWithEmail, role, loading } = useAuth();
    const router = useRouter();
    const [isLogin, setIsLogin] = useState(true);
    const [isForgotPassword, setIsForgotPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [authLoading, setAuthLoading] = useState(false);

    const handleEmailAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccessMessage("");
        setAuthLoading(true);

        try {
            if (isForgotPassword) {
                await sendPasswordResetEmail(auth, email);
                setSuccessMessage("Password reset email sent! Check your inbox.");
                setIsForgotPassword(false);
                setIsLogin(true);
            } else if (isLogin) {
                await signInWithEmail(email, password);
            } else {
                await signUpWithEmail(email, password);
            }
        } catch (err: any) {
            console.error(err);
            setError(err.message || "Authentication failed");
        } finally {
            setAuthLoading(false);
        }
    };

    useEffect(() => {
        if (user && !loading) {
            router.push(role === "admin" ? "/emp-admin" : "/erp-emp");
        }
    }, [user, role, loading, router]);

    if (loading) return <div className="flex h-screen items-center justify-center bg-zinc-50 text-zinc-500">Loading app...</div>;

    return (
        <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-zinc-50">
            {/* Left Side - Form */}
            <div className="flex items-center justify-center p-8">
                <Card className="w-full max-w-md shadow-xl border-zinc-200/60">
                    <CardHeader className="space-y-1">
                        <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold text-xl mb-4">
                            S
                        </div>
                        <CardTitle className="text-2xl font-bold">
                            {isForgotPassword ? "Reset Password" : isLogin ? "Welcome back" : "Create an account"}
                        </CardTitle>
                        <CardDescription>
                            {isForgotPassword
                                ? "Enter your email to receive password reset instructions."
                                : "Enter your credentials to access the ERP system."}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleEmailAuth} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="name@company.com"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>

                            {!isForgotPassword && (
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <Label htmlFor="password">Password</Label>
                                        {isLogin && (
                                            <Button
                                                variant="link"
                                                className="px-0 font-normal h-auto text-xs"
                                                type="button"
                                                onClick={() => { setIsForgotPassword(true); setError(""); setSuccessMessage(""); }}
                                            >
                                                Forgot password?
                                            </Button>
                                        )}
                                    </div>
                                    <div className="relative">
                                        <Input
                                            id="password"
                                            type={showPassword ? "text" : "password"}
                                            required
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? (
                                                <EyeOff className="h-4 w-4 text-muted-foreground" />
                                            ) : (
                                                <Eye className="h-4 w-4 text-muted-foreground" />
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            )}

                            {error && (
                                <Alert variant="destructive">
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertTitle>Error</AlertTitle>
                                    <AlertDescription>{error}</AlertDescription>
                                </Alert>
                            )}

                            {successMessage && !isForgotPassword && (
                                <Alert className="text-green-600 border-green-200 bg-green-50">
                                    <AlertCircle className="h-4 w-4 text-green-600" />
                                    <AlertTitle>Success</AlertTitle>
                                    <AlertDescription>{successMessage}</AlertDescription>
                                </Alert>
                            )}

                            <Button type="submit" className="w-full" disabled={authLoading}>
                                {authLoading ? "Processing..." : isForgotPassword ? "Send Reset Link" : isLogin ? "Sign In" : "Sign Up"}
                            </Button>
                        </form>
                    </CardContent>
                    <CardFooter className="flex flex-col space-y-4">
                        {isForgotPassword ? (
                            <Button variant="ghost" className="w-full" onClick={() => { setIsForgotPassword(false); setError(""); }}>
                                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Login
                            </Button>
                        ) : (
                            <>
                                <div className="relative w-full">
                                    <div className="absolute inset-0 flex items-center">
                                        <Separator className="w-full" />
                                    </div>
                                    <div className="relative flex justify-center text-xs uppercase">
                                        <span className="bg-background px-2 text-muted-foreground">Or</span>
                                    </div>
                                </div>
                                <Button variant="ghost" className="w-full" onClick={() => { setIsLogin(!isLogin); setError(""); }}>
                                    {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
                                </Button>
                            </>
                        )}
                    </CardFooter>
                </Card>
            </div>

            {/* Right Side - Visual */}
            <div className="hidden md:flex flex-col justify-center p-12 bg-zinc-900 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-900 opacity-90" />
                <div className="relative z-10 max-w-lg">
                    <h2 className="text-4xl font-bold mb-6 leading-tight">Streamline your workforce management.</h2>
                    <p className="text-blue-100 text-lg leading-relaxed">
                        Manage forms, track submissions, and handle employee requests in one unified, secure platform designed for efficiency.
                    </p>
                </div>
                {/* Decorative circles */}
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-blue-500 opacity-20 blur-3xl" />
                <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-purple-500 opacity-20 blur-3xl" />
            </div>
        </div>
    );
}
