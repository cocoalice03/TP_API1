const express = require('express');
const authMiddleware = require('../middlewares/auth.middleware');
const threadController = require('../controllers/thread.controller');
const { validate, threadSchema, messageSchema } = require('../validators/social.validator');

const router = express.Router();

router.use(authMiddleware.protect);

router.post('/', validate(threadSchema), threadController.createThread);

router.route('/:threadId')
  .delete(authMiddleware.restrictTo('admin'), threadController.deleteThread);

router.route('/:threadId/messages')
  .get(threadController.getThreadMessages)
  .post(validate(messageSchema), threadController.postMessage);

module.exports = router;
