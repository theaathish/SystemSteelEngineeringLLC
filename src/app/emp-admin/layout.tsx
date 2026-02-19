"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { LayoutDashboard, FilePlus, FileText, Menu, LogOut } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const { user, role, loading, logout } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const [open, setOpen] = useState(false);

    useEffect(() => {
        if (!loading) {
            if (!user) {
                router.push("/login");
            } else if (role !== "admin") {
                router.push("/erp-emp");
            }
        }
    }, [user, role, loading, router]);

    if (loading) return <div className="flex h-screen items-center justify-center text-muted-foreground">Loading...</div>;
    if (!user || role !== "admin") return null;

    const links = [
        { href: "/emp-admin", label: "Dashboard", icon: LayoutDashboard },
        { href: "/emp-admin/create", label: "Create Form", icon: FilePlus },
        { href: "/emp-admin/responses", label: "Responses", icon: FileText },
    ];

    const SidebarContent = () => (
        <div className="flex flex-col h-full bg-background">
            <div className="p-6 flex items-center gap-3">
                <div className="h-9 w-9 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold text-lg pointer-events-none">
                    S
                </div>
                <div>
                    <h1 className="font-bold tracking-tight text-foreground">Admin Panel</h1>
                    <p className="text-xs text-muted-foreground font-medium">ERP SYSTEM</p>
                </div>
            </div>
            <Separator />
            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                {links.map((link) => {
                    const isActive = pathname === link.href;
                    const Icon = link.icon;
                    return (
                        <Button
                            key={link.href}
                            variant={isActive ? "secondary" : "ghost"}
                            className={`w-full justify-start gap-3 ${isActive ? "font-semibold" : "font-medium text-muted-foreground"}`}
                            asChild
                            onClick={() => setOpen(false)}
                        >
                            <Link href={link.href}>
                                <Icon className="h-4 w-4" />
                                {link.label}
                            </Link>
                        </Button>
                    );
                })}
            </nav>
            <Separator />
            <div className="p-4 bg-muted/20">
                <div className="flex items-center gap-3 p-2 rounded-lg border bg-background shadow-sm">
                    <Avatar className="h-9 w-9 border">
                        <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.email}`} />
                        <AvatarFallback>{user.email?.[0].toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 overflow-hidden">
                        <p className="text-sm font-semibold truncate leading-none mb-1">{user.email}</p>
                        <p className="text-xs text-muted-foreground truncate">Administrator</p>
                    </div>
                </div>
                <Button variant="ghost" className="w-full mt-2 justify-start gap-2 h-8 text-xs text-muted-foreground hover:text-destructive" onClick={logout}>
                    <LogOut className="h-3 w-3" />
                    Sign Out
                </Button>
            </div>
        </div>
    );

    return (
        <div className="flex h-screen bg-muted/40 font-sans text-foreground">
            {/* Desktop Sidebar */}
            <aside className="w-64 border-r hidden md:flex flex-col bg-background">
                <SidebarContent />
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col h-screen overflow-hidden">
                {/* Mobile Header */}
                <header className="md:hidden bg-background border-b p-4 flex justify-between items-center sticky top-0 z-20">
                    <div className="flex items-center gap-2">
                        <Sheet open={open} onOpenChange={setOpen}>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon" className="-ml-2">
                                    <Menu className="h-5 w-5" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="left" className="p-0 w-64 border-r">
                                <SidebarContent />
                            </SheetContent>
                        </Sheet>
                        <div className="font-bold text-lg">Admin Panel</div>
                    </div>
                    <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                            {user.email?.[0].toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                </header>

                <div className="flex-1 overflow-auto p-4 md:p-8 relative">
                    <div className="max-w-7xl mx-auto space-y-6">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    );
}
