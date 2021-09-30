import { gql } from "apollo-server-express";

export default gql`
  extend type Query {
    faculty(id: ID!): Faculty
    faculties: [Faculty]
  }

  extend type Mutation {
    createFaculty(input: facultyInput): Faculty
  }

  input facultyInput {
    school: ID!
    name: String!
    description: String!
  }

  type Faculty {
    _id: ID!
    school: School!
    name: String!
    description: String!
  }

  extend type Subscription {
    facultyCreated: Faculty
  }
`;
