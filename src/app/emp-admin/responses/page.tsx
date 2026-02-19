"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, query, getDocs, orderBy, updateDoc, doc, serverTimestamp } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function ResponsesPage() {
    const router = useRouter();
    const [responses, setResponses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    const fetchResponses = async () => {
        setLoading(true);
        try {
            const q = query(collection(db, "responses"), orderBy("createdAt", "desc"));
            const snapshot = await getDocs(q);
            const data = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setResponses(data);
        } catch (error) {
            console.error("Error fetching responses:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchResponses();
    }, []);

    const filteredResponses = responses.filter(res =>
        res.formTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        res.submittedBy?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="flex h-screen items-center justify-center text-muted-foreground">Loading responses...</div>;

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <Button variant="ghost" className="-ml-2 mb-2 text-muted-foreground" onClick={() => router.push("/emp-admin")}>
                        <ArrowLeft className="h-4 w-4 mr-2" /> Back to Dashboard
                    </Button>
                    <h2 className="text-2xl font-bold tracking-tight">All Responses</h2>
                    <p className="text-muted-foreground">Manage and view all form submissions.</p>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>Submissions</CardTitle>
                        <div className="relative w-full max-w-sm">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search forms or users..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-8"
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[120px] hidden md:table-cell">Request ID</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Form</TableHead>
                                <TableHead className="hidden md:table-cell">Submitted By</TableHead>
                                <TableHead className="text-right">Date</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredResponses.map((res) => (
                                <TableRow
                                    key={res.id}
                                    className="cursor-pointer hover:bg-muted/50 transition-colors"
                                    onClick={() => router.push(`/emp-admin/responses/${res.id}`)}
                                >
                                    <TableCell className="font-mono text-xs text-muted-foreground hidden md:table-cell">
                                        {res.requestId || res.id.slice(0, 8)}
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={
                                                res.status === "Accepted" ? "default" :
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
                                    <TableCell className="font-medium">
                                        {res.formTitle}
                                        <div className="md:hidden text-xs text-muted-foreground mt-1">
                                            By: {res.submittedBy?.split('@')[0]}
                                        </div>
                                    </TableCell>
                                    <TableCell className="hidden md:table-cell">
                                        {res.submittedBy}
                                    </TableCell>
                                    <TableCell className="text-right text-muted-foreground text-xs sm:text-sm">
                                        {res.createdAt?.toDate ? new Date(res.createdAt.toDate()).toLocaleDateString() : "N/A"}
                                    </TableCell>
                                </TableRow>
                            ))}
                            {filteredResponses.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                                        No responses found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
