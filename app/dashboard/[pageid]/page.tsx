"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // Correct router import for Next.js
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import ThemeSwitch from "@/components/ThemeSwitch";
import { createClient } from "@/utils/supabase/client";
import  SectionPage  from "@/components/card-main"


export default function PageDetails() {
  const [pageName, setPageName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();


  useEffect(() => {
    const fetchPageDetails = async () => {
      // Extract pageid only if the router is fully ready
      const pageid = window.location.pathname.split("/").pop();
      if (!pageid) return;

      try {
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError) throw authError;
        if (!user) throw new Error("User not authenticated");

        const { data, error } = await supabase
          .from("navfavorites")
          .select("name")
          .eq("id", pageid)
          .eq("userid", user.id)
          .single();

        if (error) throw error;

        setPageName(data?.name || "Unknown Page");
      } catch (error) {
        setError("Failed to fetch page details.");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPageDetails();
  }, [router]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-background text-foreground">
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-background text-foreground">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="min-h-screen bg-background text-foreground">
          <header className="border-b">
            <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
              <SidebarTrigger className="-ml-1" />
              <h1 className="text-2xl font-bold">{pageName}</h1>
              <ThemeSwitch />
            </div>
          </header>
          <main>
            <SectionPage/>
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
