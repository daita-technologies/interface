import { Avatar } from "@mui/material";

import { useSelector } from "react-redux";
import { RootState } from "reduxes";

export default function MyAvatar(props: { size: number }) {
  const { size } = props;

  const userInfo = useSelector(
    (state: RootState) => state.authReducer.userInfo
  );

  const alt = userInfo ? `avatar of ${userInfo.display_name}` : "none avatar";
  const src = userInfo ? userInfo.avatar : "";

  return (
    <Avatar
      sx={{
        width: size || 5,
        height: size || 5,
        color: "text.secondary",
      }}
      src={src}
      alt={alt}
    />
  );
}
