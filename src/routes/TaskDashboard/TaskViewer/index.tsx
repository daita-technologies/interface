// import DeleteIcon from "@mui/icons-material/Delete";
// import MoreVertIcon from "@mui/icons-material/MoreVert";
import {
  Autocomplete,
  // CircularProgress,
  LinearProgress,
  // ListItemText,
  // Menu,
  // MenuItem,
  TextField,
} from "@mui/material";
import Box from "@mui/material/Box";
// import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
// import { alpha } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
// import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
// import TableSortLabel from "@mui/material/TableSortLabel";
import Toolbar from "@mui/material/Toolbar";
// import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { Empty } from "components";
import {
  ERROR_TASK_STATUS,
  FINISH_TASK_STATUS,
  RUNNING_TASK_STATUS,
  TASK_STATUS_MERGED_ARRAY,
} from "constants/defaultValues";
import { TaskStatusMergedType } from "constants/taskType";
// import { visuallyHidden } from "@mui/utils";
// import { CircularProgressWithLabel } from "components";
import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "reduxes";

import {
  TaskInfoApiFields,
  // TaskStatusType
} from "reduxes/project/type";
import { filterTaskListInfo } from "reduxes/task/action";
import { selectorSpecificProcessTypeTaskInfo } from "reduxes/task/selector";
// import { TaskItemApiFields } from "services/taskApi";
import { limitTwoLineStyle } from "styles/generalStyle";
import { getTaskStatusMergedValue, mapProcessTypeToName } from "utils/task";
import {
  EnhancedTableToolbarProps,
  HeadCell,
  TableFilterOption,
  TableFilterProps,
  TableFilterType,
  // TaskStatus,
  TaskViewerProps,
} from "./type";

const getStyledStatus = (taskStatus: TaskStatusMergedType) => {
  switch (taskStatus) {
    case FINISH_TASK_STATUS:
      return "success";
    case ERROR_TASK_STATUS:
      return "error";
    case RUNNING_TASK_STATUS:
    default:
      return "info";
  }
};

// function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
//   if (b[orderBy] < a[orderBy]) {
//     return -1;
//   }
//   if (b[orderBy] > a[orderBy]) {
//     return 1;
//   }
//   return 0;
// }

// type Order = "asc" | "desc";

// function getComparator<Key extends keyof any>(
//   order: Order,
//   orderBy: Key
// ): (
//   a: { [key in Key]: number | string },
//   b: { [key in Key]: number | string }
// ) => number {
//   return order === "desc"
//     ? (a, b) => descendingComparator(a, b, orderBy)
//     : (a, b) => -descendingComparator(a, b, orderBy);
// }

// This method is created for cross-browser compatibility, if you don't
// need to support IE11, you can use Array.prototype.sort() directly
// function stableSort<T>(
//   array: readonly T[],
//   comparator: (a: T, b: T) => number
// ) {
//   const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
//   stabilizedThis.sort((a, b) => {
//     const order = comparator(a[0], b[0]);
//     if (order !== 0) {
//       return order;
//     }
//     return a[1] - b[1];
//   });
//   return stabilizedThis.map((el) => el[0]);
// }

const headCells: readonly HeadCell[] = [
  {
    id: "task_id",
    align: "left",
    disablePadding: false,
    label: "Task ID",
  },
  {
    id: "project_id",
    align: "left",
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
    align: "center",
    disablePadding: false,
    label: "Status",
  },
];

// interface EnhancedTableProps {
//   onRequestSort: (
//     event: React.MouseEvent<unknown>,
//     property: keyof TaskInfoApiFields
//   ) => void;
//   order: Order;
//   orderBy: string;
// }

// const getProcessColor = (value: number): string => {
//   if (value <= 10) {
//     return "error.dark";
//   }
//   if (value <= 20) {
//     return "error";
//   }
//   if (value <= 30) {
//     return "error.light";
//   }
//   if (value <= 40) {
//     return "warning.dark";
//   }
//   if (value <= 50) {
//     return "warning";
//   }
//   if (value <= 60) {
//     return "warning.light";
//   }
//   if (value <= 70) {
//     return "success.light";
//   }
//   if (value <= 80) {
//     return "success";
//   }
//   return "success.dark";
// };

