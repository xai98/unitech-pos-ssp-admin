import { gql } from "apollo-boost";


export const CREATE_STOCK_CENTER = gql`
mutation CreateStockCenter($data: StockCenterInput!) {
  createStockCenter(data: $data) {
    id
  }
}
`;


export const GET_REPORT_STOCK_CENTER = gql`
query ReportStockCenterSummary($where: StockCenterWhereInput) {
  reportStockCenterSummary(where: $where) {
    totalStockLows
    totalOverStock
    totalStockNearLows
    totalItems
  }
}
`


export const GET_STOCK_CENTERS = gql`
query StockCenters($limit: Int, $skip: Int, $where: StockCenterWhereInput, $orderBy: OrderByInput) {
  stockCenters(limit: $limit, skip: $skip, where: $where, orderBy: $orderBy) {
    total
    data {
      id
      categoryId {
        id
        categoryName
      }
      productId {
        id
        productName
        image
      }
      productName
      productBarcode
      minStock
      maxStock
      amount
      details
      createdAt
      updatedAt
      deletedAt
    }
  }
}
`;


export const GET_STOCK_CENTER = gql`
query StockCenter($where: StockCenterWhereInputOne!) {
  stockCenter(where: $where) {
    id
    categoryId {
      id
      categoryName
    }
    productId {
      id
      productName
      image
    }
    productName
    productBarcode
    minStock
    maxStock
    amount
    details
    createdAt
    updatedAt
    deletedAt
  }
}
`