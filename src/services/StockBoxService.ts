import { gql } from "apollo-boost";


export const CREATE_STOCK_BOX = gql`
mutation CreateStockBox($data: StockBoxInput!) {
  createStockBox(data: $data) {
    id
  }
}
`;


export const UPDATE_STOCK_BOX = gql`
mutation UpdateStockBox($data: StockBoxInput!, $where: StockBoxWhereInputOne!) {
  updateStockBox(data: $data, where: $where) {
    id
  }
}
`

export const EXPORT_STOCK_BOX = gql`
mutation ExportStockBox($data: StockBoxInput!, $where: StockBoxWhereInputOne!) {
  exportStockBox(data: $data, where: $where) {
    id
    stockCenterId {
      id
      productName
      productBarcode
    }
    branchId {
      id
      branchName
    }
    boxNo
    amountLimit
    amount
    exportBy
    exportDate
  }
}
`


export const GET_STOCK_BOXS = gql`
query StockBoxes($where: StockBoxWhereInput, $orderBy: OrderByInput, $skip: Int, $limit: Int) {
  stockBoxes(where: $where, orderBy: $orderBy, skip: $skip, limit: $limit) {
    total
    data {
      id
      stockCenterId {
        id
        productName
        productBarcode
      }
      branchId {
        id
        branchName
      }
      boxNo
      amountLimit
      amount
      status
      details
      exportDate
      exportBy
      acceptDate
      acceptBy
      createdBy
      updatedBy
      createdAt
      updatedAt
      deletedAt
    }
  }
}
`