import { gql } from "apollo-boost";

export const CREATE_BRANCH_STOCK_MANY = gql`
  mutation CreateStockMany($data: StockInputMany) {
    createStockMany(data: $data) {
      count
      total
    }
  }
`;

export const ADD_STOCK_MANY = gql`
  mutation AddStockMany($data: StockInputMany) {
    addStockMany(data: $data) {
      count
      total
    }
  }
`;

export const UPDATE_STOCK_BRANCH_MANY = gql`
  mutation UpdateStockMany($data: UpdateStockMany) {
    updateStockMany(data: $data) {
      count
      total
    }
  }
`;

export const EXPORT_STOCK_MANY = gql`
  mutation ExportStockMany($data: StockInputMany) {
    exportStockMany(data: $data) {
      count
      total
    }
  }
`;

export const UPDATE_COMMISSION_MANY = gql`
  mutation UpdateCommissionMany($data: StockInputMany) {
    updateCommissionMany(data: $data) {
      count
      total
    }
  }
`;

export const CREATE_BRANCH_STOCK = gql`
  mutation CreateStock($data: StockInput!) {
    createStock(data: $data) {
      id
    }
  }
`;

export const DELETE_BRANCH_STOCK = gql`
  mutation DeleteStock($where: StockWhereInputOne!) {
    deleteStock(where: $where) {
      id
    }
  }
`;

export const UPDATE_BRANCH_STOCK = gql`
  mutation UpdateStock($data: StockInput!, $where: StockWhereInputOne!) {
    updateStock(data: $data, where: $where) {
      id
    }
  }
`;

export const UPDATE_COMMISSION = gql`
  mutation UpdateCommissions($data: StockInput!, $where: StockWhereInputOne!) {
    updateCommissions(data: $data, where: $where) {
      id
    }
  }
`;

export const UPDATE_STATUS_STOCK_MANY = gql`
  mutation UpdateStatusStockMany(
    $data: StockInput!
    $where: StockWhereInputOne
  ) {
    updateStatusStockMany(data: $data, where: $where) {
      count
      total
    }
  }
`;


export const UPDATE_STOCK_SHOW = gql`
  mutation UpdateNoShow($data: StockInput!, $where: StockWhereInputOne!) {
    updateNoShow(data: $data, where: $where) {
      id
    }
  }
`;

export const UPDATE_SHOW_STOCK = gql`
  mutation UpdateIsShow($data: StockInput!, $where: StockWhereInputOne!) {
    updateIsShow(data: $data, where: $where) {
      id
    }
  }
`;

//

export const GET_BRANCH_STOCK = gql`
  query Stock($where: StockWhereInputOne!) {
    stock(where: $where) {
      id
      categoryId {
        id
        categoryName
      }
      productId {
        id
        image
        colorName
        size
        price_cost
        price_sale
      }
      branchId {
        id
        branchName
      }
      commissionStatus
      commission
      barcode
      productName
      amount
      note
      isShowSale
      createdBy
      updatedBy
      createdAt
      updatedAt
      deletedBy
      deletedAt
      isDeleted
    }
  }
`;

export const GET_BRANCH_STOCKS = gql`
  query Stocks(
    $where: StockWhereInput
    $orderBy: OrderByInput
    $skip: Int
    $limit: Int
  ) {
    stocks(where: $where, orderBy: $orderBy, skip: $skip, limit: $limit) {
      total
      data {
        id
        categoryId {
          id
          categoryName
        }
        productId {
          id
          image
          colorName
          size
          price_cost
          price_sale
        }
        branchId {
          id
          branchName
        }
        noShow
        commissionStatus
        commission
        barcode
        productName
        amount
        note
        isShowSale
        createdBy
        updatedBy
        createdAt
        updatedAt
        deletedBy
        deletedAt
        isDeleted
      }
    }
  }
`;

export const HISTORY_STOCKS = gql`
  query Historystocks(
    $where: HistoryStockWhereInput
    $orderBy: OrderByInput
    $skip: Int
    $limit: Int
  ) {
    historystocks(
      where: $where
      orderBy: $orderBy
      skip: $skip
      limit: $limit
    ) {
      total
      data {
        branchId {
          branchName
          id
          code
        }
        createdAt
        createdBy
        currentAmount
        deletedAt
        deletedBy
        id
        inAmount
        note
        oldAmount
        outAmount
        productId {
          id
          image
          productName
        }
        productName
        status
        updatedAt
        updatedBy
      }
    }
  }
`;




export const SUMMARY_STOCK_LOW = gql`
query SummaryStockLow($where: StockWhereInput, $orderBy: OrderByInput, $skip: Int, $limit: Int) {
  summaryStockLow(where: $where, orderBy: $orderBy, skip: $skip, limit: $limit) {
    totalStockLow
  }
}
`


export const GET_STOCK_LOWS = gql`
query StockLows($where: StockWhereInput, $orderBy: OrderByInput, $skip: Int, $limit: Int) {
  stockLows(where: $where, orderBy: $orderBy, skip: $skip, limit: $limit) {
    total
    data {
      id
      productName
      categoryId {
        id
        categoryName
      }
      productId {
        id
        productName
        image
      }
      branchId {
        id
        branchName
      }
      amount
      note
    }
  }
}
`