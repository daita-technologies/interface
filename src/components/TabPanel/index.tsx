import { Box } from "@mui/material";
import { TabPanelProps } from "./type";

const TabPanel = function (props: TabPanelProps) {
  const { children, activeTabId, tabId, tabName, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={activeTabId !== tabId}
      id={`${tabName}-tabpanel-${tabId}`}
      aria-labelledby={`${tabName}-tab-${tabId}`}
      {...other}
    >
      {activeTabId === tabId && <Box>{children}</Box>}
    </div>
  );
};
export default TabPanel;
