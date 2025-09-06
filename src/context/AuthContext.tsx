import React, { createContext, useContext, ReactNode, useEffect, useState } from 'react';
import { useRouter, useSegments } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../redux/store';
import { signOut as signOutAction } from '../redux/authSlice';

type AuthContextType = {
  signOut: () => void;
  user: any; // user redux se
  isLoading: boolean;
  completeOnboarding: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function useProtectedRoute(user: any, hasOnboarded: boolean) {
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (segments.length === 0) return;
    const inAuthGroup = segments[0] === '(auth)';

    if (!hasOnboarded) {
      // pehla welcome/onboarding dikha
      if (segments[1] !== 'welcome') {
        router.replace('/(auth)/welcome');
      }
    } else if (!user && !inAuthGroup) {
      // login nahi hai → login page
      router.replace('/(auth)/login');
    } else if (user?.isNewUser && segments[1] !== 'register') {
      // agar new user hai aur register complete nahi hua
      router.replace('/(auth)/register');
    } else if (user && inAuthGroup && !user.isNewUser) {
      // agar login hai aur auth group me hai → sidha home
      router.replace('/(tabs)/home');
    }
  }, [user, segments, hasOnboarded, router]);
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const dispatch: AppDispatch = useDispatch();
  const { user, loading } = useSelector((state: RootState) => state.auth);
  const [hasOnboarded, setHasOnboarded] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  useEffect(() => {
    const checkOnboarding = async () => {
      try {
        const onboarded = await AsyncStorage.getItem('hasOnboarded');
        if (onboarded === 'true') {
          setHasOnboarded(true);
        }
      } catch (e) {
        console.error('Failed to load onboarding state.', e);
      } finally {
        setIsAuthLoading(false);
      }
    };
    checkOnboarding();
  }, []);

  useProtectedRoute(user, hasOnboarded);

  const signOut = () => {
    dispatch(signOutAction());
  };

  const completeOnboarding = async () => {
    await AsyncStorage.setItem('hasOnboarded', 'true');
    setHasOnboarded(true);
  };

  return (
    <AuthContext.Provider
      value={{
        signOut,
        user,
        isLoading: loading === 'pending' || isAuthLoading,
        completeOnboarding,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
