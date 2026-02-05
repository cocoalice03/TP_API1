const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { 
    expiresIn: process.env.JWT_EXPIRES_IN || '24h' 
  });
};

exports.register = async (req, res, next) => {
  try {
    const newUser = await User.create({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password
    });
    const token = signToken(newUser._id);
    res.status(201).json({ status: 'success', token });
  } catch (err) { next(err); }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password, user.password))) {
      return res.status(401).json({ message: 'Identifiants incorrects' });
    }
    const token = signToken(user._id);
    res.status(200).json({ status: 'success', token });
  } catch (err) { next(err); }
};

// Méthode temporaire pour le TP pour faciliter les tests RBAC
exports.makeMeAdmin = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.user.id, { role: 'admin' }, { new: true });
    res.status(200).json({ status: 'success', data: { user } });
  } catch (err) { next(err); }
};
