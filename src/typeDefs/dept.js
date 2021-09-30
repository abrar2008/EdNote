import { gql } from "apollo-server-express";

export default gql`
  extend type Query {
    dept(id: ID!): Dept
    depts: [Dept]
  }

  extend type Mutation {
    createDept(input: deptInput): Dept
  }

  input deptInput {
    school: ID!
    name: String!
    faculty: ID!
    description: String!
  }

  type Dept {
    _id: ID!
    school: School!
    faculty: Faculty!
    name: String!
    description: String!
  }

  extend type Subscription {
    deptCreated: Dept
  }
`;
