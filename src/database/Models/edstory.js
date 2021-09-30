import mongoose, { Schema } from "mongoose";

const storySchema = new Schema(
  {
    text: {
      type: String
    },
    file: {
      type: String
    },
    category: {
      type: String,
      enum: ["school", "dept", "faculty", "level"]
    },
    creator: {
      type: Schema.Types.ObjectId,
      ref: "User"
    },
    // Any of the below values can be null depending on the category
    school: {
      type: Schema.Types.ObjectId,
      ref: "School"
    },
    faculty: {
      type: Schema.Types.ObjectId,
      ref: "Faculty"
    },
    dept: {
      type: Schema.Types.ObjectId,
      ref: "Dept"
    },
    level: {
      type: Schema.Types.ObjectId,
      ref: "Level"
    }
  },
  { timestamps: true }
);

export default mongoose.model("Story", storySchema);
