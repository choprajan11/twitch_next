"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@heroui/react";

export function NavbarAuthButton() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for session cookie on client side
    const checkAuth = () => {
      try {
        const cookies = document.cookie.split(';');
        const sessionCookie = cookies.find(c => c.trim().startsWith('session='));
        
        if (sessionCookie) {
          const value = sessionCookie.split('=')[1];
          const session = JSON.parse(atob(value));
          
          if (session.exp > Date.now()) {
            setIsLoggedIn(true);
          }
        }
      } catch {
        // Invalid session
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  if (isLoading) {
    return (
      <div className="w-24 h-10 bg-zinc-200 dark:bg-zinc-800 rounded-xl animate-pulse" />
    );
  }

  if (isLoggedIn) {
    return (
      <Link href="/dashboard">
        <Button 
          style={{ backgroundColor: '#9146FF', color: 'white' }} 
          variant="primary" 
          className="font-bold shadow-[#9146FF]/30 rounded-xl"
        >
          Dashboard
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1">
            <path d="M5 12h14"/>
            <path d="m12 5 7 7-7 7"/>
          </svg>
        </Button>
      </Link>
    );
  }

  return (
    <Link href="/login">
      <Button 
        style={{ backgroundColor: '#9146FF', color: 'white' }} 
        variant="primary" 
        className="font-bold shadow-[#9146FF]/30 rounded-xl"
      >
        Get Started
      </Button>
    </Link>
  );
}
