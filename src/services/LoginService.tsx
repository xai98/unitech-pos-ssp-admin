import { gql } from "@apollo/client";

export const LOGIN = gql`
  mutation Login($data: LoginInput!) {
    login(data: $data) {
      accessToken
      data {
        id
        username
        phone
        firstName
        lastName
        email
        imageProfile
        imageCovers
        role
        gender
        maritualStatus
        amount
        total
      }
    }
  }
`;