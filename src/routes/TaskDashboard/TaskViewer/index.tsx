import DeleteIcon from "@mui/icons-material/Delete";
import FilterListIcon from "@mui/icons-material/FilterList";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import { alpha } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Toolbar from "@mui/material/Toolbar";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { visuallyHidden } from "@mui/utils";
import LinearProgress, {
  LinearProgressProps,
} from "@mui/material/LinearProgress";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import * as React from "react";
import { ImageSourceType } from "reduxes/album/type";
import {
  ApiListProjectsItem,
  TaskInfoApiFields,
  TaskStatusType,
} from "reduxes/project/type";
import { TaskStatus } from "./type";
import { ListItemText, Menu, MenuItem } from "@mui/material";
import { CircularProgressWithLabel } from "components";

// interface Data {
//   calories: number;
//   carbs: number;
//   fat: number;
//   name: string;
//   protein: number;
// }
const getStatusType = (status: TaskStatusType): TaskStatus => {
  if (
    status === "PENDING" ||
    status === "PREPARING_HARDWARE" ||
    status === "PREPARING_DATA"
  ) {
    return "Preparing";
  }
  if (status === "RUNNING" || status === "UPLOADING") {
    return "Running";
  }
  if (status === "FINISH") {
    return "Done";
  }
  if (status === "FINISH_ERROR") {
    return "Done with warning";
  }
  if (status === "ERROR") {
    return "Error";
  }
  return "Error";
};
const getStyledStatus = (taskStatus: TaskStatus) => {
  if (taskStatus === "Preparing") return "warning";
  if (taskStatus === "Running") return "info";
  if (taskStatus === "Done") return "success";
  if (taskStatus === "Done with warning") return "warning";
  if (taskStatus === "Error") return "error";
};
function createData(
  identity_id: string,
  task_id: string,
  status: TaskStatusType,
  process_type: ImageSourceType,
  number_finished: number,
  project_id: string,
  number_gen_images: number
): TaskInfoApiFields {
  return {
    identity_id,
    task_id,
    status,
    process_type,
    number_finished,
    project_id,
    number_gen_images,
  };
}
// // {"data": {"identity_id": "us-east-2:23eeb335-20d0-4098-b344-9d34e4c5750d", "updated_time": "2022-03-18T10:47:18.461934", "task_id": "a111d83b-06da-4302-9365-b246ae82b17c", "status": "PREPARING_DATA", "IP": "", "process_type": "AUGMENT", "number_finished": 0, "EC2_ID": "", "project_id": "test_107dbb2002cd4374a81e62c5793a97f9", "number_gen_images": 1, "created_time": "2022-03-18T10:47:02.559150"}, "error": false, "success": true, "message": null}
const dataRows: TaskInfoApiFields[] = [
  createData(
    "us-east-2:23eeb335-20d0-4098-b344-9d34e4c5750d",
    "a111d83b-06da-4302-9365-b246ae82217c",
    "RUNNING",
    "AUGMENT",
    1,
    "test_107dbb2002cd4374a81e62c5793a97f9",
    3
  ),
  createData(
    "us-east-2:23eeb335-20d0-4098-b344-9d34e4c5750a",
    "a111d83b-06da-4302-9365-b246ae81b17c",
    "PREPARING_DATA",
    "AUGMENT",
    1,
    "test_107dbb2002cd4374a81e62c5793a97f9",
    2
  ),
  createData(
    "us-east-2:23eeb335-20d0-4098-b344-9d34e4c5751a",
    "a111d83b-06da-4302-9365-b246ae10b11c",
    "FINISH",
    "AUGMENT",
    1,
    "test2_0fab2ca9ddba40dd8281eabe51839b41",
    3
  ),
  createData(
    "us-east-2:23eeb335-20d0-4098-b344-9d34e4c5751a",
    "a111d83b-06da-4302-9365-b246ae10b11p",
    "FINISH",
    "PREPROCESS",
    1,
    "test2_0fab2ca9ddba40dd8281eabe51839b41",
    3
  ),
  createData(
    "us-east-2:23eeb335-20d0-4098-b344-9d34e4c5750d",
    "a111d83b-06da-4302-1265-b246ae82b31c",
    "ERROR",
    "PREPROCESS",
    3,
    "test_107dbb2002cd4374a81e62c5793a97f9",
    3
  ),
  createData(
    "us-east-2:23eeb335-20d0-4098-b344-9d34e4c5750d",
    "a111d83b-06da-4302-9365-b246ae82b11c",
    "PREPARING_HARDWARE",
    "PREPROCESS",
    2,
    "test_107dbb2002cd4374a81e62c5793a97f9",
    3
  ),
];
// const rows: Data[] = [
// createData("Donut", 452, 25.0, 51, 4.9),
// createData("Eclair", 262, 16.0, 24, 6.0),
// createData("Frozen yoghurt", 159, 6.0, 24, 4.0),
// createData("Gingerbread", 356, 16.0, 49, 3.9),
// createData("Honeycomb", 408, 3.2, 87, 6.5),
// createData("Ice cream sandwich", 237, 9.0, 37, 4.3),
// createData("Jelly Bean", 375, 0.0, 94, 0.0),
// createData("KitKat", 518, 26.0, 65, 7.0),
// createData("Lollipop", 392, 0.2, 98, 0.0),
// createData("Marshmallow", 318, 0, 81, 2.0),
// createData("Nougat", 360, 19.0, 9, 37.0),
// createData("Oreo", 437, 18.0, 63, 4.0),
// ];

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

