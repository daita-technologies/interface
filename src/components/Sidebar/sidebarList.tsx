import DashboardIcon from "@mui/icons-material/Dashboard";
import AssignmentIcon from "@mui/icons-material/Assignment";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";

const sideBarList = [
  {
    name: "Dashboard",
    Icon: DashboardIcon,
    to: "/dashboard",
  },
  {
    name: "My Projects",
    Icon: AssignmentIcon,
    subNav: [
      {
        name: "P1: Getting_Done_Project_1_Image_Annotation",
        Icon: FolderOpenIcon,
        to: "/project/1",
      },
      {
        name: "P2: Getting_Done_Project_2_Image_Annotation",
        Icon: FolderOpenIcon,
      },
      {
        name: "P3: Getting_Done_Project_3_Image_Annotation",
        Icon: FolderOpenIcon,
      },
      {
        name: "P4: Getting_Done_Project_4_Image_Annotation",
        Icon: FolderOpenIcon,
      },
      {
        name: "P5: Getting_Done_Project_5_Image_Annotation",
        Icon: FolderOpenIcon,
      },
    ],
  },
];

export default sideBarList;
