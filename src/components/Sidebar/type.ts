import SvgIcon from "@mui/material/SvgIcon";
import { ApiListProjectsItem } from "reduxes/project/type";

export interface BaseNavItemType {
  name: string;
  // eslint-disable-next-line no-unused-vars
  Icon: typeof SvgIcon;
  to?: string;
}

export interface NavItemType extends BaseNavItemType {
  subNav?: Array<NavItemType>;
}
export interface NavProjectItemType extends BaseNavItemType {
  subNav?: Array<Pick<ApiListProjectsItem, "project_name" | "project_id">>;
}

export interface NavItemProps extends NavItemType {
  key?: string;
  onClick?: () => void;
  isActive?: boolean;
}

export interface NavProjectItemProps extends NavProjectItemType {
  key?: string;
  onClick?: () => void;
}

export interface NavRowProps extends BaseNavItemType {
  key?: string;
  triggerToggleCollapse?: () => void;
  isActived?: boolean;
  isSubNav?: boolean;
}
