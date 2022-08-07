import Crop32Icon from "@mui/icons-material/Crop32";
import DeleteIcon from "@mui/icons-material/Delete";
import FolderIcon from "@mui/icons-material/Folder";
import PanoramaFishEyeIcon from "@mui/icons-material/PanoramaFishEye";
import PolylineIcon from "@mui/icons-material/Polyline";
import { TextField } from "@mui/material";
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
  setSelectedShape,
  updateLabelOfDrawObject,
} from "reduxes/annotation/action";
import {
  selectorDrawObjectById,
  selectorSelectedDrawObjectId,
} from "reduxes/annotation/selector";
import { DrawType } from "reduxes/annotation/type";

const LabelAnnotation = function () {
  const dispatch = useDispatch();
  const drawObjectById = useSelector(selectorDrawObjectById);
  const selectedDrawObjectId = useSelector(selectorSelectedDrawObjectId);
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
  const handleChangeLabel = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    drawObjectId: string
  ) => {
    dispatch(
      updateLabelOfDrawObject({
        drawObjectId,
        label: { label: event.target.value },
      })
    );
  };
  const handleSelect = (id: string) => {
    dispatch(setSelectedShape({ selectedDrawObjectId: id }));
  };
  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 360,
        padding: "10px 15px",
        bgcolor: "background.paper",
      }}
    >
      <h3>List Label</h3>
      <List>
        {Object.entries(drawObjectById).map(([id, drawObjet]) => {
          return (
            <ListItem
              key={id}
              onSelect={() => handleSelect(id)}
              secondaryAction={
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={() => handleClickDelete(id)}
                >
                  <DeleteIcon />
                </IconButton>
              }
              sx={{ border: selectedDrawObjectId === id ? "1px solid" : "" }}
            >
              <ListItemAvatar>
                <Avatar sx={{ backgroundColor: "gray" }}>
                  {renderIcon(drawObjet.type)}
                </Avatar>
              </ListItemAvatar>
              <ListItemText>
                <TextField
                  id="label"
                  label="Label"
                  variant="standard"
                  defaultValue={drawObjet.data.label.label}
                  onChange={(e) => handleChangeLabel(e, id)}
                />
              </ListItemText>
            </ListItem>
          );
        })}
      </List>
    </Box>
  );
};
export default LabelAnnotation;
