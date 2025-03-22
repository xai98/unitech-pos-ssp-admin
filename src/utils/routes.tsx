const routes = {
    HOME:'/',
    PAGE_GINATION: '/limit/50/skip/1',

    //pos
    POS_SALE: '/pos-sales',
    POS_LIST: '/pos-list',
    POS_DETAIL: '/pos/pos-detail',
    CHANGE_PRODUCT: '/pos/change-product',

    //stock
    STOCK_PAGE: '/core/stock/stock-page',
    STOCK_CATEGORY: '/core/stock/category-page',
    CHECK_STOCK_BRANCH: '/core/stock/check-stock-branch',
    HISTORY_STOCK_LIST: '/core/stock/history-stock-list',
    ADD_STOCK_BRANCH:"/core/stock/add-stock-branch",
    STOCK_BRANCH:"/core/stock/stock-branch",
    REQUEST_STOCK_PAGE:"/core/stock/request-stock-page",
    REQUEST_STOCK_DETAIL:"/core/stock/request-stock-detail",
    ADD_REQUEST_STOCK:"/core/stock/add-request-stock",
    PRODUCT_DETAIL:"/core/stock/product-detail",

    //report
    REPORT_DASHBOARD: '/report-dashboard',
    STOCK_LOWS_PAGE: '/stock/stock-low-page',
    HISTORY_CHANGE_PRODUCT: '/color/report/history-change-product',
    HISTORY_SALE: '/color/report/history-sale',
    REPORT_DOCUMENT: '/color/report/report-document',

    //--- management
    BRANCH: '/core/management/branch',
    STAFF_ADMIN: '/core/management/staff-admin',
    STAFF_BRANCH: '/core/management/staff-branch',


    //setting
    SETTING_EXCHANGE: '/core/setting/exchange',

    //stock center
    STOCK_CENTER_PAGE: '/core/stock/stock-center-page',
    STOCK_CENTER_DETAIL: '/core/stock/stock-center-detail',
    EXPORT_STOCK_BOX_PAGE: '/core/stock/export-stock-box',
    
}

export default routes;