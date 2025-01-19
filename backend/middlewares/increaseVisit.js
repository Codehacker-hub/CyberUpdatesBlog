import Post from "../models/post.model.js";

const IncreaseVisit = async (req, res, next) => {
  try {
    const slug = req.params.slug;
    await Post.findOneAndUpdate({ slug }, { $inc: { visit: 1 } });
    next();
  } catch (error) {
    res.status(500).json({ message: "Some Error Occured:", error: error.message });
  }
};

export default IncreaseVisit;
