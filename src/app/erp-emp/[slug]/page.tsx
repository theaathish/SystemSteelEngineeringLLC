"use client";

import { useEffect, useState, use } from "react";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, addDoc, serverTimestamp } from "firebase/firestore";
import { submitFormResponse } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Send, ArrowLeft } from "lucide-react";

export default function FormPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = use(params);
    const { user } = useAuth();
    const router = useRouter();
    const [form, setForm] = useState<any>(null);
    const [answers, setAnswers] = useState<any>({});
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const fetchForm = async () => {
            try {
                const q = query(collection(db, "forms"), where("slug", "==", slug));
                const snapshot = await getDocs(q);
                if (!snapshot.empty) {
                    setForm({ id: snapshot.docs[0].id, ...snapshot.docs[0].data() });
                } else {
                    alert("Form not found");
                    router.push("/erp-emp");
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchForm();
    }, [slug, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || !form) return;

        setSubmitting(true);
        try {
            const requestId = await submitFormResponse(form.id, form.title, user, answers);
            alert(`Form submitted successfully! Your Request ID is: ${requestId}`);
            router.push("/erp-emp");
        } catch (error) {
            console.error("Error submitting form:", error);
            alert("Failed to submit form");
        } finally {
            setSubmitting(false);
        }
    };

    const handleInputChange = (questionId: string, value: any) => {
        setAnswers((prev: any) => ({ ...prev, [questionId]: value }));
    };

    if (loading) return <div className="flex h-screen items-center justify-center text-muted-foreground">Loading form...</div>;
    if (!form) return <div className="flex h-screen items-center justify-center text-destructive">Form not found.</div>;

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <Button variant="ghost" className="-ml-4 text-muted-foreground mb-4" onClick={() => router.push("/erp-emp")}>
                <ArrowLeft className="h-4 w-4 mr-2" /> Back to Dashboard
            </Button>

            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl">{form.title}</CardTitle>
                    <CardDescription>Please fill out the details below to submit your request.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {form.questions?.map((q: any) => (
                            <div key={q.id} className="space-y-2">
                                <Label className="text-base font-semibold">
                                    {q.label}
                                </Label>
                                {q.type === "textarea" ? (
                                    <Textarea
                                        required
                                        placeholder="Type your answer here..."
                                        className="min-h-[100px]"
                                        onChange={(e) => handleInputChange(q.id, e.target.value)}
                                    />
                                ) : q.type === "select" ? (
                                    <Select onValueChange={(value) => handleInputChange(q.id, value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select an option" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {q.options?.map((opt: string) => (
                                                <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                                            ))}
                                            {/* Fallback if no options defined (though builder should handle this) */}
                                            {!q.options && <SelectItem value="default">Default Option</SelectItem>}
                                        </SelectContent>
                                    </Select>
                                ) : (
                                    <Input
                                        type={q.type}
                                        required
                                        placeholder={`Enter ${q.label.toLowerCase()}`}
                                        onChange={(e) => handleInputChange(q.id, e.target.value)}
                                    />
                                )}
                            </div>
                        ))}

                        <div className="pt-4">
                            <Button type="submit" disabled={submitting} className="w-full text-base py-6">
                                {submitting ? "Submitting Request..." : <><Send className="h-4 w-4 mr-2" /> Submit Request</>}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
