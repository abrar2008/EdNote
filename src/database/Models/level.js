import mongoose, { Schema } from "mongoose";

const levelSchema = new Schema(
  {
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
    name: {
      type: String,
      required: true
    },
    students: [
      {
        type: Schema.Types.ObjectId,
        ref: "Student"
      }
    ]
  },
  { timestamps: true }
);

export default mongoose.model("Level", levelSchema);
