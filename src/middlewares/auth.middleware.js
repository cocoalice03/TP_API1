const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const User = require('../models/user.model');

exports.protect = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ status: 'fail', message: 'Accès refusé. Veuillez vous connecter.' });
    }

    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ status: 'fail', message: 'L\'utilisateur n\'existe plus.' });
    }

    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ status: 'fail', message: 'Token invalide ou expiré.' });
  }
};

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ status: 'fail', message: 'Permission refusée.' });
    }
    next();
  };
};
