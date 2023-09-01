"use client";
import accountServices from "@/appwrite/Account";
import { AuthProvider } from "@/context/authContext";
import React, { useEffect, useState } from "react";

function layout({ children }: { children: React.ReactNode }) {
  const [authStatus, setAuthStatus] = useState(false);
  const [loader, setloader] = useState(true);

  useEffect(() => {
    accountServices
      .isLoggedIn()
      .then(setAuthStatus)
      .finally(() => setloader(false));
  }, []);

  return (
    <AuthProvider value={{ authStatus, setAuthStatus }}>
      {!loader && <main>{children}</main>}
    </AuthProvider>
  );
}

export default layout;
