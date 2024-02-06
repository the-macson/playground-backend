const express = require('express');
const router = express.Router();
const Tags = require('../../models/problem/tag.model');

router.post('/create-problem', (req, res) => {});
router.post('/create-tag', (req, res) => {
  const tag = req.body.tags;
  console.log(tag.length);
  for (let i = 0; i < tag.length; i++) {
    tag[i] = tag[i].toLowerCase();
    console.log(tag[i]);
    const newTag = Tags.create({
      name: tag[i],
    });
  }
  res.send('create problem');
});

module.exports = router;
