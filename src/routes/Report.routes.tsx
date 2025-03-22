import { Outlet } from "react-router-dom";

import routes from "../utils/routes";
import HistoryChangePage from "../pages/documentReport/historyChange/HistoryChangePage";
import HistorySalePage from "../pages/documentReport/historySale/HistorySalePage";
import ReportPage from "../pages/documentReport/report/ReportPage";
import OverviewPage from "../pages/documentReport/report/OverviewPage";
import StockLowsList from "../pages/documentReport/report/StockLowsList";


// eslint-disable-next-line
export default {
    path: "/",
    element: <Outlet />,
    children: [
        {
            path: routes.REPORT_DASHBOARD,
            element: <OverviewPage />,
        },
        {
            path: routes.STOCK_LOWS_PAGE,
            element: <StockLowsList />,
        },
        {
            path: routes.HISTORY_CHANGE_PRODUCT,
            element: <HistoryChangePage />,
        },
        {
            path: routes.HISTORY_SALE,
            element: <HistorySalePage />,
        },
        {
            path: routes.REPORT_DOCUMENT + "/:branchId",
            element: <ReportPage />,
        },
    ],
};



