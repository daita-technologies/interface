import { useEffect, useRef } from "react";
import { matchPath, useLocation } from "react-router-dom";

const useCustomParams = (pathNameMatch: string) => {
  const params = useRef<{ [paramName: string]: string } | null>(null);
  const location = useLocation();
  useEffect(() => {
    const checkPath = matchPath(location.pathname, pathNameMatch);
    if (checkPath && checkPath.params) {
      params.current = checkPath.params;
    }
  }, [location, pathNameMatch]);

  return params.current;
};

export default useCustomParams;
