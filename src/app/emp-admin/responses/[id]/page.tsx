"use client";

import { use, useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { doc, getDoc, updateDoc, serverTimestamp, deleteDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, XCircle, Clock, Trash2, ArrowLeft, Save } from "lucide-react";

export default function ResponseDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const [response, setResponse] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [adminNote, setAdminNote] = useState("");
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchResponseAndForm = async () => {
            try {
                // 1. Fetch Response
                const responseDocRef = doc(db, "responses", id);
                const responseSnap = await getDoc(responseDocRef);

                if (responseSnap.exists()) {
                    const responseData = responseSnap.data();
                    setResponse({ id: responseSnap.id, ...responseData });
                    setAdminNote(responseData.adminNote || "");

                    // 2. Fetch Form Schema to get Question Labels
                    if (responseData.formId) {
                        const formDocRef = doc(db, "forms", responseData.formId);
                        const formSnap = await getDoc(formDocRef);
                        if (formSnap.exists()) {
                            setResponse((prev: any) => ({ ...prev, _formQuestions: formSnap.data().questions }));
                        }
                    }

                } else {
                    alert("Response not found");
                    router.push("/emp-admin/responses");
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchResponseAndForm();
    }, [id, router]);

    const handleStatusChange = async (newStatus: string) => {
        if (!confirm(`Are you sure you want to mark this as ${newStatus}?`)) return;
        try {
            await updateDoc(doc(db, "responses", id), {
                status: newStatus,
                updatedAt: serverTimestamp(),
            });
            setResponse((prev: any) => ({ ...prev, status: newStatus }));
        } catch (error) {
            console.error("Error updating status:", error);
            alert("Failed to update status");
        }
    };

    const saveNote = async () => {
        setSaving(true);
        try {
            await updateDoc(doc(db, "responses", id), {
                adminNote,
                updatedAt: serverTimestamp(),
            });
            alert("Note saved");
        } catch (error) {
            console.error("Error saving note:", error);
            alert("Failed to save note");
        } finally {
            setSaving(false);
        }
    };

    const deleteResponse = async () => {
        if (!confirm("Are you sure you want to DELETE this response? This cannot be undone.")) return;
        try {
            await deleteDoc(doc(db, "responses", id));
            router.push("/emp-admin/responses");
        } catch (error) {
            console.error("Error deleting response:", error);
            alert("Failed to delete response");
        }
    }

    if (loading) return <div className="flex h-screen items-center justify-center text-muted-foreground">Loading details...</div>;
    if (!response) return null;

    // Helper to find label
    const getQuestionLabel = (id: string) => {
        const question = response._formQuestions?.find((q: any) => q.id === id);
        return question ? question.label : `Question ID: ${id}`;
    };

    return (
        <div className="max-w-5xl mx-auto space-y-6 pb-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <Button variant="ghost" size="sm" className="-ml-2 h-8 px-2 text-muted-foreground" onClick={() => router.push("/emp-admin/responses")}>
                            <ArrowLeft className="h-4 w-4 mr-1" /> Back
                        </Button>
                    </div>
                    <h2 className="text-2xl font-bold tracking-tight">Response Details</h2>
                    <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm font-semibold text-primary px-2 py-0.5 bg-primary/10 rounded-md border border-primary/20">
                            {response.requestId || "ID Pending"}
                        </span>
                        <p className="text-sm text-muted-foreground">Viewing submission content and metadata.</p>
                    </div>
                </div>

                <Badge
                    variant={
                        response.status === "Accepted" ? "default" :
                            response.status === "Rejected" ? "destructive" :
                                "secondary"
                    }
                    className={`text-base px-4 py-1.5 ${response.status === "Accepted" ? "bg-green-600 hover:bg-green-700" :
                        response.status === "Processing" ? "bg-amber-500 hover:bg-amber-600 text-white" : ""
                        }`}
                >
                    {response.status || "Pending"}
                </Badge>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content - Answers */}
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Submission Data</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {Object.entries(response.answers || {}).map(([key, value]) => (
                                <div key={key} className="space-y-2">
                                    <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                                        {getQuestionLabel(key)}
                                    </h4>
                                    <div className="p-4 bg-muted/40 rounded-lg border text-foreground font-medium">
                                        {String(value)}
                                    </div>
                                </div>
                            ))}
                            {Object.keys(response.answers || {}).length === 0 && (
                                <p className="text-muted-foreground italic text-center py-8">No answers provided.</p>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar - Meta & Actions */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Metadata</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <span className="text-xs uppercase text-muted-foreground font-semibold">Form Title</span>
                                <p className="font-medium text-foreground">{response.formTitle}</p>
                            </div>
                            <Separator />
                            <div>
                                <span className="text-xs uppercase text-muted-foreground font-semibold">Submitted By</span>
                                <div className="flex items-center gap-2 mt-1">
                                    <div className="h-6 w-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">
                                        {response.submittedBy?.[0]?.toUpperCase()}
                                    </div>
                                    <span className="font-medium text-foreground text-sm truncate max-w-[150px]">{response.submittedBy}</span>
                                </div>
                            </div>
                            <Separator />
                            <div>
                                <span className="text-xs uppercase text-muted-foreground font-semibold">Submitted At</span>
                                <p className="font-medium text-foreground">
                                    {response.createdAt?.toDate ? new Date(response.createdAt.toDate()).toLocaleString() : "N/A"}
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Actions</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-2">
                            <Button variant="outline" className="justify-start text-green-600 hover:text-green-700 hover:bg-green-50" onClick={() => handleStatusChange("Accepted")}>
                                <CheckCircle className="h-4 w-4 mr-2" /> Mark as Accepted
                            </Button>
                            <Button variant="outline" className="justify-start text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => handleStatusChange("Rejected")}>
                                <XCircle className="h-4 w-4 mr-2" /> Mark as Rejected
                            </Button>
                            <Button variant="outline" className="justify-start text-amber-600 hover:text-amber-700 hover:bg-amber-50" onClick={() => handleStatusChange("Processing")}>
                                <Clock className="h-4 w-4 mr-2" /> Mark as Processing
                            </Button>

                            <Separator className="my-2" />

                            <Button variant="ghost" className="justify-start text-muted-foreground hover:text-destructive hover:bg-destructive/10" onClick={deleteResponse}>
                                <Trash2 className="h-4 w-4 mr-2" /> Delete Submission
                            </Button>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Admin Notes</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Textarea
                                className="min-h-[100px]"
                                placeholder="Add internal notes visible only to admins..."
                                value={adminNote}
                                onChange={(e) => setAdminNote(e.target.value)}
                            />
                            <Button onClick={saveNote} disabled={saving} className="w-full">
                                {saving ? "Saving..." : <><Save className="h-4 w-4 mr-2" /> Save Note</>}
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
