import mongoose, { Schema } from "mongoose";

const schoolSchema = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    location: {
      type: String,
      required: true
    },
    created_by: {
      type: Schema.Types.ObjectId,
      ref: "User"
    },
    faculties: [
      {
        type: Schema.Types.ObjectId,
        ref: "Faculty"
      }
    ],
    departments: [
      {
        type: Schema.Types.ObjectId,
        ref: "Dept"
      }
    ],
    levels: [
      {
        type: Schema.Types.ObjectId,
        ref: "Level"
      }
    ]
  },
  { timestamps: true }
);

export default mongoose.model("School", schoolSchema);