function EnhancedTableHead() {
  // props: EnhancedTableProps
  // const { order, orderBy, onRequestSort } = props;
  // const createSortHandler =
  //   (property: keyof TaskInfoApiFields) =>
  //   (event: React.MouseEvent<unknown>) => {
  //     onRequestSort(event, property);
  //   };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.align}
            padding={headCell.disablePadding ? "none" : "normal"}
            // sortDirection={orderBy === headCell.id ? order : false}
          >
            {/* <TableSortLabel
            active={orderBy === headCell.id}
            direction={orderBy === headCell.id ? order : "asc"}
            onClick={createSortHandler(headCell.id)}
            > */}
            {headCell.label}
            {/* {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </Box>
              ) : null} */}
            {/* </TableSortLabel> */}
          </TableCell>
        ))}
        <TableCell align="right">Actions</TableCell>
      </TableRow>
    </TableHead>
  );
}

// function TableAction({ taskInfo }: { taskInfo: TaskItemApiFields }) {
//   const [open, setOpen] = React.useState(false);
//   const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

//   const handleStopActionClick = () => {
//     setAnchorEl(null);
//     setOpen(false);
//   };
//   const handleClose = () => {
//     setOpen(false);
//   };
//   const handleClick = (event: React.MouseEvent<HTMLElement>) => {
//     setAnchorEl(event.currentTarget);
//     setOpen(true);
//   };
//   return (
//     <>
//       <IconButton className="dot-option-symbol" onClick={handleClick}>
//         <MoreVertIcon />
//       </IconButton>
//       <Menu
//         anchorEl={anchorEl}
//         open={open}
//         onClose={handleClose}
//         anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
//         transformOrigin={{ vertical: "top", horizontal: "right" }}
//       >
//         <MenuItem onClick={handleStopActionClick}>
//           <ListItemText>Stop</ListItemText>
//         </MenuItem>
//       </Menu>
//     </>
//   );
// }

function EnhancedTableToolbar(props: EnhancedTableToolbarProps) {
  const {
    // numSelected,
    tableName,
  } = props;
  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        // ...(numSelected > 0 && {
        //   bgcolor: (theme) =>
        //     alpha(
        //       theme.palette.primary.main,
        //       theme.palette.action.activatedOpacity
        //     ),
        // }),
      }}
    >
      {/* {numSelected > 0 ? (
        <Typography
          sx={{ flex: "1 1 100%" }}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} selected
        </Typography>
      ) : ( */}
      <Typography
        sx={{ flex: "1 1 100%" }}
        variant="h6"
        id="tableTitle"
        component="div"
      >
        {tableName}
      </Typography>
      {/* )} */}
      {/* {numSelected > 0 && (
        <Tooltip title="Delete">
          <IconButton>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      )} */}
    </Toolbar>
  );
}

function TableFilter(props: TableFilterProps) {
  const { filters, onChange } = props;
  const handleOnChange = (
    key: keyof TaskInfoApiFields,
    value: string | null
  ) => {
    onChange({ key, value });
  };
  return (
    <>
      {filters.map((t) => (
        <Box key={t.label} pt={1} pb={3}>
          <Autocomplete
            disablePortal
            // id="combo-box-demo"
            options={t.options}
            sx={{ width: 300 }}
            onChange={(e, value) => {
              handleOnChange(t.key, value);
            }}
            renderInput={(params) => (
              <TextField {...params} label={t.label} size="small" />
            )}
          />
        </Box>
      ))}
    </>
  );
}

