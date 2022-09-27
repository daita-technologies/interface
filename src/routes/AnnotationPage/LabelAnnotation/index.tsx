import AddIcon from "@mui/icons-material/Add";
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
import { Button } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteDrawObject,
  setHiddenDrawObject,
  setLockDrawObject,
  setSelectedShape,
} from "reduxes/annotation/action";
import {
  selectorDrawObjectById,
  selectorListDrawObjectHidden,
  selectorListDrawObjectLock,
  selectorSelectedDrawObjectId,
} from "reduxes/annotation/selector";
import { DrawType } from "reduxes/annotation/type";
import { setDialogClassManageModal } from "reduxes/annotationmanager/action";
import {
  selectorDialogClassManageModal,
  selectorLabelClassPropertiesByLabelClass,
} from "reduxes/annotationmanager/selecetor";
import ClassLabel from "./ClassLabel";
import ClassManageModel from "./ClassManageModal";

const LabelAnnotation = function () {
  const dispatch = useDispatch();
  const drawObjectById = useSelector(selectorDrawObjectById);
  const selectedDrawObjectId = useSelector(selectorSelectedDrawObjectId);
  const labelClassPropertiesByLabelClass = useSelector(
    selectorLabelClassPropertiesByLabelClass
  );
  const listDrawObjectLock = useSelector(selectorListDrawObjectLock);
  const listDrawObjectHidden = useSelector(selectorListDrawObjectHidden);

  const renderIcon = (drawType: DrawType) => {
    if (drawType === DrawType.RECTANGLE) {
      return <Crop32Icon />;
    } else if (drawType === DrawType.LINE_STRIP) {
      return <PolylineIcon />;
    } else if (drawType === DrawType.ELLIPSE) {
      return <PanoramaFishEyeIcon />;
    } else if (drawType === DrawType.POLYGON) {
      return <HexagonIcon />;
    }
    return <FolderIcon />;
  };
  const handleClickDelete = (id: string) => {
    dispatch(deleteDrawObject({ drawObjectId: id }));
  };
  const handleSelect = (id: string) => {
    dispatch(setSelectedShape({ selectedDrawObjectId: id }));
  };
  const handleClickLock = (id: string) => {
    dispatch(
      setLockDrawObject({
        drawObjectId: id,
        isLock: listDrawObjectLock.indexOf(id) !== -1 ? false : true,
      })
    );
  };

  const handleClickHidden = (id: string) => {
    dispatch(
      setHiddenDrawObject({
        drawObjectId: id,
        isHidden: listDrawObjectHidden.indexOf(id) !== -1 ? false : true,
      })
    );
  };
  const hanleOpenClassManageModalClick = () => {
    dispatch(
      setDialogClassManageModal({
        isOpen: true,
        classManageModalType: "VIEW",
      })
    );
  };
  const dialogClassManageModal = useSelector(selectorDialogClassManageModal);

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 360,
        bgcolor: "background.paper",
      }}
    >
      <Box style={{ padding: "0px 10px" }} display="flex" gap={1}>
        <Box>
          <h3>List Label</h3>
        </Box>
        <Box sx={{ lineHeight: "55px" }}>
          <Button
            variant="outlined"
            color="inherit"
            size="small"
            startIcon={<AddIcon />}
            onClick={hanleOpenClassManageModalClick}
          >
            Add a class
          </Button>
        </Box>
      </Box>
      <List
        sx={{
          width: "100%",
          maxWidth: 360,
          bgcolor: "background.paper",
          position: "relative",
          overflow: "auto",
          height: "100%",
          maxHeight: 100,
          "& ul": { padding: 0 },
        }}
      >
        {Object.entries(drawObjectById).map(([id, drawObject]) => {
          const labelClassProperties =
            labelClassPropertiesByLabelClass[drawObject.data?.label?.label];
          return (
            <ListItem
              key={id}
              onSelect={() => handleSelect(id)}
              onClick={() => handleSelect(id)}
              secondaryAction={
                <Box display="flex">
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => handleClickDelete(id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                  <IconButton
                    edge="end"
                    aria-label="hidden"
                    onClick={() => handleClickHidden(id)}
                  >
                    {listDrawObjectHidden.indexOf(id) !== -1 ? (
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
                    {listDrawObjectLock.indexOf(id) !== -1 ? (
                      <LockIcon />
                    ) : (
                      <LockOpenIcon />
                    )}
                  </IconButton>
                </Box>
              }
              sx={{
                border: selectedDrawObjectId === id ? "1px solid" : "",
                cursor: "pointer",
              }}
            >
              <ListItemAvatar>
                <Avatar
                  sx={{
                    backgroundColor: labelClassProperties?.cssStyle?.stroke
                      ? labelClassProperties.cssStyle.stroke
                      : "gray",
                    width: 40,
                    height: 40,
                  }}
                >
                  {renderIcon(drawObject.type)}
                </Avatar>
              </ListItemAvatar>
              <ListItemText>
                <ClassLabel drawObject={drawObject} />
              </ListItemText>
            </ListItem>
          );
        })}
      </List>
      {dialogClassManageModal.isOpen && <ClassManageModel />}
    </Box>
  );
};
export default LabelAnnotation;
