import React from "react";
import { AnalyticsPanel } from "../components/sections/AnalyticsPanel";

export const AnalyticsPage: React.FC<{ patients: any[] }> = ({ patients }) => {
  return (
    <div style={{ width: "100%", height: "100vh", overflow: "hidden" }}>
      <AnalyticsPanel patients={patients} />
    </div>
  );
};