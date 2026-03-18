import React, { useState } from "react";
import { Patient } from "../data/patients";
import { PatientsPanel } from "../components/sections/PatientsPanel";

interface PatientsPageProps {
  patients: Patient[];
  selectedPatientId: string;
  onSelectPatient: (id: string) => void;
  onOpenChat: (id: string) => void;
}

export const PatientsPage: React.FC<PatientsPageProps> = ({
  patients,
  selectedPatientId,
  onSelectPatient,
  onOpenChat,
}) => {
  const selectedPatient = patients.find((p) => p.id === selectedPatientId);

  return (
    <PatientsPanel
      selectedPatient={selectedPatient}
      onChat={onOpenChat}
    />
  );
};
