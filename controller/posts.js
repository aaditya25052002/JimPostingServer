import Post from "../model/posts.js";
import User from "../model/user.js";

//createpost

export const createPost = async (req, res) => {
  try {
    const { userId, description } = req.body;
    const { filename } = req.file;
    const user = await User.findById(userId);

    const newPost = new Post({
      userId,
      firstName: user.firstName,
      lastName: user.lastName,
      location: user.location,
      description,
      userPicturePath: user.picturePath,
      picturePath: filename,
      likes: {},
      comments: [],
    });

    await newPost.save();
    const post = await Post.find(); // add the new post to all the post
    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getFeedPosts = async (req, res) => {
  try {
    const post = await Post.find(); // add the new post to all the post
    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getUserPosts = async (req, res) => {
  try {
    const { userId } = req.params;
    const post = await Post.find({ userId }); // add the new post to all the post
    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//update

export const likePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    const post = await Post.findById(id);
    const isLiked = post.likes.get(userId);

    if (isLiked) {
      post.likes.delete(userId);
    } else {
      post.likes.set(userId, true);
    }

    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { likes: post.likes },
      { new: true }
    );

    res.status(200).json(updatedPost);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};
