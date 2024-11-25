const router = require('express').Router();
const User = require('../models/user');
const middleware = require('../utils/middleware');

// Protected route with token verification
router.get('/:movieId', middleware.userExtractor, async (req, res) => {
  const { movieId } = req.params;
  const users = await User.find({ 'reviews.movieId': Number(movieId) })
    .select('reviews username');
  
  const reviews = users.flatMap(user => 
    user.reviews
      .filter(r => r.movieId === Number(movieId))
      .map(r => ({...r.toJSON(), username: user.username}))
  );
  
  res.json(reviews);
});

router.post('/', middleware.userExtractor, async (req, res) => {
  const { movieId, review } = req.body;
  const user = req.user;

  if (!user) {
    return res.status(401).json({ error: 'token invalid' });
  }

  user.reviews.push({ movieId, review });
  await user.save();

  res.status(201).json({ movieId, review });
});

module.exports = router;