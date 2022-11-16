import AddIcon from "@mui/icons-material/Add";
import { Button, CircularProgress } from "@mui/material";
import Box from "@mui/material/Box";
import { CSSProperties, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AutoSizer } from "react-virtualized";
import { FixedSizeList } from "react-window";
import {
  selectorDrawObjectById,
  selectorDrawObjectStateIdByAI,
} from "reduxes/annotation/selector";
import { setDialogClassManageModal } from "reduxes/annotationmanager/action";
import {
  selectorDialogClassManageModal,
  selectorIsFetchingImageData,
} from "reduxes/annotationmanager/selecetor";
import ClassItem from "./ClassItem";
import ClassManageModel from "./ClassManageModal";

function LabelAnnotation() {
  const dispatch = useDispatch();
  const drawObjectById = useSelector(selectorDrawObjectById);
  const drawObjectStateIdByAI = useSelector(selectorDrawObjectStateIdByAI);
  const issFetchingImageData = useSelector(selectorIsFetchingImageData);
  const hanleOpenClassManageModalClick = () => {
    dispatch(
      setDialogClassManageModal({
        isOpen: true,
        classManageModalType: "VIEW",
      })
    );
  };
  const dialogClassManageModal = useSelector(selectorDialogClassManageModal);
  const listIdsDrawObjectById = useMemo(() => {
    const retList: string[] = [];
    Object.keys(drawObjectById).forEach((id) => {
      if (
        !drawObjectStateIdByAI[id] ||
        drawObjectStateIdByAI[id].isShow === true
      ) {
        retList.push(id);
      }
    });
    return retList.sort();
  }, [drawObjectById, drawObjectStateIdByAI]);
  // eslint-disable-next-line react/no-unstable-nested-components
  function Row({ index, style }: { index: number; style: CSSProperties }) {
    if (listIdsDrawObjectById[index]) {
      return <ClassItem style={style} id={listIdsDrawObjectById[index]} />;
    }
    return null;
  }

  const renderList = () => {
    if (issFetchingImageData) {
      return (
        <Box display="flex" justifyContent="center" height={640}>
          <CircularProgress size={20} />
        </Box>
      );
    }
    return (
      <Box sx={{ overflowY: "auto" }} height={640}>
        <AutoSizer>
          {({ height, width }) => (
            <FixedSizeList
              className="List"
              height={height}
              width={width}
              itemCount={Object.keys(drawObjectById).length}
              itemSize={70}
            >
              {Row}
            </FixedSizeList>
          )}
        </AutoSizer>
      </Box>
    );
  };
  return (
    <Box
      display="flex"
      flexDirection="column"
      sx={{
        width: "100%",
        maxWidth: 360,
        height: "100%",
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
      <Box bgcolor="background.paper">{renderList()}</Box>
      {dialogClassManageModal.isOpen && <ClassManageModel />}
    </Box>
  );
}
export default LabelAnnotation;
