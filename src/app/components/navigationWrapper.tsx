'use client'
import { useAuthContext } from "../auth/useAuthContext";
import Navigation from "./navigation/page";

export default function NavigationWrapper() {
  const { currentSession } = useAuthContext();
  return <Navigation currentSession={currentSession} />;
}