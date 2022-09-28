import { Add } from "@mui/icons-material";
import EditIcon from "@mui/icons-material/Edit";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Typography,
} from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { MyButton } from "components";
import {
  LabelAttribute,
  LabelClassProperties,
} from "components/Annotation/Editor/type";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  openEditDialogClassManageModal,
  setDialogClassManageModal,
} from "reduxes/annotationmanager/action";
import {
  selectorDialogClassManageModal,
  selectorLabelClassPropertiesByLabelClass,
} from "reduxes/annotationmanager/selecetor";
import { ClassManageDialogProps } from "./type";
const useListClassView = function (): ClassManageDialogProps {
  const dispatch = useDispatch();
  const labelClassPropertiesByLabelClass = useSelector(
    selectorLabelClassPropertiesByLabelClass
  );
  const handleNewClass = () => {
    dispatch(
      setDialogClassManageModal({
        isOpen: true,
        classManageModalType: "CREATE",
      })
    );
  };
  const editClass = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    label: LabelClassProperties
  ) => {
    dispatch(openEditDialogClassManageModal({ className: label.label.label }));
    e.stopPropagation();
    e.preventDefault();
  };
  const renderAttributeTable = (attributes: LabelAttribute[]) => (
    <Box display="flex" flexDirection="column" pl={2} gap={2}>
      <Box display="flex" alignItems="flex-end" flexDirection="column">
        <TableContainer>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>KEY</TableCell>
                <TableCell>VALUE</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {attributes.map((row) => (
                <TableRow
                  key={row.key}
                  sx={{
                    "&:last-child td, &:last-child th": {
                      border: 0,
                    },
                  }}
                >
                  <TableCell component="th" scope="row">
                    {row.key}
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {row.value}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
  const content = (
    <Box p={2}>
      <Box display="flex" flexDirection="column">
        {Object.entries(labelClassPropertiesByLabelClass).map(
          ([labelName, value]) => {
            const { label, cssStyle } = value;
            return (
              <Accordion key={labelName} elevation={5} expanded>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                >
                  <Box display="flex" alignItems="flex-end" width="100%">
                    <Box
                      sx={{
                        backgroundColor: cssStyle.stroke,
                        height: 30,
                        width: 30,
                        marginRight: 2,
                      }}
                    />
                    <Typography sx={{ width: "66%", flexShrink: 0 }}>
                      {label.label}
                    </Typography>
                    <Button
                      variant="outlined"
                      onClick={(e) => editClass(e, value)}
                      startIcon={<EditIcon />}
                    >
                      Edit
                    </Button>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  {label.attributes &&
                    label.attributes.length > 0 &&
                    renderAttributeTable(label.attributes)}
                </AccordionDetails>
              </Accordion>
            );
          }
        )}
      </Box>
    </Box>
  );

  return {
    title: "List class",
    content,
    action: (
      <Box display="flex" flexDirection="column" width="100%">
        <Box display="flex">
          <MyButton
            variant="contained"
            color="primary"
            onClick={handleNewClass}
            startIcon={<Add />}
          >
            New Class
          </MyButton>
        </Box>
      </Box>
    ),
  };
};
export default useListClassView;
