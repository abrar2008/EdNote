import { gql } from "apollo-server-express";

export default gql`
  extend type Query {
    school(id: ID!): School
    schools: [School]
  }

  extend type Mutation {
    createSchool(input: schoolInput): School
  }

  input schoolInput {
    name: String!
    description: String!
    location: String!
  }

  type School {
    _id: ID!
    name: String!
    description: String!
    location: String!
    created_by: User!
    faculties: [Faculty]
    departments: [Dept]
    levels: [Level]
  }

  extend type Subscription {
    schoolCreated: School
  }
`;
