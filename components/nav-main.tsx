"use client";

import { useState, useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Plus, MoreHorizontal, StarOff, Trash2, ArrowUpRight, Link as LinkIcon } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { toast } from "@/hooks/use-toast";

interface Favorite {
  id: string;
  name: string;
  emoji: string;
  access: string;
}

export function NavFavorites() {
  const { isMobile } = useSidebar();
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const supabase = createClient();

  // Fetch favorites from Supabase
  const fetchFavorites = async () => {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError) throw authError;
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from("navfavorites")
        .select('*')
        .eq('userid', user.id)
        .order('access', { ascending: false }); // Sort by most recently accessed

      if (error) throw error;

      setFavorites(data || []);
    } catch (error) {
      console.error("Error fetching favorites:", error);
      toast({
        title: "Error",
        description: "Failed to load favorites.",
        variant: "destructive",
      });
    }
  };

  // Fetch favorites when component mounts and on user authentication changes
  useEffect(() => {
    fetchFavorites();

    // Optional: Listen for auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange(() => {
      fetchFavorites();
    });

    // Cleanup subscription
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Add a new favorite to the database
  const addFavorite = async () => {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError) throw authError;
      if (!user) throw new Error('User not authenticated');

      const newIndex = favorites.length + 1;
      
      // Insert the new favorite into the Supabase database
      const { data, error } = await supabase
        .from("navfavorites")
        .insert({
          name: `Untitled ${newIndex}`,
          emoji: "⭐",
          userid: user.id,
        })
        .select()
        .single();

      if (error) throw error;

      // Refetch favorites to ensure we have the most up-to-date list
      await fetchFavorites();

      toast({
        title: "Favorite Added",
        description: "A new favorite has been created.",
      });
    } catch (error) {
      console.error("Error adding favorite:", error);
      toast({
        title: "Error",
        description: "Failed to add favorite.",
        variant: "destructive",
      });
    }
  };

  // Remove a favorite from the database
  const removeFavorite = async (favoriteId: string) => {
    try {
      const { error } = await supabase
        .from("navfavorites")
        .delete()
        .eq("id", favoriteId);

      if (error) throw error;

      // Refetch favorites to ensure we have the most up-to-date list
      await fetchFavorites();
      
      toast({
        title: "Favorite Removed",
        description: "The favorite has been deleted.",
      });
    } catch (error) {
      console.error("Error removing favorite:", error);
      toast({
        title: "Error",
        description: "Failed to remove favorite.",
        variant: "destructive",
      });
    }
  };

  // Update access timestamp when favorite is clicked
  const updateAccessTimestamp = async (favoriteId: string) => {
    try {
      await supabase
        .from("navfavorites")
        .update({ access: new Date() })
        .eq("id", favoriteId);

      // Optionally refetch to ensure UI is updated
      await fetchFavorites();
    } catch (error) {
      console.error("Error updating access timestamp:", error);
    }
  };

  // Copy link to clipboard
  const copyLink = (id: string) => {
    const fullUrl = `${window.location.origin}/page/${id}`;
    navigator.clipboard.writeText(fullUrl).then(() => {
      toast({
        title: "Link Copied",
        description: "Favorite link copied to clipboard.",
      });
    }).catch(err => {
      console.error('Failed to copy link: ', err);
      toast({
        title: "Error",
        description: "Failed to copy link.",
        variant: "destructive",
      });
    });
  };

  // Open in new tab
  const openInNewTab = (id: string) => {
    const fullUrl = `${window.location.origin}/page/${id}`;
    window.open(fullUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <SidebarGroup>
      <SidebarGroupLabel>
        Favorites
        <Button
          variant="link"
          className="ml-2 p-0 text-sidebar-foreground hover:text-sidebar-foreground/80"
          onClick={addFavorite}
          aria-label="Add Favorite"
        >
          <Plus />
        </Button>
      </SidebarGroupLabel>
      <SidebarMenu>
        {favorites.map((item) => (
          <SidebarMenuItem key={item.id}>
            <SidebarMenuButton asChild>
              <a
                href={`/page/${item.id}`}
                title={item.name}
                onClick={() => updateAccessTimestamp(item.id)}
              >
                <span>{item.emoji} {item.name}</span>
              </a>
            </SidebarMenuButton>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuAction showOnHover>
                  <MoreHorizontal />
                  <span className="sr-only">More</span>
                </SidebarMenuAction>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-56 rounded-lg"
                side={isMobile ? "bottom" : "right"}
                align={isMobile ? "end" : "start"}
              >
                <DropdownMenuItem 
                  onSelect={() => removeFavorite(item.id)}
                >
                  <StarOff className="text-muted-foreground mr-2" />
                  <span>Remove from Favorites</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onSelect={() => copyLink(item.id)}
                >
                  <LinkIcon className="text-muted-foreground mr-2" />
                  <span>Copy Link</span>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onSelect={() => openInNewTab(item.id)}
                >
                  <ArrowUpRight className="text-muted-foreground mr-2" />
                  <span>Open in New Tab</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onSelect={() => removeFavorite(item.id)}
                >
                  <Trash2 className="text-muted-foreground mr-2" />
                  <span>Delete</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}