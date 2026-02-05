const express = require('express');
const authMiddleware = require('../middlewares/auth.middleware');
const authController = require('../controllers/auth.controller');
const userController = require('../controllers/user.controller');

const router = express.Router();

// Route protégée pour obtenir le profil de l'utilisateur connecté
router.get('/me', authMiddleware.protect, (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      user: req.user
    }
  });
});

router.patch('/make-me-admin', authMiddleware.protect, authController.makeMeAdmin);

// Routes d'administration
router.use(authMiddleware.protect, authMiddleware.restrictTo('admin'));

router.route('/')
  .get(userController.getAllUsers);

router.route('/:id')
  .get(userController.getUser)
  .delete(userController.deleteUser);

module.exports = router;
