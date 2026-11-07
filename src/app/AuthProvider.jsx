'use client';

import React, { useEffect, useState } from 'react';
import { useUser } from '@stackframe/stack';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { UserContext } from '@/context/UserContext';

export default function AuthProvider({ children }) {
  const user = useUser();
  const createUser = useMutation(api.users.CreateUser);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const syncUser = async () => {
      if (!user) return;
      try {
        const res = await createUser({
          name: user.displayName || 'Unknown',
          email: user.primaryEmail || '',
        });
        if (isMounted) {
          setUserData(res);
        }
      } catch (err) {
        console.error('Error syncing user with Convex:', err);
      }
    };

    syncUser();

    return () => {
      isMounted = false;
    };
  }, [user, createUser]);

  return (
    <UserContext.Provider value={{ userData, setUserData }}>
      {children}
    </UserContext.Provider>
  );
}
