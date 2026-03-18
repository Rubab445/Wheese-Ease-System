import React from "react";
import { Patient } from "../data/patients";
import { AnalyticsPanel } from "../components/sections/AnalyticsPanel";

interface AnalyticsPageProps {
  patients: Patient[];
}

export const AnalyticsPage: React.FC<AnalyticsPageProps> = ({ patients }) => {
  return <AnalyticsPanel patients={patients} />;
};
