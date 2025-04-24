import { timeStamp } from "console";

const mongoose = require("mongoose");
const { type } = require("os");
const BlogSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      minlength: 10,
    },
    description: {
      type: String,
      required: true,
      minlength: 100,
    },
    coverImage: {
      type: String,
      required: true,
    },
    ingredients: {
      type: [String],
      required: true,
    },
    tags: {
      type: String,
      required: false,
    },
    instructions: {
      type: [String],
      required: true,
    },
  },
  {
    timeStamp: true,
  }
);
const Blog = mongoose.model("Blog", BlogSchema);
export default Blog;
