import { gql } from "apollo-boost";

export const PRESIGNED_URL_MANY = gql`
  query PreSignedUrlMany($name: [String!]) {
    preSignedUrlMany(name: $name) {
      url
    }
  }
`;

export const PRESIGNED_URL = gql`
  query PreSignedUrl($name: String!) {
    preSignedUrl(name: $name) {
      url
    }
  }
`;
