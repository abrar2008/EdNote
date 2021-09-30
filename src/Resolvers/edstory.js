import { ApolloError } from "apollo-server-express";
import { combineResolvers } from "graphql-resolvers";
import dayjs from "dayjs";

// ========== Models ==============//
import Level from "../database/Models/level";
import School from "../database/Models/school";
import Faculty from "../database/Models/faculty";
import Dept from "../database/Models/department";
import Student from "../database/Models/student";
import Story from "../database/Models/edstory";

// ============= Services ===============//
import { isAdmin, isAuthenticated, isStudent } from "./middleware";
import { processUpload } from "../helper/file_uploads";
import { agenda } from "../services/agenda";

export default {
  Query: {
    get_single_story: combineResolvers(
      isAuthenticated,
      async (_, { storyId }) => {
        try {
          const story = await Story.findById(storyId);

          if (!story) {
            return {
              message: "Story not found",
              value: false
            };
          }

          return {
            message: "Data found",
            value: true,
            story
          };
        } catch (error) {
          throw error;
        }
      }
    ),

    // Fetch all stories created by a single individual..Admin/Student
    my_stories: combineResolvers(
      isAuthenticated,
      async (_, { cursor, limit }, { Id }) => {
        try {
          let stories;

          if (cursor) {
            stories = await Story.find({
              creator: Id,
              createdAt: { $lt: cursor }
            })
              .limit(limit + 1)
              .sort({ createdAt: -1 });

            if (stories.length === 0) {
              return {
                edges: stories
              };
            } else if (stories.length > 0) {
              const hasNextPage = stories.length > limit;
              const edges = hasNextPage ? stories.slice(0, -1) : stories;

              return {
                edges,
                pageInfo: {
                  hasNextPage,
                  endCursor: edges[edges.length - 1].createdAt
                }
              };
            }
          } else {
            stories = await Story.find({ creator: Id })
              .limit(limit + 1)
              .sort({ createdAt: -1 });

            if (stories.length === 0) {
              return {
                edges: stories
              };
            } else if (stories.length > 0) {
              const hasNextPage = stories.length > limit;
              const edges = hasNextPage ? stories.slice(0, -1) : stories;

              return {
                edges,
                pageInfo: {
                  hasNextPage,
                  endCursor: edges[edges.length - 1].createdAt
                }
              };
            }
          }
          throw new ApolloError(
            "Something went wrong while trying to fetch stories"
          );
        } catch (error) {
          throw error;
        }
      }
    ),

    student_related_stories: combineResolvers(
      isStudent,
      async (_, { cursor, limit }, { Id }) => {
        try {
          const student = await Student.findOne({ user: Id });

          if (!student) {
            throw new ApolloError("Student not found");
          }

          let stories;

          if (cursor) {
            stories = await Story.find({
              $or: [
                {
                  category: "school",
                  school: student.school,
                  createdAt: { $lt: cursor }
                },
                {
                  category: "faculty",
                  faculty: student.faculty,
                  createdAt: { $lt: cursor }
                },
                {
                  category: "dept",
                  dept: student.dept,
                  createdAt: { $lt: cursor }
                },
                {
                  category: "level",
                  level: student.level,
                  createdAt: { $lt: cursor }
                }
              ]
            })
              .limit(limit + 1)
              .sort({ createdAt: -1 });

            if (stories.length === 0) {
              return {
                edges: stories
              };
            } else if (stories.length > 0) {
              const hasNextPage = stories.length > limit;
              const edges = hasNextPage ? stories.slice(0, -1) : stories;

              return {
                edges,
                pageInfo: {
                  hasNextPage,
                  endCursor: edges[edges.length - 1].createdAt
                }
              };
            }
          } else {
            stories = await Story.find({
              $or: [
                {
                  category: "school",
                  school: student.school
                },
                {
                  category: "faculty",
                  faculty: student.faculty
                },
                {
                  category: "dept",
                  dept: student.dept
                },
                {
                  category: "level",
                  level: student.level
                }
              ]
            })
              .limit(limit + 1)
              .sort({ createdAt: -1 });

            if (stories.length === 0) {
              return {
                edges: stories
              };
            } else if (stories.length > 0) {
              const hasNextPage = stories.length > limit;
              const edges = hasNextPage ? stories.slice(0, -1) : stories;

              return {
                edges,
                pageInfo: {
                  hasNextPage,
                  endCursor: edges[edges.length - 1].createdAt
                }
              };
            }
          }
          throw new ApolloError(
            "Something went wrong while trying to fetch stories"
          );
        } catch (err) {
          throw err;
        }
      }
    ),

    admin_related_stories: combineResolvers(
      isStudent,
      async (_, { cursor, limit }, { Id }) => {
        try {
          const schools = await School.find({ created_by: Id });

          const schoolIds = [];
          const facultyIds = [];
          const deptIds = [];
          const levelIds = [];

          schools.forEach((school) => {
            schoolIds.push(school._id);
            // Multiple annoying loops to get desired data structure for DB Query
            schools.faculties.forEach((faculty) => {
              facultyIds.push(faculty);
            });
            schools.dept.forEach((dep) => {
              deptIds.push(dep);
            });
            schools.level.forEach((levels) => {
              levelIds.push(levels);
            });
          });

          let stories;

          if (cursor) {
            stories = await Story.find({
              $or: [
                {
                  category: "school",
                  school: schoolIds,
                  createdAt: { $lt: cursor }
                },
                {
                  category: "faculty",
                  faculty: facultyIds,
                  createdAt: { $lt: cursor }
                },
                {
                  category: "dept",
                  dept: deptIds,
                  createdAt: { $lt: cursor }
                },
                {
                  category: "level",
                  level: levelIds,
                  createdAt: { $lt: cursor }
                }
              ]
            })
              .limit(limit + 1)
              .sort({ createdAt: -1 });

            if (stories.length === 0) {
              return {
                edges: stories
              };
            } else if (stories.length > 0) {
              const hasNextPage = stories.length > limit;
              const edges = hasNextPage ? stories.slice(0, -1) : stories;

              return {
                edges,
                pageInfo: {
                  hasNextPage,
                  endCursor: edges[edges.length - 1].createdAt
                }
              };
            }
          } else {
            stories = await Story.find({
              $or: [
                {
                  category: "school",
                  school: schoolIds
                },
                {
                  category: "faculty",
                  faculty: facultyIds
                },
                {
                  category: "dept",
                  dept: deptIds
                },
                {
                  category: "level",
                  level: levelIds
                }
              ]
            })
              .limit(limit + 1)
              .sort({ createdAt: -1 });

            if (stories.length === 0) {
              return {
                edges: stories
              };
            } else if (stories.length > 0) {
              const hasNextPage = stories.length > limit;
              const edges = hasNextPage ? stories.slice(0, -1) : stories;

              return {
                edges,
                pageInfo: {
                  hasNextPage,
                  endCursor: edges[edges.length - 1].createdAt
                }
              };
            }
          }
          throw new ApolloError(
            "Something went wrong while trying to fetch stories"
          );
        } catch (err) {
          throw err;
        }
      }
    )
  },

  Mutation: {
    createStory: combineResolvers(isAuthenticated, async (_, args, { Id }) => {
      try {
        if (args.file) {
          const uploadData = await processUpload(args.file);

          const newStory = new Story({
            image: uploadData.path,
            creator: Id,
            ...args
          });

          const savedStory = await newStory.save();

          const day = dayjs(savedStory.createdAt).add(24, "hours").format();

          // Agenda Job to delete stories after 24 Hours
          agenda.schedule(day, "delete stories", {
            id: savedStory._id
          });

          return {
            message: "Story created successfully",
            value: true,
            story: savedStory
          };
        } else {
          const newStory = new Story({
            creator: Id,
            ...args
          });

          const savedStory = await newStory.save();

          const day = dayjs(savedStory.createdAt).add(24, "hours").format();

          // Agenda Job to delete stories after 24 Hours
          agenda.schedule(day, "delete stories", {
            id: savedStory._id
          });

          return {
            message: "Story created successfully",
            value: true,
            story: savedStory
          };
        }
      } catch (error) {
        throw error;
      }
    }),

    deleteStory: combineResolvers(isAdmin, async (_, { storyId }) => {
      try {
        await Story.findByIdAndRemove(storyId);

        return {
          message: "Story deleted successfully",
          value: true
        };
      } catch (error) {
        throw error;
      }
    })
  },

  // Type relations to get data for other types when quering for stories
  Story: {
    school: (_) => School.findById(_.school),
    faculty: (_) => Faculty.findById(_.faculty),
    dept: (_) => Dept.findById(_.dept),
    level: (_) => Level.findById(_.level)
  }
};
