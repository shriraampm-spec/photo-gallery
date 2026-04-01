const express = require('express');
const {
  getPhotos,
  getPhotoById,
  createPhoto,
  updatePhoto,
  deletePhoto,
} = require('../controllers/photoController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

const router = express.Router();

router.route('/').get(protect, getPhotos).post(protect, upload.single('image'), createPhoto);
router
  .route('/:id')
  .get(protect, getPhotoById)
  .put(protect, upload.single('image'), updatePhoto)
  .delete(protect, deletePhoto);

module.exports = router;
