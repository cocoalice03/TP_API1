const Group = require('../models/group.model');

exports.createGroup = async (req, res, next) => {
  try {
    // Ajouter le créateur (l'utilisateur connecté)
    req.body.creator = req.user.id;
    
    // Ajouter le créateur comme premier membre par défaut
    if (!req.body.members) {
      req.body.members = [req.user.id];
    } else if (!req.body.members.includes(req.user.id)) {
      req.body.members.push(req.user.id);
    }

    const newGroup = await Group.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        group: newGroup
      }
    });
  } catch (err) {
    next(err);
  }
};

exports.getAllGroups = async (req, res, next) => {
  try {
    // Si l'utilisateur n'est pas admin, il ne voit que les groupes publics
    const filter = req.user.role === 'admin' ? {} : { isPrivate: false };
    
    const groups = await Group.find(filter).populate('creator', 'username email');

    res.status(200).json({
      status: 'success',
      results: groups.length,
      data: {
        groups
      }
    });
  } catch (err) {
    next(err);
  }
};

exports.getGroup = async (req, res, next) => {
  try {
    const group = await Group.findById(req.params.id).populate('creator members', 'username email');

    if (!group) {
      return res.status(404).json({ status: 'fail', message: 'Groupe non trouvé' });
    }

    // Vérifier si le groupe est privé et si l'utilisateur y a accès
    if (group.isPrivate && req.user.role !== 'admin' && !group.members.some(m => m._id.equals(req.user._id))) {
      return res.status(403).json({ status: 'fail', message: 'Accès refusé à ce groupe privé' });
    }

    res.status(200).json({
      status: 'success',
      data: {
        group
      }
    });
  } catch (err) {
    next(err);
  }
};

exports.deleteGroup = async (req, res, next) => {
  try {
    const group = await Group.findById(req.params.id);

    if (!group) {
      return res.status(404).json({ status: 'fail', message: 'Groupe non trouvé' });
    }

    // Seul l'admin ou le créateur peut supprimer le groupe
    if (req.user.role !== 'admin' && !group.creator.equals(req.user._id)) {
      return res.status(403).json({ status: 'fail', message: 'Vous n\'êtes pas autorisé à supprimer ce groupe' });
    }

    await Group.findByIdAndDelete(req.params.id);

    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (err) {
    next(err);
  }
};

exports.joinGroup = async (req, res, next) => {
  try {
    const group = await Group.findById(req.params.id);

    if (!group) {
      return res.status(404).json({ status: 'fail', message: 'Groupe non trouvé' });
    }

    if (group.members.includes(req.user._id)) {
      return res.status(400).json({ status: 'fail', message: 'Vous êtes déjà membre de ce groupe' });
    }

    group.members.push(req.user._id);
    await group.save();

    res.status(200).json({
      status: 'success',
      data: {
        group
      }
    });
  } catch (err) {
    next(err);
  }
};
