import React from "react";
import { AlertsPanel } from "../components/sections/AlertsPanel";

interface Alert {
  id: number;
  pid: string;
  patient: string;
  type: "high" | "mod" | "low";
  msg: string;
  time: string;
  icon: string;
  read: boolean;
}

interface AlertsPageProps {
  alerts: Alert[];
  alertFilter: "all" | "unread" | "high" | "mod" | "low";
  onFilterChange: (filter: "all" | "unread" | "high" | "mod" | "low") => void;
  onMarkAsRead: (id: number) => void;
}

export const AlertsPage: React.FC<AlertsPageProps> = ({
  alerts,
  alertFilter,
  onFilterChange,
  onMarkAsRead,
}) => {
  return (
    <AlertsPanel
      alerts={alerts}
      alertFilter={alertFilter}
      onFilterChange={onFilterChange}
      onMarkAsRead={onMarkAsRead}
    />
  );
};
