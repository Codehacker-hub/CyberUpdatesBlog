import Post from "../models/post.model.js";

const IncreaseVisit = async (req, res, next) => {
  const slug = req.params.slug;

  await Post.findOneAndUpdate({ slug }, { $inc: { visit: 1 } });
  next();
};

export default IncreaseVisit;
