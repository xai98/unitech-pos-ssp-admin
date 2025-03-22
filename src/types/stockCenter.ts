// StockCenterFormProps
export interface StockCenterFormProps {
  open: boolean;
  data?: any; // ควรระบุ type ชัดเจนถ้ามีข้อมูล
  onCancel: () => void;
  refetch: () => void;
}

export interface SummaryProps{
  totalStockLows: number;
  totalOverStock: number;
  totalStockNearLows: number;
  totalItems: number;
}


// โครงสร้างของ StockCenter
export interface StockCenter {
  id: string;
  productId: {
    image: string;
  };
  categoryId: {
    categoryName: string;
  };
  productName: string;
  productBarcode: string;
  amount: number;
  minStock: number;
  maxStock: number;
  details?: string;
}

// โครงสร้างของ Filter
export interface StockCenterFilter {
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

// StockcenterListProps
export interface StockcenterListProps {
  loading: boolean;
  total: number;
  data: StockCenter[];
  handleNextPage: (params: PaginationParams) => void;
  filter: StockCenterFilter;
}