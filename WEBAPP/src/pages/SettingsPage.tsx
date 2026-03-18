import React from "react";
import { SettingsPanel } from "../components/sections/SettingsPanel";
import { DOCTOR_PROFILE } from "../data/constants";

interface SettingsPageProps {
  onSave?: () => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = () => {
  return <SettingsPanel doctorProfile={DOCTOR_PROFILE} />;
};