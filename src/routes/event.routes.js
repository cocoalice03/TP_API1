const express = require('express');
const authMiddleware = require('../middlewares/auth.middleware');
const eventController = require('../controllers/event.controller');
const { validate, eventSchema } = require('../validators/social.validator');

const router = express.Router();

router.use(authMiddleware.protect);

router.route('/')
  .get(eventController.getAllEvents)
  .post(validate(eventSchema), eventController.createEvent);

router.post('/:id/join', eventController.joinEvent);
router.post('/:id/buy-ticket', eventController.buyTicket);
router.patch('/:id/ticketing', eventController.toggleTicketing);
router.patch('/:id/bonus', eventController.toggleBonus);
router.delete('/:id', authMiddleware.restrictTo('admin'), eventController.deleteEvent);

module.exports = router;
