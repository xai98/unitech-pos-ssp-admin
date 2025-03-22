import { gql } from "apollo-boost";

export const CREATE_ORDER = gql`
  mutation CreateOrder($data: OrdersInput!) {
    createOrder(data: $data) {
      id
    }
  }
`;

export const GET_LAST_ORDER = gql`
  query GetLastOder($where: OrdersWhereInputOne!) {
    getLastOder(where: $where) {
      order_no
      branchId {
        code
        id
      }
    }
  }
`;

export const GET_ORDERS = gql`
  query Orders(
    $where: OrdersWhereInput
    $orderBy: OrderByInput
    $skip: Int
    $limit: Int
  ) {
    orders(where: $where, orderBy: $orderBy, skip: $skip, limit: $limit) {
      total
      data {
        id
        order_no
        branchId {
          id
          branchName
        }
        branchName
        order_items {
          id
          productName
          price_sale
          order_qty
          order_time
          order_total_price
          productId {
            id
            image
            productName
            price_cost
            price_sale
          }
        }
        total_price
        isDiscount
        discount_type
        discount
        discount_total
        isTax
        tax
        total_tax
        exchangeRate {
          bath
          usd
          cny
        }
        typePay
        cash_lak
        cash_bath
        cash_usd
        cash_cny
        transfer_lak
        transfer_bath
        transfer_usd
        transfer_cny
        final_receipt_total
        send_back_customer
        overall_status
        isDeleted
        note
        createdBy
        updatedBy
        deletedBy
        createdAt
        updatedAt
        deletedAt
      }
    }
  }
`;

export const GET_REPORT_ORDERS = gql`
  query ReportOrders($where: OrdersWhereInputOne) {
    reportOrders(where: $where) {
      totalOrders
      totalPrice
      totalCashLak
      totalTransferLak
      totalDiscount
      totalSendBack
      totalCashBath
      totalProfit
      totalOriginPrice
      totalTransferBath
      totalTransferLak
      totalCommission
      totalActualCashLak
      totalActualIncome
    }
  }
`;

export const GET_ORDER_ONE = gql`
  query Order($where: OrdersWhereInputOne!) {
    order(where: $where) {
      id
      order_no
      branchId {
        id
        branchName
      }
      branchName
      order_items {
        id
        productName
        price_sale
        order_qty
        order_time
        order_total_price
        productId {
          id
          image
          productName
          price_cost
          price_sale
        }
      }
      total_price
      isDiscount
      discount_type
      discount
      discount_total
      isTax
      tax
      total_tax
      exchangeRate {
        bath
        usd
        cny
      }
      typePay
      cash_lak
      cash_bath
      cash_usd
      cash_cny
      transfer_lak
      transfer_bath
      transfer_usd
      transfer_cny
      final_receipt_total
      send_back_customer
      overall_status
      isDeleted
      note
      createdBy
      updatedBy
      deletedBy
      createdAt
      updatedAt
      deletedAt
    }
  }
`;

export const CREATE_CHANGE_ORDER = gql`
  mutation CreateChangeOrder($data: ChangeOrderInput!) {
    createChangeOrder(data: $data) {
      id
    }
  }
`;

export const GET_CHANGE_ORDERS = gql`
  query ChangeOrders(
    $where: ChangeOrderWhereInput
    $orderBy: OrderByInput
    $skip: Int
    $limit: Int
  ) {
    changeOrders(where: $where, orderBy: $orderBy, skip: $skip, limit: $limit) {
      total
      data {
        id
        updatedBy
        updatedAt
        typePay
        transfer_lak
        totalOriginPriceNewItem
        totalOldOrder
        totalNewOrder
        toalChangeOrder
        send_back_customer
        order_no
        orderId {
          id
          order_no
        }
        oldItem {
          id
          commission
          _id
          order_by
          order_note
          order_qty
          order_time
          order_total_price
          price_cost
          price_sale
          productName
          productId {
            id
          }
        }
        note
        createdBy
        createdAt
        cash_lak
        branchName
        branchId {
          branchName
          id
        }
        amountAddOnNewOrder
        newChangeItem {
          commission
          id
          productName
          order_by
          order_note
          order_qty
          order_time
          order_total_price
          price_cost
          price_sale
          productId {
            id
          }
          _id
        }
        changeItem {
          _id
          commission
          id
          order_by
          order_note
          order_qty
          order_time
          order_total_price
          price_cost
          price_sale
          productId {
            id
          }
          productName
        }
      }
    }
  }
`;

