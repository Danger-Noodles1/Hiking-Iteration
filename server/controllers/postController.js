const Post = require('../models/Post');
const User = require('../models/User');

const postController = {};

// We don't have auth set up yet so for now these routes will use the user's id as verification.

postController.createPost = async (req, res, next) => {
  try {
    const { content, author_id } = req.body;
    const user = await User.findById(author_id);
    const post = await Post.create({ content, author_id: user });
    res.send(post);
  } catch (err) {
    return next(err);
  }
};

// This doesn't check if user deleting the post === original poster, yet!
postController.deletePost = (req, res, next) => {
  const { id } = req.params;
  Post.findByIdAndDelete(id)
    .then(() => res.sendStatus(200))
    .catch((err) => {
      return next(err);
    });
};

postController.getSpecificPost = (req, res, next) => {
  const { id } = req.params;
  Post.findById(id)
    .exec()
    .then((post) => res.send(post))
    .catch((err) => {
      return next(err);
    });
};  

postController.getAll = async (req, res, next) => {
  try {
    const posts = await Post.find({});
    //console.log(posts);
    res.send(posts);
  } catch (err) {
    return next(err);
  }
};

module.exports = postController;
