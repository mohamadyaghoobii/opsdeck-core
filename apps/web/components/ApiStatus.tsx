"use client";

import { useEffect, useState } from "react";

import { API_BASE } from "@/lib/api";

type State = "checking" | "online" | "offline";

export function ApiStatus() {
  const [state, setState] = useState<State>("checking");

  useEffect(() => {
    let active = true;
    const check = async () => {
      try {
        const res = await fetch(`${API_BASE}/health`, { cache: "no-store" });
        if (active) setState(res.ok ? "online" : "offline");
      } catch {
        if (active) setState("offline");
      }
    };
    check();
    const timer = setInterval(check, 15000);
    return () => {
      active = false;
      clearInterval(timer);
    };
  }, []);

  const text = state === "online" ? "API online" : state === "offline" ? "API unreachable" : "Checking API";
  const dot = state === "online" ? "ok" : state === "offline" ? "bad" : "warn";

  return (
    <span className="status-pill">
      <span className={`dot ${dot}`} />
      {text}
    </span>
  );
}
