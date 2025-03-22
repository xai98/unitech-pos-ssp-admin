import { gql } from "apollo-boost";

export const GET_SUMMARY_REQUEST_STOCK = gql`
  query SumaryRequestStock($where: RequestStockWhereInput) {
    sumaryRequestStock(where: $where) {
      status
      count
    }
  }
`;

export const GET_REQUEST_STOCKS = gql`
  query RequestStocks(
    $where: RequestStockWhereInput
    $orderBy: OrderByInput
    $skip: Int
    $limit: Int
  ) {
    requestStocks(
      where: $where
      orderBy: $orderBy
      skip: $skip
      limit: $limit
    ) {
      total
      data {
        id
        branchId {
          id
          branchName
        }
        items {
          id
          productName
          amountRequest
          amountApproved
        }
        status
        requestBy
        note
        createdAt
        createdBy
        updatedBy
      }
    }
  }
`;

export const GET_REQUEST_STOCK = gql`
  query RequestStock($where: RequestStockWhereInputOne!) {
    requestStock(where: $where) {
      id
      branchId {
        id
        branchName
      }
      status
      requestBy
      approvedBy
      dateApproved
      historyUpdate {
        status
        updatedAt
        updatedBy
      }
      items {
        id
        requestStockId {
          id
        }
        categoryId {
          id
          categoryName
        }
        productId {
          id
          productName
          price_sale
          image
        }
        branchId {
          id
          branchName
        }
        productName
        amount
        amountRequest
        amountApproved
        status
      typeAmount
      amountChecked
        note
        createdBy
        updatedBy
        createdAt
        updatedAt
        deletedBy
        deletedAt
      }
      note
      createdBy
      updatedBy
      createdAt
      updatedAt
      deletedBy
      deletedAt
    }
  }
`;

export const UPDATE_ITEM_REQUEST_STOCK = gql`
  mutation UpdateItemRequestStock(
    $data: ItemRequestStockInput!
    $where: ItemRequestStockWhereInputOne!
  ) {
    updateItemRequestStock(data: $data, where: $where) {
      id
    }
  }
`;

export const DELETE_ITEM_REQUEST_STOCK = gql`
  mutation DeleteItemRequestStock($where: ItemRequestStockWhereInputOne!) {
    deleteItemRequestStock(where: $where) {
      id
    }
  }
`;

export const UPDATE_STATUS_REQUEST_STOCK = gql`
  mutation UpdateStatusRequestStock(
    $data: RequestStockInput!
    $where: RequestStockWhereInputOne!
  ) {
    updateStatusRequestStock(data: $data, where: $where) {
      id
    }
  }
`;

export const UPDATE_ADD_REQUEST_STOCK = gql`
  mutation UpdateAddRequestStock(
    $data: RequestStockInput!
    $where: RequestStockWhereInputOne!
  ) {
    updateAddRequestStock(data: $data, where: $where) {
      id
    }
  }
`;

export const UPDATE_STOCK_MANY_FROM_REQUEST = gql`
  mutation UpdateStockManyFromRequest($data: UpdateRequestStockMany) {
    updateStockManyFromRequest(data: $data) {
      id
    }
  }
`;
