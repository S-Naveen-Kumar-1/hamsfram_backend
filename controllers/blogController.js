const Blog = require("../model/blog.model");

// Create a new blog
const uploadBlog = async (req, res) => {
  try {
    const {
      title,
      description,
      detailedDescription,
      authorName,
    } = req.body;

    const newBlog = new Blog({
      title,
      description,
      detailedDescription,
      authorName,
    });

    const savedBlog = await newBlog.save();

    return res.status(201).json({
      success: true,
      data: savedBlog,
    });
  } catch (error) {
    console.error("Error saving blog:", error);
    return res.status(400).json({
      success: false,
      message: 'Error saving blog',
      error: error.message,
    });
  }
};

// Get all blogs
const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find();
    return res.status(200).json({
      success: true,
      data: blogs,
    });
  } catch (error) {
    console.error("Error retrieving blogs:", error);
    return res.status(400).json({
      success: false,
      message: 'Error retrieving blogs',
      error: error.message,
    });
  }
};

// Get blog by ID
const getBlogById = async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findById(id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found',
      });
    }

    return res.status(200).json({
      success: true,
      data: blog,
    });
  } catch (error) {
    console.error("Error retrieving blog:", error);
    return res.status(400).json({
      success: false,
      message: 'Error retrieving blog',
      error: error.message,
    });
  }
};

// Add comment to blog
const addComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { text, author } = req.body;

    if (!text) {
      return res.status(400).json({
        success: false,
        message: 'Comment text is required',
      });
    }

    const blog = await Blog.findById(id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found',
      });
    }

    blog.comments.push({
      text,
      author: author || 'Guest',
    });

    await blog.save();

    return res.status(201).json({
      success: true,
      data: blog.comments,
    });
  } catch (error) {
    console.error("Error adding comment:", error);
    return res.status(400).json({
      success: false,
      message: 'Error adding comment',
      error: error.message,
    });
  }
};

// Delete comment (optional but useful)
const deleteComment = async (req, res) => {
  try {
    const { blogId, commentIndex } = req.params;

    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found',
      });
    }

    if (!blog.comments[commentIndex]) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found',
      });
    }

    blog.comments.splice(commentIndex, 1);
    await blog.save();

    return res.status(200).json({
      success: true,
      message: 'Comment deleted successfully',
      data: blog.comments,
    });
  } catch (error) {
    console.error("Error deleting comment:", error);
    return res.status(400).json({
      success: false,
      message: 'Error deleting comment',
      error: error.message,
    });
  }
};
const likeBlog = async (req, res) => {
  try {
    const { id } = req.params;

    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    blog.likes += 1;
    await blog.save();

    return res.status(200).json({
      success: true,
      data: blog.likes,
    });
  } catch (error) {
    console.error("Error liking blog:", error);
    return res.status(400).json({
      success: false,
      message: "Error liking blog",
      error: error.message,
    });
  }
};

module.exports = {
  uploadBlog,
  getAllBlogs,
  getBlogById,
  addComment,
  deleteComment,
  likeBlog
};
