const Album = require('../models/album.model');
const Photo = require('../models/photo.model');
const Comment = require('../models/comment.model');

exports.createAlbum = async (req, res, next) => {
  try {
    req.body.creator = req.user.id;
    const album = await Album.create(req.body);
    res.status(201).json({ status: 'success', data: { album } });
  } catch (err) { next(err); }
};

exports.getAlbums = async (req, res, next) => {
  try {
    const filter = req.query.groupId ? { group: req.query.groupId } : (req.query.eventId ? { event: req.query.eventId } : {});
    const albums = await Album.find(filter).populate('creator', 'username');
    res.status(200).json({ status: 'success', results: albums.length, data: { albums } });
  } catch (err) { next(err); }
};

exports.addPhoto = async (req, res, next) => {
  try {
    req.body.album = req.params.albumId;
    req.body.creator = req.user.id;
    const photo = await Photo.create(req.body);
    res.status(201).json({ status: 'success', data: { photo } });
  } catch (err) { next(err); }
};

exports.getAlbumPhotos = async (req, res, next) => {
  try {
    const photos = await Photo.find({ album: req.params.albumId }).populate('creator', 'username');
    res.status(200).json({ status: 'success', results: photos.length, data: { photos } });
  } catch (err) { next(err); }
};

exports.addComment = async (req, res, next) => {
  try {
    const comment = await Comment.create({
      content: req.body.content,
      photo: req.params.photoId,
      creator: req.user.id
    });
    res.status(201).json({ status: 'success', data: { comment } });
  } catch (err) { next(err); }
};

exports.getPhotoComments = async (req, res, next) => {
  try {
    const comments = await Comment.find({ photo: req.params.photoId }).populate('creator', 'username');
    res.status(200).json({ status: 'success', results: comments.length, data: { comments } });
  } catch (err) { next(err); }
};

exports.deleteAlbum = async (req, res, next) => {
  try {
    const album = await Album.findById(req.params.albumId);
    if (!album) return res.status(404).json({ status: 'fail', message: 'Album non trouvé' });
    if (!album.creator.equals(req.user.id) && req.user.role !== 'admin') return res.status(403).json({ status: 'fail', message: 'Non autorisé' });
    await Album.findByIdAndDelete(req.params.albumId);
    res.status(204).json({ status: 'success', data: null });
  } catch (err) { next(err); }
};

exports.deletePhoto = async (req, res, next) => {
  try {
    const photo = await Photo.findById(req.params.photoId);
    if (!photo) return res.status(404).json({ status: 'fail', message: 'Photo non trouvée' });
    if (!photo.creator.equals(req.user.id) && req.user.role !== 'admin') return res.status(403).json({ status: 'fail', message: 'Non autorisé' });
    await Photo.findByIdAndDelete(req.params.photoId);
    res.status(204).json({ status: 'success', data: null });
  } catch (err) { next(err); }
};
