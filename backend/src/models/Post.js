const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      required: [true, 'Comment text cannot be empty'],
      trim: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  }
);

const postSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      trim: true,
    },
    image: {
      type: String, // Base64 data URI
    },
    likes: {
      type: [String], // Array of usernames who liked the post
      default: [],
    },
    comments: {
      type: [commentSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// Ensure that either text or image is provided (but not both mandatory)
postSchema.pre('validate', function (next) {
  if (!this.text && !this.image) {
    this.invalidate('text', 'A post must contain either text or an image.');
  }
  next();
});

module.exports = mongoose.model('Post', postSchema);
