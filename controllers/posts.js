import express from 'express';
import mongoose from 'mongoose';

import { PostMessage } from '../models/index.js';

const router = express.Router();

export const getPosts = async (req, res) => {
  const { page } = req.query;

  try {
    const LIMIT = 8;
    const startIndex = (Number(page) - 1) * LIMIT; // Get the starting index of every page

    const total = await PostMessage.countDocuments({});
    const posts = await PostMessage.find()
      .sort({ _id: -1 })
      .limit(LIMIT)
      .skip(startIndex);

    res.status(200).json({
      data: posts,
      currentPage: Number(page),
      numberOfPages: Math.ceil(total / LIMIT),
    });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getPostsBySearch = async (req, res) => {
  const { searchQuery, tags } = req.query;

  try {
    const title = new RegExp(searchQuery, 'i');

    const posts = await PostMessage.find({
      $or: [{ title }, { tags: { $in: tags.split(',') } }],
    });

    res.status(200).json({ data: posts });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getPostsByCreator = async (req, res) => {
  const { name } = req.query;

  try {
    const posts = await PostMessage.find({ name });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }

  try {
  } catch (error) {
    res.status(404).json({ message: error });
  }
};

export const getPost = async (req, res) => {
  const { id } = req.params;

  try {
    const post = await PostMessage.findById(id);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const createPost = async (req, res) => {
  const post = req.body;

  const newPostMessage = new PostMessage({
    ...post,
    creator: req.userId,
    createAt: new Date().toISOString(),
  });

  try {
    await newPostMessage.save();

    res.status(201).json(newPostMessage);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

export const updatePost = async (req, res) => {
  const { id } = req.params;
  const { title, message, creator, selectedFile, tags } = req.body;

  console.log(id);

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send(`No post with id: ${id}`);

  const updatedPost = { creator, title, message, tags, selectedFile, _id: id };

  await PostMessage.findByIdAndUpdate(id, updatedPost, { new: true });

  res.json({ updatedPost });
};

export const deletePost = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send(`No post with id: ${id}`);

  await PostMessage.findByIdAndRemove(id);

  res.json({ message: 'Post deleted successfully' });
};

export default router;
