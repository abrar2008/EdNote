import mongoose, { Schema } from "mongoose";

const pastQuestionSchema = new mongoose.Schema({
  course: {
    type: Schema.Types.ObjectId,
    ref: "Course"
  },
  courseTopic: {
    type: Schema.Types.ObjectId,
    ref: "CourseTopic"
  },
  name: {
    type: String,
    required: true
  },
  text: {
    type: String,
    required: true
  }
});

export default mongoose.model("PastQuestion", pastQuestionSchema);