type Order = "asc" | "desc";

function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key
): (
  a: { [key in Key]: number | string },
  b: { [key in Key]: number | string }
) => number {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

// This method is created for cross-browser compatibility, if you don't
// need to support IE11, you can use Array.prototype.sort() directly
function stableSort<T>(
  array: readonly T[],
  comparator: (a: T, b: T) => number
) {
  const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

interface HeadCell {
  disablePadding: boolean;
  id: keyof TaskInfoApiFields;
  label: string;
  align: "left" | "center" | "right";
}

const headCells: readonly HeadCell[] = [
  {
    id: "task_id",
    align: "left",
    disablePadding: false,
    label: "Task ID",
  },
  {
    id: "project_id",
    align: "right",
    disablePadding: false,
    label: "Project Name",
  },
  {
    id: "number_gen_images",
    align: "right",
    disablePadding: false,
    label: "Process",
  },
  {
    id: "status",
    align: "right",
    disablePadding: false,
    label: "Status",
  },
];

interface EnhancedTableProps {
  onRequestSort: (
    event: React.MouseEvent<unknown>,
    property: keyof TaskInfoApiFields
  ) => void;
  order: Order;
  orderBy: string;
}
const getProcessColor = (value: number): string => {
  if (value <= 10) {
    return "error.dark";
  }
  if (value <= 20) {
    return "error";
  }
  if (value <= 30) {
    return "error.light";
  }
  if (value <= 40) {
    return "warning.dark";
  }
  if (value <= 50) {
    return "warning";
  }
  if (value <= 60) {
    return "warning.light";
  }
  if (value <= 70) {
    return "success.light";
  }
  if (value <= 80) {
    return "success";
  }
  return "success.dark";
};
function EnhancedTableHead(props: EnhancedTableProps) {
  const { order, orderBy, onRequestSort } = props;
  const createSortHandler =
    (property: keyof TaskInfoApiFields) =>
    (event: React.MouseEvent<unknown>) => {
      onRequestSort(event, property);
    };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.align}
            padding={headCell.disablePadding ? "none" : "normal"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
        <TableCell align="right">Actions</TableCell>
      </TableRow>
    </TableHead>
  );
}

interface EnhancedTableToolbarProps {
  numSelected: number;
  tableName: string;
}

function TableAction({ row }: { row: TaskInfoApiFields }) {
  const [open, setOpen] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleStopActionClick = () => {
    console.log("Stop", row);
    setAnchorEl(null);
    setOpen(false);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    setOpen(true);
  };
  return (
    <>
      <IconButton className="dot-option-symbol" onClick={handleClick}>
        <MoreVertIcon />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <MenuItem onClick={handleStopActionClick}>
          <ListItemText>Stop</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
}
function EnhancedTableToolbar(props: EnhancedTableToolbarProps) {
  const { numSelected, tableName } = props;
  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(
              theme.palette.primary.main,
              theme.palette.action.activatedOpacity
            ),
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography
          sx={{ flex: "1 1 100%" }}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} selected
        </Typography>
      ) : (
        <Typography
          sx={{ flex: "1 1 100%" }}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          {tableName}
        </Typography>
      )}
      {numSelected > 0 && (
        <Tooltip title="Delete">
          <IconButton>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  );
}

