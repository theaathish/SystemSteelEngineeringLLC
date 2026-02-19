"use client";

import { useState } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Trash2, Plus, Rocket, ArrowLeft } from "lucide-react";

interface Question {
    id: string;
    type: "text" | "number" | "date" | "tel" | "textarea" | "select";
    label: string;
    options?: string[]; // For select type
}

export default function CreateForm() {
    const router = useRouter();
    const [title, setTitle] = useState("");
    const [questions, setQuestions] = useState<Question[]>([]);
    const [loading, setLoading] = useState(false);

    const addQuestion = (type: Question["type"] = "text") => {
        setQuestions([
            ...questions,
            { id: Date.now().toString(), type, label: "", options: [] },
        ]);
    };

    const updateQuestion = (id: string, field: keyof Question, value: any) => {
        setQuestions(
            questions.map((q) => (q.id === id ? { ...q, [field]: value } : q))
        );
    };

    const removeQuestion = (id: string) => {
        setQuestions(questions.filter((q) => q.id !== id));
    };

    const generateSlug = (text: string) => {
        return text
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)+/g, "");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const slug = generateSlug(title) + "-" + Date.now(); // Ensure uniqueness
            await addDoc(collection(db, "forms"), {
                title,
                slug,
                questions,
                createdAt: serverTimestamp(),
            });
            router.push("/emp-admin");
        } catch (error) {
            console.error("Error creating form:", error);
            alert("Failed to create form");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto space-y-8 pb-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Form Builder</h2>
                    <p className="text-muted-foreground mt-1">Design a new form for your employees to submit.</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" onClick={() => router.push("/emp-admin")}>
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} disabled={loading} className="gap-2">
                        {loading ? "Creating..." : <><Rocket className="h-4 w-4" /> Publish Form</>}
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left: Form Settings */}
                <div className="lg:col-span-1 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>General Details</CardTitle>
                            <CardDescription>Basic information about the form.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="title">Form Title <span className="text-destructive">*</span></Label>
                                <Input
                                    id="title"
                                    required
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="e.g., Leave Request"
                                />
                                <p className="text-xs text-muted-foreground">
                                    Visible to all employees.
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-blue-50/50 border-blue-100 dark:bg-blue-950/20 dark:border-blue-900">
                        <CardHeader>
                            <CardTitle className="text-sm text-blue-900 dark:text-blue-100 flex items-center gap-2">
                                💡 Pro Tip
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-blue-800 dark:text-blue-200">
                                Keep questions concise. Shorter forms generally get faster responses from employees.
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Right: Questions Builder */}
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                            <div className="space-y-1">
                                <CardTitle>Form Questions</CardTitle>
                                <CardDescription>Define the data you want to collect.</CardDescription>
                            </div>
                            <div className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-secondary text-secondary-foreground border">
                                {questions.length} Questions
                            </div>
                        </CardHeader>
                        <Separator />
                        <CardContent className="p-6 space-y-6">
                            {questions.length === 0 && (
                                <div className="text-center py-12 border-2 border-dashed rounded-xl">
                                    <p className="text-muted-foreground font-medium mb-4">No questions added yet.</p>
                                    <Button variant="outline" onClick={() => addQuestion("text")}>
                                        Add First Question
                                    </Button>
                                </div>
                            )}

                            {questions.map((q, index) => (
                                <div key={q.id} className="relative group p-4 border rounded-xl hover:border-primary/50 hover:shadow-sm transition-all bg-card">
                                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => removeQuestion(q.id)}
                                            className="text-destructive hover:bg-destructive/10 hover:text-destructive h-8 px-2"
                                        >
                                            <Trash2 className="h-4 w-4 mr-1" /> Remove
                                        </Button>
                                    </div>

                                    <div className="flex items-center gap-3 mb-4">
                                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border bg-muted text-xs font-medium text-muted-foreground">
                                            {index + 1}
                                        </span>
                                        <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Question {index + 1}</span>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                                        <div className="md:col-span-8 space-y-2">
                                            <Label className="text-xs uppercase text-muted-foreground">Question Label</Label>
                                            <Input
                                                value={q.label}
                                                onChange={(e) => updateQuestion(q.id, "label", e.target.value)}
                                                placeholder="What is the question?"
                                            />
                                        </div>
                                        <div className="md:col-span-4 space-y-2">
                                            <Label className="text-xs uppercase text-muted-foreground">Input Type</Label>
                                            <Select
                                                value={q.type}
                                                onValueChange={(value) => updateQuestion(q.id, "type", value)}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select type" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="text">abc Text Input</SelectItem>
                                                    <SelectItem value="number">123 Number</SelectItem>
                                                    <SelectItem value="date">📅 Date Picker</SelectItem>
                                                    <SelectItem value="tel">📞 Phone Number</SelectItem>
                                                    <SelectItem value="textarea">📝 Long Text Area</SelectItem>
                                                    <SelectItem value="select">▼ Dropdown Menu</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                        <Separator />
                        <div className="p-6 bg-muted/20 flex justify-center rounded-b-xl">
                            <Button variant="outline" onClick={() => addQuestion("text")} className="gap-2">
                                <Plus className="h-4 w-4" /> Add Another Question
                            </Button>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
