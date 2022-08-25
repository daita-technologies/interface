import Crop32Icon from "@mui/icons-material/Crop32";
import DeleteIcon from "@mui/icons-material/Delete";
import FolderIcon from "@mui/icons-material/Folder";
import PanoramaFishEyeIcon from "@mui/icons-material/PanoramaFishEye";
import PolylineIcon from "@mui/icons-material/Polyline";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import { useDispatch, useSelector } from "react-redux";
import { deleteDrawObject, setSelectedShape } from "reduxes/annotation/action";
import {
  selectorDrawObjectById,
  selectorSelectedDrawObjectId,
} from "reduxes/annotation/selector";
import { DrawType } from "reduxes/annotation/type";
import { selectorLabelClassPropertiesByLabelClass } from "reduxes/annotationmanager/selecetor";
import ClassLabel from "./ClassLabel";

const LabelAnnotation = function () {
  const dispatch = useDispatch();
  const drawObjectById = useSelector(selectorDrawObjectById);
  const selectedDrawObjectId = useSelector(selectorSelectedDrawObjectId);
  const labelClassPropertiesByLabelClass = useSelector(
    selectorLabelClassPropertiesByLabelClass
  );
  const renderIcon = (drawType: DrawType) => {
    if (drawType === DrawType.RECTANGLE) {
      return <Crop32Icon />;
    } else if (drawType === DrawType.POLYGON) {
      return <PolylineIcon />;
    } else if (drawType === DrawType.ELLIPSE) {
      return <PanoramaFishEyeIcon />;
    }
    return <FolderIcon />;
  };
  const handleClickDelete = (id: string) => {
    dispatch(deleteDrawObject({ drawObjectId: id }));
  };
  const handleSelect = (id: string) => {
    dispatch(setSelectedShape({ selectedDrawObjectId: id }));
  };
  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 360,
        bgcolor: "background.paper",
      }}
    >
      <h3 style={{ padding: "0px 10px" }}>List Label</h3>
      <List>
        {Object.entries(drawObjectById).map(([id, drawObject]) => {
          const labelClassProperties =
            labelClassPropertiesByLabelClass[drawObject.data?.label?.label];
          return (
            <ListItem
              key={id}
              onSelect={() => handleSelect(id)}
              onClick={() => handleSelect(id)}
              secondaryAction={
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={() => handleClickDelete(id)}
                >
                  <DeleteIcon />
                </IconButton>
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
    </Box>
  );
};
export default LabelAnnotation;
