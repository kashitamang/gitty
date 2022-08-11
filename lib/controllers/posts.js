const { Router } = require('express');
const authenticate = require('../middleware/authenticate');
const Post = require('../models/Post');

module.exports = Router()
  //get
  .get('/', authenticate, async (req, res, next) => {
    try {
      const posts = await Post.getAll();
      res.json(posts);
    } catch (error) {
      next(error);
    }
  })
  //post
  .post('/', authenticate, async (req, res, next) => {
    try {
      const newPost = await Post.insert(req.body);
      res.send(newPost);
    } catch (error) {
      next(error);
    }
  });
