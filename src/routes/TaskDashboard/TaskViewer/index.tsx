// import DeleteIcon from "@mui/icons-material/Delete";

import { CircularProgress } from "@mui/material";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
// import { alpha } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
// import TableSortLabel from "@mui/material/TableSortLabel";
import Toolbar from "@mui/material/Toolbar";
// import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { Empty } from "components";
import { useMemo } from "react";
// import { visuallyHidden } from "@mui/utils";
// import { CircularProgressWithLabel } from "components";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "reduxes";
import { selectorListProjects } from "reduxes/project/selector";
import // TaskInfoApiFields,

// TaskStatusType
"reduxes/project/type";
import {
  changePageTaskListInfo,
  filterTaskListInfo,
} from "reduxes/task/action";
import { TASK_LIST_PAGE_SIZE } from "reduxes/task/constants";
import {
  selectorSpecificProcessCurrentPage,
  selectorSpecificProcessFilter,
  selectorSpecificProcessIsLoading,
  selectorSpecificProcessTypeTaskInfo,
} from "reduxes/task/selector";
import { mapProcessTypeToName } from "utils/task";
import TaskStatusFilter from "./TaskStatusFilter";
import { TaskStatusFilterOption } from "./TaskStatusFilter/type";
import TaskTableRow from "./TaskTableRow";
import {
  EnhancedTableToolbarProps,
  HeadCell,
  // TaskStatus,
  TaskViewerProps,
} from "./type";

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
  // {
  //   id: "task_id",
  //   align: "left",
  //   disablePadding: false,
  //   label: "Task ID",
  // },
  {
    id: "project_id",
    align: "left",
    disablePadding: false,
    label: "Project Name",
    width: "30%",
  },
  {
    id: "created_time",
    align: "left",
    disablePadding: false,
    label: "Created",
    width: "30%",
  },
  {
    id: "",
    align: "center",
    disablePadding: false,
    label: "Process",
    width: "14%",
  },
  {
    id: "status",
    align: "center",
    disablePadding: false,
    label: "Status",
    width: "14%",
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
            width={headCell.width}
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
        <TableCell align="right" width="12%">
          Actions
        </TableCell>
      </TableRow>
    </TableHead>
  );
}

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

const TaskViewer = function ({ projectId, taskProcessType }: TaskViewerProps) {
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
  const listProject = useSelector(selectorListProjects);

  const isTableLoading = useSelector((state: RootState) =>
    selectorSpecificProcessIsLoading(taskProcessType, state)
  );

  const currentPage = useSelector((state: RootState) =>
    selectorSpecificProcessCurrentPage(taskProcessType, state)
  );

  const currentFilter = useSelector((state: RootState) =>
    selectorSpecificProcessFilter(taskProcessType, state)
  );

  if (taskInfoOfCurrentProcessType) {
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

    const handleChangePage = (event: unknown, targetPage: number) => {
      dispatch(
        changePageTaskListInfo({
          filter: currentFilter,
          processType: taskProcessType,
          targetPage,
        })
      );
    };

    // const handleChangeRowsPerPage = (
    //   event: React.ChangeEvent<HTMLInputElement>
    // ) => {
    //   setRowsPerPage(parseInt(event.target.value, 10));
    //   setPage(0);
    // };

    // const isSelected = (name: string) => selected.indexOf(name) !== -1;

    const handleFilter = (targetStatusFilter: TaskStatusFilterOption) => {
      if (targetStatusFilter) {
        dispatch(
          filterTaskListInfo({
            projectId,
            statusQuery: [targetStatusFilter.value],
            processType: [taskProcessType],
          })
        );
      }
    };

    const renderTableBody = () => {
      if (isTableLoading) {
        return (
          <TableRow>
            <TableCell colSpan={5}>
              <Box textAlign="center" py={2}>
                <CircularProgress size={30} />
              </Box>
            </TableCell>
          </TableRow>
        );
      }

      if (ls_task.length > 0) {
        return (
          <>
            {ls_task.map((taskInfo) => {
              const { task_id, status, number_finished, process_type } =
                taskInfo;

              return (
                <TaskTableRow
                  key={`${task_id}-${status}-${
                    typeof number_finished !== "undefined"
                      ? number_finished
                      : ""
                  }`}
                  taskId={task_id}
                  processType={process_type}
                  listProject={listProject}
                />
              );
            })}
          </>
        );
      }
      return (
        <TableRow>
          <TableCell colSpan={5}>
            <Empty />
          </TableCell>
        </TableRow>
      );
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
    const maxPage = useMemo(
      () => (ls_page_token.length >= 0 ? ls_page_token.length + 1 : 0),
      [ls_page_token]
    );
    return (
      <Box sx={{ width: "100%" }}>
        <Paper sx={{ width: "100%", mt: 2, mb: 5 }}>
          <EnhancedTableToolbar
            tableName={mapProcessTypeToName(taskProcessType)}
            // numSelected={selected.length}
          />
          <TableContainer sx={{ padding: "0px 10px", pb: 4 }}>
            <Box display="flex" justifyContent="flex-end">
              <TaskStatusFilter onChange={handleFilter} />
            </Box>

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
              <TableBody>{renderTableBody()}</TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[]}
            component="div"
            count={-1}
            rowsPerPage={TASK_LIST_PAGE_SIZE}
            page={Number(currentPage) || 0}
            onPageChange={handleChangePage}
            nextIconButtonProps={{
              disabled: Number(currentPage) + 1 >= maxPage,
            }}
            labelDisplayedRows={({ page }) => `Page ${page + 1}/${maxPage}`}

            // onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      </Box>
    );
  }

  return null;
};
export default TaskViewer;
