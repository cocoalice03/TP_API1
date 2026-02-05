const express = require('express');
const authMiddleware = require('../middlewares/auth.middleware');
const groupController = require('../controllers/group.controller');
const { validate, groupSchema } = require('../validators/social.validator');

const router = express.Router();

// Toutes les routes de groupes sont protégées par JWT
router.use(authMiddleware.protect);

router.route('/')
  .get(groupController.getAllGroups)
  .post(validate(groupSchema), groupController.createGroup);

router.route('/:id')
  .get(groupController.getGroup)
  .delete(authMiddleware.restrictTo('admin'), groupController.deleteGroup);

router.post('/:id/join', groupController.joinGroup);

module.exports = router;
