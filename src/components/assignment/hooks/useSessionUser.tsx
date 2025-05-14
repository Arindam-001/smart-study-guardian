
import { useEffect } from 'react';
import { useAppContext } from '@/lib/context';
import { getItem, setItem, STORAGE_KEYS } from '@/lib/local-storage';

export const useSessionUser = () => {
  const { user, setUser } = useAppContext();

  useEffect(() => {
    if (!user) {
      const sessionUser = sessionStorage.getItem('TEMP_AUTH_USER');
      if (sessionUser) {
        try {
          const parsedUser = JSON.parse(sessionUser);
          setUser(parsedUser);
          setItem(STORAGE_KEYS.AUTH_USER, parsedUser);
          // Clean up session storage
          sessionStorage.removeItem('TEMP_AUTH_USER');
        } catch (err) {
          console.error('Error parsing session user:', err);
        }
      }
    }
  }, [user, setUser]);

  return { user };
};
