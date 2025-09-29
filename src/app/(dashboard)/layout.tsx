import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarTrigger,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarInset,
} from "@/components/ui/sidebar";
import {
  Home,
  Briefcase,
  Users,
  LogOut,
  Bell,
  Wallet,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/icons";
import Link from "next/link";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2">
            <Logo className="size-7 text-primary" />
            <span className="text-lg font-semibold font-headline">MeritBase</span>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton href="/dashboard-freelancer" isActive>
                <Home />
                Dashboard
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton href="/dashboard-freelancer/cv-wallet">
                <Wallet />
                CVWallet
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton href="/dashboard-freelancer">
                <Briefcase />
                My Gigs
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton href="/dashboard-freelancer">
                <Bell />
                Notifications
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton href="/dashboard-employer">
                <Users />
                Employer View
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src="https://picsum.photos/seed/101/100/100" data-ai-hint="professional portrait" alt="User" />
              <AvatarFallback>AJ</AvatarFallback>
            </Avatar>
            <div className="flex flex-col text-sm">
              <span className="font-semibold">Alice Johnson</span>
              <span className="text-muted-foreground">alice@email.com</span>
            </div>
          </div>
          <Button variant="ghost" size="icon" asChild>
            <Link href="/"><LogOut /></Link>
          </Button>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background px-4 sm:px-6">
            <SidebarTrigger className="md:hidden" />
            <div className="flex-1">
                <h1 className="text-lg font-semibold font-headline">Dashboard</h1>
            </div>
        </header>
        <main className="flex-1 p-4 sm:p-6 bg-secondary/50">
            {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
