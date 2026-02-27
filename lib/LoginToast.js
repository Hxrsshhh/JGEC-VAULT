"use client";

import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { toast } from "sonner";

export default function AuthToastWatcher() {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "authenticated") {
      toast.success(`Welcome ${session.user.name} 🚀`);
    }
  }, [status]);

  return null;
}