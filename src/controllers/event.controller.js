const Event = require('../models/event.model');
const Group = require('../models/group.model');

exports.createEvent = async (req, res, next) => {
  try {
    const group = await Group.findById(req.body.group);
    if (!group) {
      return res.status(404).json({ status: 'fail', message: 'Groupe non trouvé' });
    }

    // Vérifier si l'utilisateur est membre du groupe
    if (!group.members.includes(req.user.id) && req.user.role !== 'admin') {
      return res.status(403).json({ status: 'fail', message: 'Vous devez être membre du groupe pour créer un événement' });
    }

    req.body.creator = req.user.id;
    const newEvent = await Event.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        event: newEvent
      }
    });
  } catch (err) {
    next(err);
  }
};

exports.getAllEvents = async (req, res, next) => {
  try {
    const events = await Event.find().populate('group', 'name').populate('creator', 'username');
    res.status(200).json({
      status: 'success',
      results: events.length,
      data: {
        events
      }
    });
  } catch (err) {
    next(err);
  }
};

exports.joinEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ status: 'fail', message: 'Événement non trouvé' });
    }

    if (event.participants.includes(req.user.id)) {
      return res.status(400).json({ status: 'fail', message: 'Vous participez déjà à cet événement' });
    }

    event.participants.push(req.user.id);
    await event.save();

    res.status(200).json({
      status: 'success',
      data: {
        event
      }
    });
  } catch (err) {
    next(err);
  }
};

exports.toggleTicketing = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ status: 'fail', message: 'Événement non trouvé' });
    }

    if (!event.creator.equals(req.user.id) && req.user.role !== 'admin') {
      return res.status(403).json({ status: 'fail', message: 'Non autorisé' });
    }

    event.hasTicketing = !event.hasTicketing;
    if (req.body.price !== undefined) event.price = req.body.price;
    
    await event.save();

    res.status(200).json({
      status: 'success',
      data: {
        event
      }
    });
  } catch (err) {
    next(err);
  }
};

exports.toggleBonus = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ status: 'fail', message: 'Événement non trouvé' });
    }

    if (!event.creator.equals(req.user.id) && req.user.role !== 'admin') {
      return res.status(403).json({ status: 'fail', message: 'Non autorisé' });
    }

    event.bonusEnabled = !event.bonusEnabled;
    await event.save();

    res.status(200).json({
      status: 'success',
      data: {
        event
      }
    });
  } catch (err) {
    next(err);
  }
};

exports.buyTicket = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ status: 'fail', message: 'Événement non trouvé' });
    if (!event.hasTicketing) return res.status(400).json({ status: 'fail', message: 'Billetterie non activée pour cet événement' });

    if (event.participants.includes(req.user.id)) {
      return res.status(400).json({ status: 'fail', message: 'Vous avez déjà un billet' });
    }

    event.participants.push(req.user.id);
    await event.save();

    res.status(200).json({
      status: 'success',
      message: `Billet acheté avec succès pour ${event.price}€`,
      data: { event }
    });
  } catch (err) { next(err); }
};

exports.deleteEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ status: 'fail', message: 'Événement non trouvé' });

    if (!event.creator.equals(req.user.id) && req.user.role !== 'admin') {
      return res.status(403).json({ status: 'fail', message: 'Non autorisé' });
    }

    await Event.findByIdAndDelete(req.params.id);
    res.status(204).json({ status: 'success', data: null });
  } catch (err) { next(err); }
};
