import { Outlet } from "react-router-dom";

import routes from "../utils/routes";
import StockCenterPage from "../pages/stockCenter/stockCenter/StockCenterPage";
import StockCenterDetail from "../pages/stockCenter/stockCenter/StockCenterDetail";
import ExportStockBoxPage from "../pages/stockCenter/stockCenter/ExportStockBoxPage";

// eslint-disable-next-line
export default {
  path: "/",
  element: <Outlet />,
  children: [
    {
      path: routes.STOCK_CENTER_PAGE,
      element: <StockCenterPage />,
    },
    {
      path: routes.STOCK_CENTER_DETAIL+'/:stockCenterId',
      element: <StockCenterDetail />,
    },
    {
      path: routes.EXPORT_STOCK_BOX_PAGE,
      element: <ExportStockBoxPage />
    }
  ],
};
