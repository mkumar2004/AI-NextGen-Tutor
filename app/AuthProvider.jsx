"use client";
import { api } from "@/convex/_generated/api";
import { useUser } from "@stackframe/stack";
import { useMutation } from "convex/react";
import React, { useEffect, useState } from "react";
import { UserContext } from "./_context/UserContext";

function AuthProvider({ children }) {
  const user = useUser();
  const createUser = useMutation(api.users.CreateUser);

  const [userData, setUserData] = useState(null);

  // define BEFORE useEffect
  const createNewUser = async () => {
    try {
      const res = await createUser({
        name: user?.displayName || "Unknown",
        email: user?.primaryEmail,
      });
      setUserData(res);
    } catch (err) {
      console.error("Error creating user:", err);
    }
  };

  useEffect(() => {
    if (user) {
      createNewUser();
    }
  }, [user]);

  return (
    <UserContext.Provider value={{ userData, setUserData }}>
      {children}
    </UserContext.Provider>
  );
}

export default AuthProvider;
