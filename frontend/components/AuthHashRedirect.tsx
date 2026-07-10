"use client";

import { useEffect } from "react";

export default function AuthHashRedirect() {
  useEffect(() => {
    const hash = window.location.hash;
    if (
      hash.includes("access_token") &&
      window.location.pathname !== "/completar-registro"
    ) {
      window.location.replace(`/completar-registro${hash}`);
    }
  }, []);

  return null;
}
