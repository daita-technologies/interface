import Crop32Icon from "@mui/icons-material/Crop32";
import DeleteIcon from "@mui/icons-material/Delete";
import FolderIcon from "@mui/icons-material/Folder";
import HexagonIcon from "@mui/icons-material/Hexagon";
import LockIcon from "@mui/icons-material/Lock";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import PanoramaFishEyeIcon from "@mui/icons-material/PanoramaFishEye";
import PolylineIcon from "@mui/icons-material/Polyline";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import { useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteDrawObject,
  setHiddenDrawObject,
  setLockDrawObject,
  setSelectedShape,
} from "reduxes/annotation/action";
import {
  selectorDrawObject,
  selectorDrawObjectState,
  selectorSelectedDrawObjectId,
} from "reduxes/annotation/selector";
import { DrawType } from "reduxes/annotation/type";
import { selectorLabelClassPropertiesByLabelClass } from "reduxes/annotationmanager/selecetor";
import ClassLabel from "./ClassLabel";
import { getBackgroundColor } from "./ClassManageModal/useListClassView";
import { ClassItemProps } from "./type";

const renderIcon = (drawType: DrawType) => {
  if (drawType === DrawType.RECTANGLE) {
    return <Crop32Icon />;
  }
  if (drawType === DrawType.LINE_STRIP) {
    return <PolylineIcon />;
  }
  if (drawType === DrawType.ELLIPSE) {
    return <PanoramaFishEyeIcon />;
  }
  if (drawType === DrawType.POLYGON) {
    return <HexagonIcon />;
  }
  return <FolderIcon />;
};

function ClassItem({ style, id }: ClassItemProps) {
  const dispatch = useDispatch();

  const labelClassPropertiesByLabelClass = useSelector(
    selectorLabelClassPropertiesByLabelClass
  );
  const selectedDrawObjectId = useSelector(selectorSelectedDrawObjectId);
  const isSelect = useMemo(
    () => selectedDrawObjectId === id,
    [selectedDrawObjectId]
  );
  const drawObject = useSelector(selectorDrawObject(id));

  const handleClickDelete = () => {
    dispatch(deleteDrawObject({ drawObjectId: id }));
  };
  const handleSelect = () => {
    dispatch(setSelectedShape({ selectedDrawObjectId: id }));
  };

  const drawObjectState = useSelector(selectorDrawObjectState(id));
  const isDrawObjectHidden = useMemo(
    () => drawObjectState && drawObjectState.isHidden === true,
    [drawObjectState]
  );
  const isDrawObjectLock = useMemo(
    () => drawObjectState && drawObjectState.isLock === true,
    [drawObjectState]
  );
  const labelClassProperties =
    labelClassPropertiesByLabelClass[drawObject.data?.label?.label];
  const handleClickLock = (drawObjectId: string) => {
    dispatch(
      setLockDrawObject({
        drawObjectId,
        isLock: !isDrawObjectLock,
      })
    );
  };
  const handleClickHidden = () => {
    dispatch(
      setHiddenDrawObject({
        drawObjectId: id,
        isHidden: !isDrawObjectHidden,
      })
    );
  };
  const renderSecondaryAction = useCallback(
    () => (
      <Box display="flex">
        <IconButton edge="end" aria-label="delete" onClick={handleClickDelete}>
          <DeleteIcon />
        </IconButton>
        <IconButton edge="end" aria-label="hidden" onClick={handleClickHidden}>
          {isDrawObjectHidden === true ? (
            <VisibilityOffIcon />
          ) : (
            <VisibilityIcon />
          )}
        </IconButton>
        <IconButton
          edge="end"
          aria-label="lock"
          onClick={() => handleClickLock(id)}
        >
          {isDrawObjectHidden === true ? <LockIcon /> : <LockOpenIcon />}
        </IconButton>
      </Box>
    ),
    [isDrawObjectHidden]
  );
  const renderCss = useCallback(
    () => ({
      border: isSelect ? "1px solid" : "",
      cursor: "pointer",
    }),
    [isSelect]
  );
  const renderListAvatar = useCallback(
    () => (
      <ListItemAvatar>
        <Avatar
          sx={{
            backgroundColor: getBackgroundColor(labelClassProperties),
            width: 40,
            height: 40,
          }}
        >
          {renderIcon(drawObject.type)}
        </Avatar>
      </ListItemAvatar>
    ),
    [labelClassProperties, drawObject]
  );

  const renderContent = () => (
    <ListItem onSelect={() => handleSelect()} sx={renderCss()}>
      {renderListAvatar()}
      <Box flex={1}>
        <ClassLabel drawObject={drawObject} />
      </Box>

      {renderSecondaryAction()}
    </ListItem>
  );
  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      py={2}
      borderBottom="1px solid"
      borderColor="text.secondary"
      style={{ ...style }}
    >
      {renderContent()}
    </Box>
  );
}

export default ClassItem;
