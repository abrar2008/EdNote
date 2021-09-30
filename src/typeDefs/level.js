import { gql } from "apollo-server-express";

export default gql`
  extend type Query {
    level(id: ID!): Level
    levels: [Level]
  }

  extend type Mutation {
    createLevel(input: levelInput): Level
  }

  input levelInput {
    school: ID!
    name: String!
    faculty: ID!
    dept: ID!
    description: String!
  }

  type Level {
    _id: ID!
    school: School!
    faculty: Faculty!
    dept: Dept!
    name: String!
    description: String!
    students: [ID]
  }

  extend type Subscription {
    levelCreated: Level
  }
`;
