"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useUIStore, useAuthStore, useProjectStore } from "@/lib/store";
import {
  Brain,
  LayoutDashboard,
  Sparkles,
  Rocket,
  Search,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  FolderOpen,
  Plus,
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Fine-Tune", href: "/fine-tune", icon: Sparkles },
  { name: "Deployments", href: "/deployments", icon: Rocket },
  { name: "Deep Research", href: "/research", icon: Search },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { sidebarOpen, setSidebarOpen } = useUIStore();
  const { user, clearAuth } = useAuthStore();
  const { projects, currentProject } = useProjectStore();

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen border-r bg-background transition-all duration-300",
        sidebarOpen ? "w-64" : "w-16"
      )}
    >
      <div className="flex h-full flex-col">
        <div className="flex h-16 items-center justify-between border-b px-4">
          {sidebarOpen && (
            <Link href="/dashboard" className="flex items-center gap-2">
              <Brain className="h-8 w-8 text-primary" />
              <span className="font-bold">LLM Toolkit</span>
            </Link>
          )}
          {!sidebarOpen && (
            <Link href="/dashboard">
              <Brain className="h-8 w-8 text-primary mx-auto" />
            </Link>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className={cn(!sidebarOpen && "mx-auto")}
          >
            {sidebarOpen ? (
              <ChevronLeft className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </Button>
        </div>

        <ScrollArea className="flex-1 py-4">
          <nav className="space-y-1 px-2">
            {navigation.map((item) => {
              const isActive = pathname.startsWith(item.href);
              return (
                <Link key={item.name} href={item.href}>
                  <Button
                    variant={isActive ? "secondary" : "ghost"}
                    className={cn(
                      "w-full justify-start",
                      !sidebarOpen && "justify-center px-2"
                    )}
                  >
                    <item.icon className={cn("h-5 w-5", sidebarOpen && "mr-3")} />
                    {sidebarOpen && item.name}
                  </Button>
                </Link>
              );
            })}
          </nav>

          {sidebarOpen && projects.length > 0 && (
            <div className="mt-6 px-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Projects
                </span>
                <Link href="/projects/new">
                  <Button variant="ghost" size="icon" className="h-6 w-6">
                    <Plus className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
              <div className="space-y-1">
                {projects.slice(0, 5).map((project) => (
                  <Link key={project.id} href={`/projects/${project.id}`}>
                    <Button
                      variant={currentProject?.id === project.id ? "secondary" : "ghost"}
                      size="sm"
                      className="w-full justify-start text-sm"
                    >
                      <FolderOpen className="h-4 w-4 mr-2" />
                      <span className="truncate">{project.name}</span>
                    </Button>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </ScrollArea>

        <div className="border-t p-4">
          {sidebarOpen ? (
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground">
                {user?.name?.charAt(0).toUpperCase() || "U"}
              </div>
              <div className="flex-1 truncate">
                <p className="text-sm font-medium truncate">{user?.name}</p>
                <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
              </div>
              <Button variant="ghost" size="icon" onClick={clearAuth}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <Button variant="ghost" size="icon" onClick={clearAuth} className="mx-auto">
              <LogOut className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </aside>
  );
}
