import { Outlet } from "react-router-dom";

import routes from "../utils/routes";
import ExchangePage from "../pages/setting/exchange/ExchangePage";


// eslint-disable-next-line
export default {
    path: "/",
    element: <Outlet />,
    children: [
        {
            path: routes.SETTING_EXCHANGE,
            element: <ExchangePage />,
        },
    ],
};

