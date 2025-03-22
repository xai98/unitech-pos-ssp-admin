import { Outlet } from "react-router-dom";

import routes from "../utils/routes";
import BranchPage from "../pages/manegement/branch/BranchPage";
import AdminPage from "../pages/manegement/staff_admin/AdminPage";
import StaffPage from "../pages/manegement/staff_branch/StaffPage";

// eslint-disable-next-line
export default {
  path: "/",
  element: <Outlet />,
  children: [
    {
      path: routes.BRANCH,
      element: <BranchPage />,
    },
    {
      path: routes.STAFF_ADMIN,
      element: <AdminPage />,
    },
    {
      path: routes.STAFF_BRANCH,
      element: <StaffPage />,
    },
  ],
};
