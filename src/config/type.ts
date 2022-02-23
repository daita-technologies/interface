import React from "react";

export interface CustomRouteProps {
  path: string;
  exact?: boolean;
  component?: React.ComponentType<any>;
  isPrivate?: boolean;
}
