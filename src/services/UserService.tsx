import { gql } from "apollo-boost";


export const CREATE_USER = gql`
  mutation CreateUser($data: UserInput!) {
    createUser(data: $data) {
      id
    }
  }
`;

export const UPDATE_USER = gql`
  mutation UpdateUser($data: UserInput!, $where: UserWhereInputOne!) {
    updateUser(data: $data, where: $where) {
      id
    }
  }
`;

export const DELETE_USER = gql`
  mutation DeleteUser($where: UserWhereInputOne!) {
    deleteUser(where: $where) {
      id
    }
  }
`;

export const CREATE_EMPLOYEE = gql`
  mutation CreateEmployee($data: EmployeeInput!) {
    createEmployee(data: $data) {
      id
    }
  }
`;

export const UPDATE_EMPLOYEE = gql`
  mutation UpdateEmployee(
    $data: EmployeeInput!
    $where: EmployeeWhereInputOne!
  ) {
    updateEmployee(data: $data, where: $where) {
      id
    }
  }
`;

export const DELETE_EMPLOYEE = gql`
mutation DeleteEmployee($where: EmployeeWhereInputOne!) {
  deleteEmployee(where: $where) {
    id
  }
}
`


export const USERS = gql`
  query Users(
    $where: UserWhereInput
    $orderBy: OrderByInput
    $skip: Int
    $limit: Int
  ) {
    users(where: $where, orderBy: $orderBy, skip: $skip, limit: $limit) {
      data {
        id
        username
        phone
        firstName
        lastName
        email
        birthday
        imageProfile
        imageCovers
        role
        gender
        maritualStatus
        amount
        total
        createdBy
        updatedBy
        createdAt
        updatedAt
        note
      }
      total
    }
  }
`;


export const EMPLOYEES = gql`
query Employees($where: EmployeeWhereInput, $orderBy: OrderByInput, $skip: Int, $limit: Int) {
  employees(where: $where, orderBy: $orderBy, skip: $skip, limit: $limit) {
    total
    data {
      id
      branchName
      branchId {
        id
        branchName
      }
      username
      phone
      firstName
      lastName
      email
      birthday
      imageProfile
      permission
      role
      gender
      maritualStatus
      note
      isDeleted
      status
    }
  }
}
`