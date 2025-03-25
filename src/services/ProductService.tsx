import { gql } from "apollo-boost";

export const CREATE_PRODUCT = gql`
  mutation CreateProduct($data: ProductInput!) {
    createProduct(data: $data) {
      id
    }
  }
`;

export const UPDATE_PRODUCT = gql`
  mutation UpdateProduct($data: ProductInput!, $where: ProductWhereInputOne!) {
    updateProduct(data: $data, where: $where) {
      id
    }
  }
`;

export const DELETE_PRODUCT = gql`
  mutation DeleteProduct($where: ProductWhereInputOne!) {
    deleteProduct(where: $where) {
      id
    }
  }
`;

export const UPDATE_IS_SHOW_SALE_PRODUCT = gql`
  mutation UpdateIsShowSaleProduct(
    $data: ProductInput!
    $where: ProductWhereInputOne!
  ) {
    updateIsShowSaleProduct(data: $data, where: $where) {
      id
    }
  }
`;

export const UPDATE_COMMISSION_MANY_PRODUCTS = gql`
  mutation UpdateCommissionManyProduct(
    $data: ProductInput!
    $where: ProductWhereInputOne!
  ) {
    updateCommissionManyProduct(data: $data, where: $where) {
      id
    }
  }
`;

export const UPDATE_NOTI_QTY_LOW_MANY = gql`
  mutation UpdateNotiQtyLowManyProduct(
    $data: ProductInput!
    $where: ProductWhereInputOne!
  ) {
    updateNotiQtyLowManyProduct(data: $data, where: $where) {
      id
    }
  }
`;

export const UPDATE_NOTI_QTY_LOW_MANY_SALE_POS = gql`
  mutation UpdateNotiQtyLowManySalePOSProduct(
    $data: ProductInput!
    $where: ProductWhereInputOne!
  ) {
    updateNotiQtyLowManySalePOSProduct(data: $data, where: $where) {
      id
    }
  }
`;

export const GET_PRODUCTS = gql`
  query Products(
    $where: ProductWhereInput
    $orderBy: OrderByInput
    $skip: Int
    $limit: Int
  ) {
    products(where: $where, orderBy: $orderBy, skip: $skip, limit: $limit) {
      total
      data {
        id
        productName
        image
        colorName
        size
        price_cost
        price_sale
        barcode
        categoryId {
          id
          categoryName
        }
        note
        isDeleted
        createdBy
        updatedBy
        createdAt
        updatedAt
      }
    }
  }
`;

export const GET_PRODUCT_BY_ID = gql`
  query Product($where: ProductWhereInputOne!) {
    product(where: $where) {
      id
      categoryId {
        id
        categoryName
      }
      barcode
      productName
      image
      colorName
      size
      price_cost
      price_sale
      note
      isCommission
      commission
      notiQty
      notiQtyPOS
      isShowSale
      isCreatedStock
      createdBy
      updatedBy
      createdAt
      updatedAt
    }
  }
`;
