'use server';

import { createClient } from '@/utils/supabase/server'
import { redirect  } from "next/navigation";
import { headers } from "next/headers";

export const signInWithGoogle = async () => {

    const supabase = await createClient()
    const headersData = await headers();
    const origin = headersData.get('origin');

    const {error, data} = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${origin}/auth/callback`,
      },
    })
    
    if (error) {
      console.log(error)
    } else {
    console.log(data.url)
      return redirect(data.url)
    }

  }
