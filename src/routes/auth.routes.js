const express = require('express');
const authController = require('../controllers/auth.controller');
const { validate, schemas } = require('../validators/auth.validator');

const router = express.Router();

router.post('/register', validate(schemas.registerSchema), authController.register);
router.post('/login', validate(schemas.loginSchema), authController.login);

module.exports = router;
