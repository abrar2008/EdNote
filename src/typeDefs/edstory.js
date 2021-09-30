import { gql } from "apollo-server-express";

export default gql`
  extend type Query {
    get_single_story(storyId: ID!): StoryStatus

    """
    Fetch stories created by a single user..Both admin and student
    """
    my_stories(cursor: String, limit: Int): StoryConnection!

    """
    This query returns for a logged in student all stories related to either
    school, faculty, dept or level they are in...The category field can be used on
    the front end to filter news if it is to be displayed by sections(school, dept level..etc)
    """
    student_related_stories(cursor: String, limit: Int): StoryConnection!

    """
    This query returns for a logged in admins all stories related to either
    school, faculty, dept or level they created...The category field can be used on
    the front end to filter news if it is to be displayed by sections(school, dept level..etc)
    """
    admin_related_stories(cursor: String, limit: Int): StoryConnection!
  }

  extend type Mutation {
    createStory(
      """
      If the user wants to upload a text for the story
      """
      text: String
      """
      If the user wants to upload a file for the story
      """
      file: Upload
      """
      this value MUST be either 'school', 'dept', 'faculty', 'level' depending on who the news
      was created for
      """
      category: String!
      """
      if the category field is not 'school' this field should be null
      """
      school: ID
      """
      if the category field is not 'faculty' this field should be null
      """
      faculty: ID
      """
      if the category field is not 'dept' this field should be null
      """
      dept: ID
      """
      if the category field is not 'level' this field should be null
      """
      level: ID
    ): StoryStatus

    deleteStory(storyId: ID!): StoryStatus
  }

  type StoryStatus {
    message: String!
    value: Boolean!
    story: Story
  }

  type Story {
    _id: ID!
    text: String
    image: String
    """
    this value is either 'school', 'dept', 'faculty', 'level' depending on who the news
    was created for
    """
    category: String!
    creator: User!
    """
    this value can be null if the value of the category field is not 'school'
    """
    school: School
    """
    this value can be null if the value of the category field is not 'faculty'
    """
    faculty: Faculty
    """
    this value can be null if the value of the category field is not 'dept'
    """
    dept: Dept
    """
    this value can be null if the value of the category field is not 'level'
    """
    level: Level
  }

  type StoryConnection {
    edges: [Story!]!
    pageInfo: PageInfo
  }
`;
