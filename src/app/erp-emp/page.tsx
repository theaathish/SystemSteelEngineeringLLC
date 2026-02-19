"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FileText, Clock, ChevronRight, MessageSquare, Calendar } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function EmployeeDashboard() {
    const { user } = useAuth();
    const [forms, setForms] = useState<any[]>([]);
    const [mySubmissions, setMySubmissions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedSubmission, setSelectedSubmission] = useState<any>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            if (!user) return;
            try {
                // Fetch available forms
                const formsSnapshot = await getDocs(collection(db, "forms"));
                setForms(formsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));

                // Fetch my submissions
                const q = query(
                    collection(db, "responses"),
                    where("userId", "==", user.uid)
                );
                const submissionsSnapshot = await getDocs(q);
                const subs = submissionsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                // Sort manually since we might depend on index for compound queries
                subs.sort((a: any, b: any) => b.createdAt?.seconds - a.createdAt?.seconds);
                setMySubmissions(subs);
            } catch (error) {
                console.error("Error fetching dashboard data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [user]);

    const handleRowClick = (submission: any) => {
        setSelectedSubmission(submission);
        setIsDialogOpen(true);
    };

    if (loading) return <div className="text-muted-foreground p-8">Loading dashboard...</div>;

    return (
        <div className="space-y-8">
            <section className="space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">Available Forms</h2>
                        <p className="text-muted-foreground">Select a form to submit a new request.</p>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {forms.map((form) => (
                        <Link key={form.id} href={`/erp-emp/${form.slug}`} className="group block">
                            <Card className="h-full transition-all hover:border-primary/50 hover:shadow-md group-hover:-translate-y-0.5">
                                <CardHeader>
                                    <div className="mb-2 h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                        <FileText className="h-5 w-5" />
                                    </div>
                                    <CardTitle className="group-hover:text-primary transition-colors">{form.title}</CardTitle>
                                    <CardDescription>Click to start form</CardDescription>
                                </CardHeader>
                            </Card>
                        </Link>
                    ))}
                    {forms.length === 0 && (
                        <div className="col-span-full p-8 text-center border-2 border-dashed rounded-xl">
                            <p className="text-muted-foreground">No forms available at the moment.</p>
                        </div>
                    )}
                </div>
            </section>

            <section className="space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">My Submissions</h2>
                        <p className="text-muted-foreground">Track the status of your recent requests. Click to view details.</p>
                    </div>
                </div>
                <Card>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Form</TableHead>
                                <TableHead className="hidden md:table-cell">Date</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="hidden md:table-cell">Notes</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {mySubmissions.map((sub) => (
                                <TableRow
                                    key={sub.id}
                                    className="cursor-pointer hover:bg-muted/50 transition-colors"
                                    onClick={() => handleRowClick(sub)}
                                >
                                    <TableCell>
                                        <div className="font-medium">{sub.formTitle}</div>
                                        <div className="text-xs text-primary font-semibold mt-0.5">
                                            {sub.requestId || "SEQ-WAITING"}
                                        </div>
                                        <div className="text-xs text-muted-foreground md:hidden flex items-center mt-1">
                                            <Calendar className="h-3 w-3 mr-1" />
                                            {sub.createdAt?.toDate ? new Date(sub.createdAt.toDate()).toLocaleDateString() : "N/A"}
                                        </div>
                                    </TableCell>
                                    <TableCell className="hidden md:table-cell text-muted-foreground">
                                        {sub.createdAt?.toDate ? new Date(sub.createdAt.toDate()).toLocaleDateString() : "N/A"}
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={
                                                sub.status === "Approved" ? "default" :
                                                    sub.status === "Rejected" ? "destructive" :
                                                        "secondary"
                                            }
                                            className={
                                                sub.status === "Approved" ? "bg-green-600 hover:bg-green-700" :
                                                    sub.status === "Processing" ? "bg-amber-500 hover:bg-amber-600 text-white" : ""
                                            }
                                        >
                                            {sub.status || "Processing"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="hidden md:table-cell text-muted-foreground max-w-xs truncate">
                                        {sub.adminNote || "-"}
                                    </TableCell>
                                </TableRow>
                            ))}
                            {mySubmissions.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                                        You haven't submitted any forms yet.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </Card>
            </section>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-md sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Submission Details</DialogTitle>
                        <DialogDescription>
                            Review the status and admin notes for your request.
                        </DialogDescription>
                    </DialogHeader>
                    {selectedSubmission && (
                        <div className="space-y-6 mt-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h4 className="font-semibold text-lg">{selectedSubmission.formTitle}</h4>
                                    <div className="text-sm font-medium text-primary mt-1">
                                        {selectedSubmission.requestId || "Processing ID..."}
                                    </div>
                                    <div className="text-sm text-muted-foreground flex items-center mt-1">
                                        <Clock className="h-3 w-3 mr-1" />
                                        Submitted on: {selectedSubmission.createdAt?.toDate ? new Date(selectedSubmission.createdAt.toDate()).toLocaleDateString() : "N/A"}
                                    </div>
                                </div>
                                <Badge
                                    className={`px-3 py-1 text-sm ${selectedSubmission.status === "Approved" ? "bg-green-600 hover:bg-green-700" :
                                        selectedSubmission.status === "Processing" ? "bg-amber-500 hover:bg-amber-600 text-white" :
                                            selectedSubmission.status === "Rejected" ? "bg-destructive text-destructive-foreground hover:bg-destructive/90" :
                                                "bg-secondary text-secondary-foreground"
                                        }`}
                                >
                                    {selectedSubmission.status}
                                </Badge>
                            </div>

                            <div className="bg-muted/30 p-4 rounded-lg border">
                                <h5 className="text-sm font-medium mb-2 flex items-center gap-2">
                                    <MessageSquare className="h-4 w-4 text-primary" />
                                    Admin Notes
                                </h5>
                                <p className="text-sm text-foreground/90 whitespace-pre-wrap">
                                    {selectedSubmission.adminNote || "No notes from admin yet."}
                                </p>
                            </div>

                            <div>
                                <h5 className="text-sm font-medium mb-3">Submitted Answers</h5>
                                <ScrollArea className="h-[200px] w-full rounded-md border p-4">
                                    <div className="space-y-4">
                                        {selectedSubmission.answers && Object.entries(selectedSubmission.answers).map(([key, value]: [string, any]) => (
                                            <div key={key} className="space-y-1">
                                                <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                                    Question ID: {key}
                                                </div>
                                                <div className="text-sm bg-muted/50 p-2 rounded border border-muted">
                                                    {String(value)}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </ScrollArea>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
