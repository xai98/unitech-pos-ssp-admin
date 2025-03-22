import { gql } from "apollo-boost";

export const CREATE_BRANCH = gql`
  mutation CreateBranch($data: BranchInput!) {
    createBranch(data: $data) {
      id
    }
  }
`;

export const UPDATE_BRANCH = gql`
  mutation UpdateBranch($data: BranchInput!, $where: BranchWhereInputOne!) {
    updateBranch(data: $data, where: $where) {
      id
    }
  }
`;

export const DELETE_BRANCH = gql`
mutation DeleteBranch($where: BranchWhereInputOne!) {
  deleteBranch(where: $where) {
    id
  }
}
`;

export const BRANCHS = gql`
  query Branchs(
    $where: BranchWhereInput
    $skip: Int
    $limit: Int
    $orderBy: OrderByInput
  ) {
    Branchs(where: $where, skip: $skip, limit: $limit, orderBy: $orderBy) {
      total
      data {
        id
        branchName
        code
        code_la
        note
        createdAt
        updatedAt
      }
    }
  }
`;
