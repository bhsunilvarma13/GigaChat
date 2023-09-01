"use client";
import useAuth from "@/context/useAuth";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

function layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  const { authStatus } = useAuth();

  const redirect = () => {
    router.push("/");
    return <></>;
  };

  useEffect(() => {
    if (authStatus) {
      redirect();
    }
  }, []);

  return children;
}

export default layout;
