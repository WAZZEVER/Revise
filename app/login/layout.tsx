"use client";

import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const supabase = await createClient();
      const { data } = await supabase.auth.getUser();

      if (data) {
        // If the user is already logged in, redirect them to the dashboard
        router.push("/dashboard");
      }

      setLoading(false);
    };

    checkUser();
  }, [router]);

  if (loading) {
    // Optionally, show a loading state while checking the user status
    return <div>Loading...</div>;
  }

  return <>{children}</>;
}
