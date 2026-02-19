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
import { Menu, LayoutDashboard, LogOut, User } from "lucide-react";

export default function EmployeeLayout({ children }: { children: React.ReactNode }) {
    const { user, role, logout, loading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    useEffect(() => {
        if (!loading) {
            if (!user) {
                router.push("/login");
            }
        }
    }, [user, loading, router]);

    const handleLogout = async () => {
        await logout();
        router.push("/login");
    };

    if (loading) return <div className="flex h-screen items-center justify-center text-muted-foreground">Loading...</div>;
    if (!user) return null;

    const links = [
        { href: "/erp-emp", label: "Dashboard", icon: <LayoutDashboard className="h-4 w-4" /> },
    ];

    const SidebarContent = () => (
        <div className="flex flex-col h-full">
            <div className="p-6">
                <div className="flex items-center gap-2 mb-6">
                    <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold shadow-sm">
                        E
                    </div>
                    <h1 className="text-lg font-bold tracking-tight">Employee Portal</h1>
                </div>
                <div className="space-y-1">
                    {links.map((link) => (
                        <Button
                            key={link.href}
                            variant={pathname === link.href ? "secondary" : "ghost"}
                            className="w-full justify-start gap-3"
                            asChild
                        >
                            <Link href={link.href} onClick={() => setIsMobileOpen(false)}>
                                {link.icon}
                                {link.label}
                            </Link>
                        </Button>
                    ))}
                </div>
            </div>
            <div className="mt-auto p-6 border-t">
                <div className="flex items-center gap-3 mb-4 px-2">
                    <Avatar>
                        <AvatarImage src={user.photoURL || ""} />
                        <AvatarFallback className="bg-primary/10 text-primary">
                            {user.email?.[0].toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                    <div className="overflow-hidden">
                        <p className="text-sm font-medium truncate">{user.displayName || "Employee"}</p>
                        <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                    </div>
                </div>
                <Button variant="outline" className="w-full justify-start gap-2 text-muted-foreground hover:text-foreground" onClick={handleLogout}>
                    <LogOut className="h-4 w-4" />
                    Log Out
                </Button>
            </div>
        </div>
    );

    return (
        <div className="flex min-h-screen bg-muted/20">
            {/* Desktop Sidebar */}
            <aside className="hidden md:flex flex-col w-64 bg-background border-r fixed inset-y-0 z-50">
                <SidebarContent />
            </aside>

            {/* Mobile Header & Content */}
            <div className="flex-1 md:ml-64 flex flex-col">
                <header className="md:hidden h-16 border-b bg-background flex items-center px-4 justify-between sticky top-0 z-40">
                    <div className="flex items-center gap-2">
                        <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold shadow-sm">
                            E
                        </div>
                        <span className="font-bold">Employee Portal</span>
                    </div>
                    <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <Menu className="h-5 w-5" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="p-0 w-64">
                            <SidebarContent />
                        </SheetContent>
                    </Sheet>
                </header>

                <main className="flex-1 p-4 md:p-8 overflow-y-auto">
                    <div className="max-w-5xl mx-auto space-y-8">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
