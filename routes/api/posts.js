const express = require('express');
const router = express.Router();

// Test the route
// @route   GET /api/posts/test
// desc     Tests posts route
// access   Public route
router.get(('/test'), (req, res) => res.json({msg: 'Posts works!'}));

// Export the route
module.exports = router;