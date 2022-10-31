import AddIcon from "@mui/icons-material/Add";
import { Button } from "@mui/material";
import Box from "@mui/material/Box";
import { LabelClassProperties } from "components/Annotation/Editor/type";
import { CSSProperties, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AutoSizer } from "react-virtualized";
import { FixedSizeList } from "react-window";
import {
  selectorDrawObjectById,
  selectorDrawObjectStateIdByAI,
} from "reduxes/annotation/selector";
import { setDialogClassManageModal } from "reduxes/annotationmanager/action";
import { selectorDialogClassManageModal } from "reduxes/annotationmanager/selecetor";
import ClassItem from "./ClassItem";
import { convertStrokeColorToFillColor } from "./ClassLabel";
import ClassManageModel from "./ClassManageModal";

export const hashCode = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return hash;
};

export const intToRGB = (i: number) => {
  const c = (i & 0x00ffffff).toString(16).toUpperCase();
  return "00000".substring(0, 6 - c.length) + c;
};
export const getBackgroundColor = (
  labelClassProperties: LabelClassProperties
) => {
  if (labelClassProperties) {
    if (labelClassProperties?.cssStyle?.stroke) {
      return labelClassProperties.cssStyle.stroke;
    }
    if (labelClassProperties.label?.label) {
      return convertStrokeColorToFillColor(
        "#" + intToRGB(hashCode(labelClassProperties.label.label))
      );
    }
  }
  return "gray";
};
const LabelAnnotation = function () {
  const dispatch = useDispatch();
  const drawObjectById = useSelector(selectorDrawObjectById);
  const drawObjectStateIdByAI = useSelector(selectorDrawObjectStateIdByAI);

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
    Object.keys(drawObjectById).map((id) => {
      if (!drawObjectStateIdByAI.includes(id)) {
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
    return <></>;
  }
  const renderList = () => {
    return (
      <Box sx={{ overflowY: "auto" }} height={700}>
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
      {renderList()}
      {dialogClassManageModal.isOpen && <ClassManageModel />}
    </Box>
  );
};
export default LabelAnnotation;
