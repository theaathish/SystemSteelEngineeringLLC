"use client";

import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, FileText, CheckCircle2, AlertCircle } from "lucide-react";

import { useRouter } from "next/navigation";

export default function AdminDashboard() {
    const { user } = useAuth();
    const router = useRouter();
    const [stats, setStats] = useState({
        totalForms: 0,
        totalResponses: 0,
        pendingway: 0,
    });
    const [recentResponses, setRecentResponses] = useState<any[]>([]);
    const [forms, setForms] = useState<any[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            // Fetch forms
            const formsSnapshot = await getDocs(collection(db, "forms"));
            const formsData = formsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setForms(formsData);
            const formsCount = formsSnapshot.size;

            // Fetch responses count and stats
            const responsesSnapshot = await getDocs(collection(db, "responses"));
            const responsesCount = responsesSnapshot.size;
            let pendingCount = 0;
            const responsesData: any[] = [];

            responsesSnapshot.forEach((doc) => {
                const data = doc.data();
                if (data.status === "Processing") pendingCount++;
                responsesData.push({ id: doc.id, ...data });
            });

            // Sort by date
            responsesData.sort((a, b) => b.createdAt?.seconds - a.createdAt?.seconds);

            setStats({
                totalForms: formsCount,
                totalResponses: responsesCount,
                pendingway: pendingCount,
            });
            setRecentResponses(responsesData.slice(0, 5));
        };

        fetchData();
    }, []);

    return (
        <div className="space-y-8">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Overview</h2>
                    <p className="text-muted-foreground">Welcome back, here's what's happening today.</p>
                </div>
                <Button asChild className="shadow-sm">
                    <Link href="/emp-admin/create">
                        <Plus className="mr-2 h-4 w-4" /> Create New Form
                    </Link>
                </Button>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Forms</CardTitle>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalForms}</div>
                        <p className="text-xs text-muted-foreground">Active forms available</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Responses</CardTitle>
                        <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalResponses}</div>
                        <p className="text-xs text-muted-foreground">Submissions received</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pending Action</CardTitle>
                        <AlertCircle className="h-4 w-4 text-amber-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-amber-600">{stats.pendingway}</div>
                        <p className="text-xs text-muted-foreground">Responses processing</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Forms List */}
                <Card className="col-span-1">
                    <CardHeader>
                        <CardTitle>Active Forms</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Title</TableHead>
                                    <TableHead>Slug (ID)</TableHead>
                                    <TableHead className="text-right">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {forms.map((form) => (
                                    <TableRow key={form.id}>
                                        <TableCell className="font-medium">{form.title}</TableCell>
                                        <TableCell className="font-mono text-xs text-muted-foreground">{form.slug}</TableCell>
                                        <TableCell className="text-right">
                                            <Button asChild variant="ghost" size="sm">
                                                <Link href={`/emp-admin/edit/${form.id}`}>Edit</Link>
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {forms.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">
                                            No forms created yet.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                {/* Recent Responses */}
                <Card className="col-span-1">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Recent Responses</CardTitle>
                        <Button asChild variant="link" className="text-sm">
                            <Link href="/emp-admin/responses">View All</Link>
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Form</TableHead>
                                    <TableHead>Date</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {recentResponses.map((res) => (
                                    <TableRow
                                        key={res.id}
                                        className="cursor-pointer hover:bg-muted/50 transition-colors"
                                        onClick={() => router.push(`/emp-admin/responses/${res.id}`)}
                                    >
                                        <TableCell>
                                            <Badge
                                                variant={
                                                    res.status === "Accepted" ? "default" : // Default is usually primary/black
                                                        res.status === "Rejected" ? "destructive" :
                                                            "secondary"
                                                }
                                                className={
                                                    res.status === "Accepted" ? "bg-green-600 hover:bg-green-700" :
                                                        res.status === "Processing" ? "bg-amber-500 hover:bg-amber-600 text-white" : ""
                                                }
                                            >
                                                {res.status || "Pending"}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className="font-medium">{res.formTitle || "Untitled"}</div>
                                            <div className="text-xs text-muted-foreground">{res.submittedBy?.split('@')[0]}</div>
                                        </TableCell>
                                        <TableCell className="text-xs text-muted-foreground">
                                            {res.createdAt?.toDate ? new Date(res.createdAt.toDate()).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : "N/A"}
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {recentResponses.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">
                                            No recent responses.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
