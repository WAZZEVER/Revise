"use client"

import { useState, useEffect } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { Suspense } from "react"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { CardSkeleton } from "@/components/card-skeleton"
import { RecentCard } from "@/components/dashboard-card"
import ThemeSwitch from "@/components/ThemeSwitch"
import { createClient } from "@/utils/supabase/client"

interface NavMainItem {
  id: string;
  name: string;
  access: string | null;
}

export default function DashboardPage() {
  const [recentNavItems, setRecentNavItems] = useState<NavMainItem[]>([]);
  const supabase = createClient();

  useEffect(() => {
    const fetchRecentNavItems = async () => {
      try {
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError) throw authError;
        if (!user) throw new Error('User not authenticated');

        const { data, error } = await supabase
          .from("navfavorites")
          .select('*')
          .eq('userid', user.id)
          .order('access', { ascending: false })
          .limit(4);

        if (error) throw error;

        setRecentNavItems(data || []);
      } catch (error) {
        console.error("Error fetching recent nav items:", error);
      }
    };

    fetchRecentNavItems();
  }, []);

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="min-h-screen bg-background text-foreground">
          <header className="border-b">
            <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
              <SidebarTrigger className="-ml-1" />
              <h1 className="text-2xl font-bold">Dashboard</h1>
              <ThemeSwitch />
            </div>
          </header>
          <main>
            <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
              <div className="px-4 py-6 sm:px-0">
                <h2 className="text-xl font-semibold mb-4">Recent Pages</h2>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                  {recentNavItems.length > 0 ? (
                    recentNavItems.map((item, index) => (
                      <Suspense key={item.id} fallback={<CardSkeleton />}>
                        <RecentCard
                          id={item.id}
                          name={item.name}
                          access={item.access}
                          delay={index * 0.1}
                        />
                      </Suspense>
                    ))
                  ) : (
                    <p className="col-span-full text-muted-foreground">No recent pages found.</p>
                  )}
                </div>
              </div>
            </div>
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}