const TaskViewer = function ({
  projectName,
  imageSourceType,
  listProject,
}: {
  projectName?: string;
  imageSourceType: ImageSourceType;
  listProject: ApiListProjectsItem[];
}) {
  const [order, setOrder] = React.useState<Order>("asc");
  const [orderBy, setOrderBy] =
    React.useState<keyof TaskInfoApiFields>("identity_id");
  const [selected, setSelected] = React.useState<readonly string[]>([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof TaskInfoApiFields
  ) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };
  const mIdProjects = new Map(
    listProject.map(
      (project) =>
        [project.project_id, project] as [string, ApiListProjectsItem]
    )
  );
  let rowsTmp = dataRows;
  if (projectName) {
    const project = listProject.find((t) => t.project_name === projectName);
    rowsTmp = dataRows.filter((t) => t.project_id === project?.project_id);
  }
  rowsTmp = rowsTmp.filter((t) => imageSourceType === t.process_type);
  const [rows, setRows] = React.useState(rowsTmp);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const isSelected = (name: string) => selected.indexOf(name) !== -1;

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;
  return (
    <Box sx={{ width: "100%" }}>
      <Paper sx={{ width: "100%", mt: 2, mb: 5 }}>
        <EnhancedTableToolbar
          tableName={
            imageSourceType === "PREPROCESS" ? "Preprocessing" : "Augmentation"
          }
          numSelected={selected.length}
        />
        <TableContainer sx={{ padding: "0px 10px" }}>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size="medium"
          >
            <EnhancedTableHead
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
            />
            <TableBody>
              {/* if you don't need to support IE11, you can replace the `stableSort` call with:
              rows.slice().sort(getComparator(order, orderBy)) */}
              {stableSort(rows, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => {
                  const isItemSelected = isSelected(row.task_id);
                  return (
                    <TableRow
                      hover
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row.task_id}
                    >
                      <TableCell align="left">{row.task_id}</TableCell>
                      <TableCell align="right">
                        {mIdProjects.get(row.project_id)?.project_name}
                      </TableCell>

                      <TableCell align="right">
                        {/* <LinearProgressWithLabel
                          value={
                            (row.number_finished * 100) / row.number_gen_images
                          }
                        /> */}
                        <CircularProgressWithLabel
                          sx={{
                            // backgroundColor: "",
                            "& 	.MuiCircularProgress-colorPrimary": {
                              backgroundColor: getProcessColor(
                                (row.number_finished * 100) /
                                  row.number_gen_images
                              ),
                            },
                          }}
                          value={
                            (row.number_finished * 100) / row.number_gen_images
                          }
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Typography
                          variant="body2"
                          color={`${getStyledStatus(
                            getStatusType(row.status)
                          )}.dark`}
                          // color="success.first = (second) => {third}"
                        >
                          {getStatusType(row.status)}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <TableAction row={row} />
                      </TableCell>
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: 53 * emptyRows,
                  }}
                >
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  );
};
export default TaskViewer;
