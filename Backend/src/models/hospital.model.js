import mongoose, { Schema } from "mongoose";

const hospitalSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    doctors: [
      {
        type: Schema.Types.ObjectId,
        ref: "Doctor",
      },
      { default: [] },
    ],
    patients: [
      {
        type: Schema.Types.ObjectId,
        ref: "Patient",
      },
      { default: [] },
    ],
    sensors: [
      {
        type: Schema.Types.ObjectId,
        ref: "Sensor",
      },
      { default: [] },
    ],
  },
  {
    timestamps: true,
  },
);

export const Hospital = mongoose.model("Hospital", hospitalSchema);
