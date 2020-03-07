const express = require('express');
const router = express.Router();

// Test the route
// @route   GET /api/profile/test
// desc     tests profile route
// access   Public access
router.get(('/test'), (req, res) => res.json({msg: 'Profile works!'}));

// Export the route
module.exports = router;