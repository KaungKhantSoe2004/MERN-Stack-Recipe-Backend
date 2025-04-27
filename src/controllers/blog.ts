import { Request, Response } from "express";
import Blog from "../models/Blog";
import * as yup from "yup";
import { Interface } from "readline";
import deleteImage from "../helpers/deleteFile";
const { ObjectId } = require("mongodb");
const domainName = "http://localhost:3000/";
// Define the schema for validation
const blogSchema = yup.object({
  title: yup
    .string()
    .min(10, "Title must be at least 10 characters")
    .max(100, "Title must not exceed 100 characters")
    .required("Title is required"),

  description: yup
    .string()
    .min(20, "Content must be at least 20 characters")
    .required("Content is required"),

  // previewImage: yup.string().required("Recipe Cover is required"),

  ingredients: yup
    .array()
    .min(1, "Please add at least one ingredient")
    .required("Ingredients are required"),

  tags: yup.string().required("Please add tags"),

  instructions: yup.array().required("Please add recipe instructions"),
});

const BlogController = {
  // Fetch blogs with pagination
  index: async (req: Request, res: Response): Promise<void> => {
    try {
      const page =
        typeof req.query.page === "string" ? parseInt(req.query.page) : 1;
      const limit = 10;
      const searchTerm =
        typeof req.query.search === "string" ? req.query.search : "";
      const skip = (page - 1) * limit;
      let query = {};

      if (searchTerm) {
        query = { title: { $regex: searchTerm, $options: "i" } };
      }

      const blogs = await Blog.find(query).skip(skip).limit(limit);

      // const blogs = await Blog.find().skip(skip).limit(limit);
      const totalBlogCount = await Blog.countDocuments();

      const items = Math.ceil(totalBlogCount / limit);
      let loopableLinks = [];

      for (let i = 0; i < items; i++) {
        loopableLinks.push({ number: i + 1 });
      }

      // return;
      let links = {
        nextPage: true,
        prevPage: true,
        currentPage: page,
        loopableLinks,
      };
      res.status(200).json({
        success: true,
        message: "Success",
        data: blogs,
        links,
      });
    } catch (error: any) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: "Internal Server Error",
        error: error.message,
      });
    }
  },

  // Add a new blog
  addBlog: async (req: Request, res: Response): Promise<void> => {
    try {
      await blogSchema.validate(req.body, { abortEarly: false });
      try {
        const newBlog = new Blog({
          title: req.body.title,
          description: req.body.description,
          ingredients: req.body.ingredients,
          instructions: req.body.instructions,
          tags: req.body.tags,
          coverImage: `${domainName}${req.file?.filename}`,
        });
        const savedBlog = await newBlog.save();
        res.status(200).json({
          success: true,
          message: "Blog Added Successfully",
          data: savedBlog,
        });
      } catch (err: any) {
        res.status(500).json({
          success: false,
          message: "Internal Server Error",
          // errors: err.console.errors,
        });
      }

      // Return the newly created blog
    } catch (err: any) {
      res.status(400).json({
        success: false,
        message: "Validation Error",
        errors: err.errors,
      });
    }
  },

  // Delete a blog
  destoryBlog: async (req: Request, res: Response): Promise<void> => {
    try {
      const blog = await Blog.findOne({ _id: new ObjectId(req.params.id) });
      const image = blog?.coverImage;
      const partAfterDomain = image.split("http://localhost:3000/")[1];

      deleteImage(partAfterDomain);
      await Blog.findByIdAndDelete(req.params.id);
      res.status(200).json({
        success: true,
        message: "Blog Deleted Successfully",
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: "Failed to delete blog",
        error: error.message,
      });
    }
  },

  // Update a blog
  updateBlog: async (req: Request, res: Response): Promise<void> => {
    try {
      interface DataType {
        title: string;
        description: string;
        ingredients: string[];
        instructions: string[];
        tags: string;
        coverImage?: string | undefined;
      }
      const image: string | undefined = req.file?.filename
        ? `${domainName}${req.file.filename}`
        : undefined;
      const updateData: DataType = {
        title: req.body.title,
        description: req.body.description,
        ingredients: req.body.ingredients,
        instructions: req.body.instructions,
        tags: req.body.tags,
      };

      if (req.file?.filename) {
        updateData.coverImage = `${domainName}${req.file.filename}`;
        const blog = await Blog.findOne({ _id: new ObjectId(req.params.id) });
        const image = blog?.coverImage;
        const partAfterDomain = image.split("http://localhost:3000/")[1];

        deleteImage(partAfterDomain);
      }

      const updatedBlog = await Blog.findByIdAndUpdate(
        req.params.id,
        updateData,
        {
          new: true,
        }
      );

      res.status(200).json({
        success: true,
        message: "Blog Updated Successfully",
        data: updatedBlog,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: "Failed to update blog",
        error: error.message,
      });
    }
  },
};

export default BlogController;
