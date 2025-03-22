import { Outlet } from "react-router-dom";

import routes from "../utils/routes";
import HistoryStockList from "../pages/historyStock/HistoryStockList";
import StockPage from "../pages/stock/stock/StockPage";
import CategoryPage from "../pages/stock/stock/CategoryPage";
import CheckStockBranchPage from "../pages/stock/checkStockBranch/CheckStockBranchPage";
import AddStockBranchPage from "../pages/stock/addStockBranch/AddStockBranchPage";
import StockBranchPage from "../pages/stock/stockBranch/StockBranchPage";
import RequestStockPage from "../pages/stock/requestStock/RequestStockPage";
import RequestStockDetail from "../pages/stock/requestStock/ RequestStockDetail";
import AddRequestStock from "../pages/stock/requestStock/AddRequestStock";
import ProductDetail from "../pages/stock/stock/ProductDetail";


// eslint-disable-next-line
export default {
    path: "/",
    element: <Outlet />,
    children: [
        {
            path: routes.STOCK_PAGE,
            element: <StockPage />,
        },
        {
            path: routes.STOCK_CATEGORY,
            element: <CategoryPage />,
        },
        {
            path: routes.CHECK_STOCK_BRANCH,
            element: <CheckStockBranchPage />,
        },
        {
            path: routes.HISTORY_STOCK_LIST,
            element: <HistoryStockList />,
        },
        {
            path: routes.ADD_STOCK_BRANCH,
            element: <AddStockBranchPage />,
        },
        {
            path: routes.STOCK_BRANCH + '/:branchId',
            element: <StockBranchPage />,
        },
        {
            path: routes.REQUEST_STOCK_PAGE ,
            element: <RequestStockPage />,
        },
        {
            path: routes.REQUEST_STOCK_DETAIL + '/:requestId' ,
            element: <RequestStockDetail />,
        },
        {
            path: routes.ADD_REQUEST_STOCK + '/:requestId/:branchId' ,
            element: <AddRequestStock />,
        },
        {
            path: routes.PRODUCT_DETAIL + '/:productId' ,
            element: <ProductDetail />,
        },
    ],
};

