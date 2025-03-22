import { StockCenter } from "./stockCenter";

// StockBoxFormProps
export interface StockBoxFormProps {
    open: boolean;
    data?: any; // ควรระบุ type ชัดเจนถ้ามีข้อมูล
    onCancel: () => void;
    refetch: () => void;
}

// โครงสร้างของ StockBox
// export interface StockBox {
//     id?: string;
//     stockCenterId: {
//         id: string;
//         productName: string;
//         productBarcode: string;
//     };
//     boxNo: string;
//     amountLimit: number;
//     amount: number;
//     status: string;
//     details: string;
//     exportDate: string;
//     exportBy: string;
//     createdBy: string;
//     updatedBy: string;
//     createdAt: string;
//     updatedAt: string;
// }
export interface StockBox {
    id: string;
    boxNo: string;
    amount: number;
    stockCenterId: {
        id: string;
        productName: string;
        productBarcode: string;
    };
    branchId?: {
        id?: string;
        branchName?: string
    };
    amountLimit: number;
    exportDate?: Date;
    exportBy?: string;
    acceptDate?: Date;
    acceptBy?: string;
    status?: string;
    details?: string;
    createdBy: string;
    createdAt?: Date;
}

// โครงสร้างของ Filter
export interface StockBoxFilter {
    productName?: string;
    categoryId?: string;
    skip: number;
    limit: number;
}

// Parameter สำหรับ handleNextPage
export interface PaginationParams {
    page: number;
    pageSize?: number;
}

// StockBoxListProps
export interface StockBoxListProps {
    loading: boolean;
    total: number;
    data: StockBox[];
    handleNextPage: (params: PaginationParams) => void;
    filter: StockBoxFilter;
    setIsImportStockBox: (value: boolean) => void;
    setIsExportStockBox: (value: boolean) => void;
    setSelectStockBox: (value: StockBox) => void;
    handlePrint: () => void;
}

export interface StockBoxImportProps {
    stockCenter: StockCenter | null;
    selectStockBox: StockBox | null;
    setIsImportStockBox: (value: boolean) => void;
    setSelectStockBox: (value: StockBox | null) => void;
    refetchStockBox: () => void;
}

export interface StockBoxExportModalProps {
    open: boolean;
    data?: any; // ควรระบุ type ชัดเจนถ้ามีข้อมูล
    onCancel: () => void;
    stockCenter: StockCenter | null;
    selectStockBox: StockBox | null;
    refetchStockBox: () => void;
}