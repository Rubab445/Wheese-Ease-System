import React, { useState } from "react";
import { Patient } from "../data/patients";
import { THEME_COLORS } from "../data/constants";
import { OverviewPanel } from "../components/sections/OverviewPanel";

interface OverviewPageProps {
  patients: Patient[];
  alerts: any[];
  weekData: any[];
  onViewPatient: (id: string) => void;
  onNavigate: (section: string) => void;
}

export const OverviewPage: React.FC<OverviewPageProps> = ({
  patients,
  alerts,
  weekData,
  onViewPatient,
  onNavigate,
}) => {
  const riskCounts = {
    high: patients.filter((p) => p.risk >= 61).length,
    mod: patients.filter((p) => p.risk >= 31 && p.risk < 61).length,
    low: patients.filter((p) => p.risk < 31).length,
  };

 return (
  <OverviewPanel
    patients={patients}
    weekData={weekData}
    riskCounts={riskCounts}
    onViewPatient={(id) => {
      onViewPatient(id);     
      onNavigate("patients"); 
    }}
  />
);
};
