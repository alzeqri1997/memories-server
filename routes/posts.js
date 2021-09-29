import express from 'express';

import { createPost, getPosts } from '../controllers/posts.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.get('/', auth, getPosts);
router.post('/', createPost);

export default router;
