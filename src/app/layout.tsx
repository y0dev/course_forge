'use client';

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, FileText, Settings } from "lucide-react";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const navigationItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: BookOpen,
  },
  {
    title: "Course Editor",
    url: "/courseEditor",
    icon: FileText,
  }
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <html lang="en">
      <body>
        <div className="min-h-screen flex flex-col bg-slate-50">
          <header className="border-b border-slate-200 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center h-16">
                <div className="flex items-center">
                  <Link href="/" className="flex items-center space-x-2">
                    <BookOpen className="h-8 w-8 text-slate-800" />
                    <span className="text-xl font-bold text-slate-900">Course Forge</span>
                  </Link>
                </div>
                <nav className="flex space-x-8">
                  {navigationItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.url;
                    return (
                      <Link
                        key={item.url}
                        href={item.url}
                        className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                          isActive
                            ? "bg-slate-100 text-slate-900"
                            : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    );
                  })}
                </nav>
              </div>
            </div>
          </header>
          <main className="flex-1">
            {children}
          </main>
        </div>
        <Toaster />
      </body>
    </html>
  );
}