const express = require('express');
const authMiddleware = require('../middlewares/auth.middleware');
const pollController = require('../controllers/poll.controller');
const { validate, pollSchema } = require('../validators/social.validator');

const router = express.Router();

router.use(authMiddleware.protect);

router.route('/')
  .get(pollController.getPolls)
  .post(validate(pollSchema), pollController.createPoll);

router.route('/:id')
  .delete(authMiddleware.restrictTo('admin'), pollController.deletePoll);

router.post('/:id/vote', pollController.vote);

module.exports = router;