export const GET_CHANGE_ORDER_ONE = gql`
  query ChangeOrder($where: ChangeOrderWhereInputOne!) {
    changeOrder(where: $where) {
      id
      updatedBy
      updatedAt
      typePay
      transfer_lak
      totalOriginPriceNewItem
      totalOldOrder
      totalNewOrder
      toalChangeOrder
      send_back_customer
      order_no
      orderId {
        id
        order_no
      }
      oldItem {
        id
        commission
        _id
        order_by
        order_note
        order_qty
        order_time
        order_total_price
        price_cost
        price_sale
        productName
        productId {
          id
        }
      }
      note
      createdBy
      createdAt
      cash_lak
      branchName
      branchId {
        branchName
        id
      }
      amountAddOnNewOrder
      newChangeItem {
        commission
        id
        productName
        order_by
        order_note
        order_qty
        order_time
        order_total_price
        price_cost
        price_sale
        productId {
          id
        }
        _id
      }
      changeItem {
        _id
        commission
        id
        order_by
        order_note
        order_qty
        order_time
        order_total_price
        price_cost
        price_sale
        productId {
          id
        }
        productName
      }
    }
  }
`;

export const REPORT_ORDER_CHANGE = gql`
  query ReportChangeOrder($where: ChangeOrderWhereInput) {
    reportChangeOrder(where: $where) {
      totalTransferLak
      totalOriginPriceNewItem
      totalOldOrder
      totalNewOrder
      toalChangeOrder
      send_back_customer
      totalCashLak
      amountAddOnNewOrder
      totalActualIncome
      totalSendBack
    }
  }
`;




export const GET_REPORT_GROUP_BRANCH = gql`
  query ReportGroupBranch($where: OrdersWhereInput) {
    reportGroupBranch(where: $where) {
      branchName
      totalOrders
      totalPrice
      totalCashLak
      totalTransferLak
      totalDiscount
      totalSendBack
      totalProfit
      totalOriginPrice
      totalTransferBath
      totalTransferLak
      totalCashBath
      totalActualIncome
      totalActualCashLak
      totalCommission
    }
  }
`;


export const GET_REPORT_GROUP_DATE = gql`
query ReportGroupDate($where: OrdersWhereInput) {
  reportGroupDate(where: $where) {
    dateReport
    totalOrders
    totalPrice
    totalCashLak
    totalTransferLak
    totalDiscount
    totalSendBack
    totalProfit
    totalOriginPrice
    totalTransferBath
    totalTransferLak
    totalCashBath
    totalActualIncome
    totalActualCashLak
    totalCommission
  }
}
`

export const REPORT_PRODUCT_POPULATION = gql`
query ReportProuductPopulation($where: OrdersWhereInput $limit: Int) {
  reportProuductPopulation(where: $where  limit: $limit) {
    productId
    productName
    totalQuantitySold
    totalSale
  }
}
`

export const REPORT_BRANCH_TOP_SALES = gql`
  query ReportBranchTopSale($where: OrdersWhereInput) {
    reportBranchTopSale(where: $where) {
      branchId
      branchName
      totalQuantitySold
      totalSale
    }
  }
`


export const REPORT_PRODUCT_POPULATION_MONTH = gql`
query ReportProuductPopulationMonth($where: OrdersWhereInput) {
  reportProuductPopulationMonth(where: $where) {
    productId
    productName
    totalQuantitySold
    totalSale
    month
    year
  }
}
`

export const RETPORT_CHANGE_ORDER_GROUP_BRANCH = gql`
query ReportChangeOrderGroupBrach($where: ChangeOrderWhereInput) {
  reportChangeOrderGroupBrach(where: $where) {
    totalTransferLak
    totalProfit
    totalOriginPriceNewItem
    totalOrders
    totalOldOrder
    totalNewOrder
    totalCashLak
    totalActualIncome
    totalActualCashLak
    toalChangeOrder
    send_back_customer
    branchName
    amountAddOnNewOrder
  }
}
`
