"use client";

import { useEffect } from "react";
import { initWebVitals } from "@/lib/monitoring/performance";
import { initAnalytics } from "@/lib/monitoring/analytics";

/**
 * Component to initialize monitoring on the client side
 */
export default function MonitoringInitializer() {
  useEffect(() => {
    // Initialize Web Vitals monitoring
    initWebVitals();
    
    // Initialize analytics
    initAnalytics();
    
    // Log successful initialization
    console.log("📊 Monitoring initialized");
  }, []);
  
  return null;
}
