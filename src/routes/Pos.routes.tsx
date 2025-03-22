import { Outlet } from "react-router-dom";

import routes from "../utils/routes";
import PosPage from "../pages/pos/PosPage";
import ChangeProduct from "../pages/pos/ChangeProduct";


// eslint-disable-next-line
export default {
    path: "/",
    element: <Outlet />,
    children: [
        {
            path: routes.POS_SALE,
            element: <PosPage />,
        },
        {
            path: routes.CHANGE_PRODUCT + "/:orderId",
            element: <ChangeProduct />,
        },
    ],
};

