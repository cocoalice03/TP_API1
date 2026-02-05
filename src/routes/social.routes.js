const express = require('express');
const authMiddleware = require('../middlewares/auth.middleware');
const socialController = require('../controllers/social.controller');
const { validate, albumSchema, photoSchema, commentSchema } = require('../validators/social.validator');

const router = express.Router();

router.use(authMiddleware.protect);

router.route('/')
  .get(socialController.getAlbums)
  .post(validate(albumSchema), socialController.createAlbum);

router.route('/:albumId')
  .delete(authMiddleware.restrictTo('admin'), socialController.deleteAlbum);

router.route('/:albumId/photos')
  .get(socialController.getAlbumPhotos)
  .post(validate(photoSchema), socialController.addPhoto);

router.route('/photos/:photoId')
  .delete(authMiddleware.restrictTo('admin'), socialController.deletePhoto);

router.route('/photos/:photoId/comments')
  .get(socialController.getPhotoComments)
  .post(validate(commentSchema), socialController.addComment);

module.exports = router;
