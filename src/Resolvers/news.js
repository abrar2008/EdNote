import { ApolloError } from "apollo-server-express";
import { combineResolvers } from "graphql-resolvers";

// ========== Models ==============//
import Level from "../database/Models/level";
import School from "../database/Models/school";
import Faculty from "../database/Models/faculty";
import Dept from "../database/Models/department";
import News from "../database/Models/news";
import Student from "../database/Models/student";

// ============= Services ===============//
import { isAdmin, isAuthenticated, isStudent } from "./middleware";
import { processUpload } from "../helper/file_uploads";

export default {
  Query: {
    get_single_news: combineResolvers(
      isAuthenticated,
      async (_, { newsId }) => {
        try {
          const news = await News.findById(newsId);

          if (!news) {
            return {
              message: "News not found",
              value: false
            };
          }

          return {
            message: "Data found",
            value: true,
            news
          };
        } catch (error) {
          throw error;
        }
      }
    ),

    // Admin fetch news they created
    my_created_news: combineResolvers(
      isAdmin,
      async (_, { cursor, limit }, { Id }) => {
        try {
          let news;

          if (cursor) {
            news = await News.find({
              creator: Id,
              createdAt: { $lt: cursor }
            })
              .limit(limit + 1)
              .sort({ createdAt: -1 });

            if (news.length === 0) {
              return {
                edges: news
              };
            } else if (news.length > 0) {
              const hasNextPage = news.length > limit;
              const edges = hasNextPage ? news.slice(0, -1) : news;

              return {
                edges,
                pageInfo: {
                  hasNextPage,
                  endCursor: edges[edges.length - 1].createdAt
                }
              };
            }
          } else {
            news = await News.find({ creator: Id })
              .limit(limit + 1)
              .sort({ createdAt: -1 });

            if (news.length === 0) {
              return {
                edges: news
              };
            } else if (news.length > 0) {
              const hasNextPage = news.length > limit;
              const edges = hasNextPage ? news.slice(0, -1) : news;

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
            "Something went wrong while trying to fetch news articles"
          );
        } catch (error) {
          throw error;
        }
      }
    ),

    student_related_articles: combineResolvers(
      isStudent,
      async (_, { cursor, limit }, { Id }) => {
        try {
          const student = await Student.findOne({ user: Id });

          if (!student) {
            throw new ApolloError("Student not found");
          }

          let news;

          if (cursor) {
            news = await News.find({
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

            if (news.length === 0) {
              return {
                edges: news
              };
            } else if (news.length > 0) {
              const hasNextPage = news.length > limit;
              const edges = hasNextPage ? news.slice(0, -1) : news;

              return {
                edges,
                pageInfo: {
                  hasNextPage,
                  endCursor: edges[edges.length - 1].createdAt
                }
              };
            }
          } else {
            news = await News.find({
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

            if (news.length === 0) {
              return {
                edges: news
              };
            } else if (news.length > 0) {
              const hasNextPage = news.length > limit;
              const edges = hasNextPage ? news.slice(0, -1) : news;

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
            "Something went wrong while trying to fetch news articles"
          );
        } catch (err) {
          throw err;
        }
      }
    )
  },

  Mutation: {
    createNews: combineResolvers(isAdmin, async (_, args, { Id }) => {
      try {
        if (args.file) {
          const uploadData = await processUpload(args.file);

          const newNews = new News({
            image: uploadData.path,
            creator: Id,
            ...args
          });

          const savedNews = await newNews.save();

          return {
            message: "News article created successfully",
            value: true,
            news: savedNews
          };
        } else {
          const newNews = new News({
            creator: Id,
            ...args
          });

          const savedNews = await newNews.save();

          return {
            message: "News article created successfully",
            value: true,
            news: savedNews
          };
        }
      } catch (error) {
        throw error;
      }
    }),

    editNews: combineResolvers(isAdmin, async (_, args) => {
      try {
        if (args.file) {
          const uploadData = await processUpload(args.file);

          const updateNews = await News.findByIdAndUpdate(
            args.newsId,
            {
              image: uploadData.path,
              ...args
            },
            { new: true }
          );

          return {
            message: "News updated successfully",
            value: true,
            news: updateNews
          };
        } else {
          const updateNews = await News.findByIdAndUpdate(args.newsId, args, {
            new: true
          });

          return {
            message: "News updated successfully",
            value: true,
            news: updateNews
          };
        }
      } catch (error) {
        throw error;
      }
    }),

    deleteNews: combineResolvers(isAdmin, async (_, { newsId }) => {
      try {
        await News.findByIdAndRemove(newsId);

        return {
          message: "News deleted successfully",
          value: true
        };
      } catch (error) {
        throw error;
      }
    })
  },

  // Type relations to get data for other types when quering for news
  News: {
    school: (_) => School.findById(_.school),
    faculty: (_) => Faculty.findById(_.faculty),
    dept: (_) => Dept.findById(_.dept),
    level: (_) => Level.findById(_.level)
  }
};