const TaskViewer = function ({ taskProcessType }: TaskViewerProps) {
  // const [order, setOrder] = React.useState<Order>("asc");
  // const [orderBy, setOrderBy] =
  //   React.useState<keyof TaskInfoApiFields>("identity_id");
  // const [selected, setSelected] = React.useState<readonly string[]>([]);
  // const [page, setPage] = React.useState(0);
  // const [rowsPerPage, setRowsPerPage] = React.useState(5);
  // const [filters, setFilters] = React.useState<TableFilterType[]>([]);
  const dispatch = useDispatch();
  const taskInfoOfCurrentProcessType = useSelector((state: RootState) =>
    selectorSpecificProcessTypeTaskInfo(taskProcessType, state)
  );

  const { taskListInfo } = taskInfoOfCurrentProcessType;

  const { ls_task, ls_page_token } = taskListInfo;

  // const handleRequestSort = (
  //   event: React.MouseEvent<unknown>,
  //   property: keyof TaskInfoApiFields
  // ) => {
  //   const isAsc = orderBy === property && order === "asc";
  //   setOrder(isAsc ? "desc" : "asc");
  //   setOrderBy(property);
  // };
  // const mIdProjects = new Map(
  //   listProject.map(
  //     (project) =>
  //       [project.project_id, project] as [string, ApiListProjectsItem]
  //   )
  // );

  // const handleChangePage = (event: unknown, newPage: number) => {
  //   setPage(newPage);
  // };

  // const handleChangeRowsPerPage = (
  //   event: React.ChangeEvent<HTMLInputElement>
  // ) => {
  //   setRowsPerPage(parseInt(event.target.value, 10));
  //   setPage(0);
  // };

  // const isSelected = (name: string) => selected.indexOf(name) !== -1;
  const tableFilterOptions: TableFilterOption[] = [
    {
      label: "Status",
      key: "status",
      options: TASK_STATUS_MERGED_ARRAY,
    },
  ];
  const handleFilter = (tableFilterType: TableFilterType) => {
    if (tableFilterType.value) {
      // dispatch(
      //   filterTaskListInfo({
      //     filter: {
      //       statusQuery: [tableFilterType.value],
      //     },
      //   })
      // );
    }
  };
  // const handleFilter = (tableFilterType: TableFilterType) => {
  //   const { key, value } = tableFilterType;
  //   const indexOf = filters.findIndex((t) => t.key === key);
  //   if (value == null) {
  //     if (indexOf !== -1) {
  //       filters.splice(indexOf, 1);
  //     }
  //   } else if (indexOf === -1) {
  //     filters.push(tableFilterType);
  //   } else {
  //     filters[indexOf] = tableFilterType;
  //   }
  //   setFilters([...filters]);
  // };
  // useEffect(() => {
  //   //
  // }, [filters]);
  // const emptyRows =
  //   page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;
  return (
    <Box sx={{ width: "100%" }}>
      <Paper sx={{ width: "100%", mt: 2, mb: 5 }}>
        <EnhancedTableToolbar
          tableName={mapProcessTypeToName(taskProcessType)}
          // numSelected={selected.length}
        />
        <TableContainer sx={{ padding: "0px 10px", pb: 4 }}>
          {/* <Box display="flex" justifyContent="flex-end">
            <TableFilter filters={tableFilterOptions} onChange={handleFilter} />
          </Box> */}

          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size="medium"
          >
            <EnhancedTableHead
            // order={order}
            // orderBy={orderBy}
            // onRequestSort={handleRequestSort}
            />
            <TableBody>
              {ls_task.length > 0 ? (
                ls_task.map((taskInfo) => {
                  const { task_id, project_id, status } = taskInfo;
                  return (
                    <TableRow
                      hover
                      role="checkbox"
                      // aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={task_id}
                    >
                      <TableCell align="left">
                        <Typography
                          sx={limitTwoLineStyle}
                          component="span"
                          variant="body2"
                        >
                          {task_id}
                        </Typography>
                      </TableCell>
                      <TableCell align="left">
                        <Typography
                          sx={limitTwoLineStyle}
                          component="span"
                          variant="body2"
                        >
                          {project_id}
                        </Typography>
                      </TableCell>

                      <TableCell align="right">
                        {getTaskStatusMergedValue(status) ===
                          RUNNING_TASK_STATUS && <LinearProgress />}
                        {/* <LinearProgressWithLabel
                          value={
                            (row.number_finished * 100) / row.number_gen_images
                          }
                        /> */}
                        {/* <CircularProgressWithLabel
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
                      /> */}
                      </TableCell>
                      <TableCell align="center">
                        <Typography
                          variant="body2"
                          color={`${getStyledStatus(
                            getTaskStatusMergedValue(status)
                          )}.dark`}
                          // color="success.first = (second) => {third}"
                        >
                          {getTaskStatusMergedValue(status)}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        {/* <TableAction taskInfo={taskInfo} /> */}
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={5}>
                    <Empty />
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        {/* <TablePagination
          // rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={2}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        /> */}
      </Paper>
    </Box>
  );
};
export default TaskViewer;
