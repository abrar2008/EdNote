import mongoose, { Schema } from "mongoose";

const facultySchema = new Schema(
  {
    school: {
      type: Schema.Types.ObjectId,
      ref: "School"
    },
    name: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

export default mongoose.model("Faculty", facultySchema);
