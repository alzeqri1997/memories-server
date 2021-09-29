import express from 'express';

import { createPost, getPosts, updatePost } from '../controllers/posts.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.get('/', auth, getPosts);
router.post('/', createPost);

router.patch('/:id', auth, updatePost);

export default router;
