import React from "react";

export interface TabPanelProps {
  children?: React.ReactNode;
  tabName: string;
  tabId: number;
  activeTabId: number;
}
