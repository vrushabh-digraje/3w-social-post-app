const Post = require('../models/Post');

// @desc    Create a new post
// @route   POST /api/posts
// @access  Private
const createPost = async (req, res) => {
  const { text, image } = req.body;

  try {
    if (!text && !image) {
      return res.status(400).json({ message: 'A post must contain either text or an image' });
    }

    const post = await Post.create({
      user: req.user._id,
      username: req.user.username,
      text,
      image,
      likes: [],
      comments: [],
    });

    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all posts (paginated)
// @route   GET /api/posts
// @access  Public
const getPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Post.countDocuments();

    res.json({
      posts,
      page,
      pages: Math.ceil(total / limit),
      hasMore: skip + posts.length < total,
      total,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Like or Unlike a post
// @route   PUT /api/posts/:id/like
// @access  Private
const likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const username = req.user.username;

    // Check if the post has already been liked by this user
    const likeIndex = post.likes.indexOf(username);

    if (likeIndex > -1) {
      // User has already liked the post, so remove their username (unlike)
      post.likes.splice(likeIndex, 1);
    } else {
      // User hasn't liked the post, so add their username (like)
      post.likes.push(username);
    }

    await post.save();
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Comment on a post
// @route   POST /api/posts/:id/comment
// @access  Private
const commentPost = async (req, res) => {
  const { text } = req.body;

  try {
    if (!text) {
      return res.status(400).json({ message: 'Comment text is required' });
    }

    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const newComment = {
      username: req.user.username,
      text,
      createdAt: new Date(),
    };

    post.comments.push(newComment);
    await post.save();

    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createPost,
  getPosts,
  likePost,
  commentPost,
};
