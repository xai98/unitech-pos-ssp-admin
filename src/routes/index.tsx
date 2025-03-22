// Router.tsx
import { useRoutes } from "react-router-dom";
import PrivateRoute from './PrivateRoute'
import PosRoutes from "./Pos.routes";
import StockRoutes from "./Stock.routes";
import ReportRoutes from "./Report.routes";
import SettingRoutes from "./Setting.routes";

import ManagementRoutes from "./Management.routes";


import LoginPage from "../pages/login/LoginPage";
import { AuthProvider } from "../hooks/AuthContext";

import StockCenterRoutes from "./StockCenter.routes";

function Router() {
  return (
    <AuthProvider>
      {useRoutes([
        {
          path: "/",
          element: <PrivateRoute />,
          children: [
            ManagementRoutes,
            PosRoutes,
            StockRoutes,
            ReportRoutes,
            SettingRoutes,
            StockCenterRoutes,
          ],
        },
        {
          path: "login",
          element: <LoginPage />,
        },
        {
          path: "*",
          element: <h1>404 page</h1>,
        },
      ])}
    </AuthProvider>
  );
}

export default Router;
