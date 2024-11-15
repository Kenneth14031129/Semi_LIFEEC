const express = require('express');
const {
  getHealthProgress,
  getHealthProgressById,
  uploadHealthProgress,
  deleteHealthProgress,
  updateHealthProgress,
} = require('../controllers/healthProgress');

const router = express.Router();

router.get("/list", getHealthProgress);
router.get('/:id', getHealthProgressById);
router.post("/add", uploadHealthProgress);
router.delete('/:id', deleteHealthProgress);
router.put('/:id', updateHealthProgress); // New route for updating

module.exports = router;