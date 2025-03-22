import { gql } from "apollo-boost";

export const CREATE_CATEOGRY = gql`
  mutation CreateCategory($data: CategoryInput!) {
    createCategory(data: $data) {
      id
      categoryName
    }
  }
`;

export const UPDATE_CATEOGRY = gql`
  mutation UpdateCategory(
    $data: CategoryInput!
    $where: CategoryWhereInputOne!
  ) {
    updateCategory(data: $data, where: $where) {
      id
      categoryName
    }
  }
`;

export const DELETE_CATEOGRY = gql`
  mutation DeleteCategory($where: CategoryWhereInputOne!) {
    deleteCategory(where: $where) {
      id
    }
  }
`;

export const CATEGORIES = gql`
  query Categorys($where: CategoryWhereInput, $skip: Int, $limit: Int) {
    categorys(where: $where, skip: $skip, limit: $limit) {
      total
      data {
        id
        categoryName
        note
        createdBy
        updatedBy
        createdAt
        updatedAt
      }
    }
  }
`;