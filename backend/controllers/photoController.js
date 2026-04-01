const fs = require('fs');
const path = require('path');
const Photo = require('../models/Photo');

const isValidUrl = (value) => {
  if (!value) {
    return false;
  }

  try {
    const parsed = new URL(value);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch (_error) {
    return false;
  }
};

const removeUploadedFile = (relativePath) => {
  if (!relativePath) {
    return;
  }

  const trimmed = relativePath.replace(/^\/+/, '');
  const absolutePath = path.join(__dirname, '..', trimmed);

  if (fs.existsSync(absolutePath)) {
    fs.unlinkSync(absolutePath);
  }
};

const buildPhotoPayload = (req, existingPhoto) => {
  const title = (req.body.title || existingPhoto?.title || '').trim();
  const description = (req.body.description || existingPhoto?.description || '').trim();
  const category = (req.body.category || existingPhoto?.category || '').trim();
  const captureDateValue = req.body.captureDate || existingPhoto?.captureDate;
  const inputImageUrl = (req.body.imageUrl || '').trim();
  const uploadedImagePath = req.file ? `/uploads/${req.file.filename}` : null;

  if (!title) {
    return { error: 'Title is required.' };
  }

  if (!category) {
    return { error: 'Category is required.' };
  }

  if (!captureDateValue || Number.isNaN(new Date(captureDateValue).getTime())) {
    return { error: 'A valid capture date is required.' };
  }

  let imageUrl = existingPhoto?.imageUrl || null;
  let imagePath = existingPhoto?.imagePath || null;

  if (uploadedImagePath) {
    imagePath = uploadedImagePath;
    imageUrl = null;
  } else if (inputImageUrl) {
    if (!isValidUrl(inputImageUrl)) {
      return { error: 'Please provide a valid image URL.' };
    }

    imageUrl = inputImageUrl;
    imagePath = null;
  }

  if (!imageUrl && !imagePath) {
    return { error: 'Please provide either an image URL or an uploaded image.' };
  }

  return {
    payload: {
      title,
      description,
      category,
      imageUrl,
      imagePath,
      captureDate: new Date(captureDateValue),
    },
  };
};

const getPhotos = async (req, res) => {
  try {
    const photos = await Photo.find({ owner: req.user.id }).sort({ captureDate: -1, createdAt: -1 });
    res.status(200).json(photos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getPhotoById = async (req, res) => {
  try {
    const photo = await Photo.findOne({ _id: req.params.id, owner: req.user.id });

    if (!photo) {
      return res.status(404).json({ message: 'Photo not found' });
    }

    res.status(200).json(photo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createPhoto = async (req, res) => {
  const { payload, error } = buildPhotoPayload(req);

  if (error) {
    if (req.file) {
      removeUploadedFile(`/uploads/${req.file.filename}`);
    }

    return res.status(400).json({ message: error });
  }

  try {
    const photo = await Photo.create({
      ...payload,
      owner: req.user.id,
    });

    res.status(201).json(photo);
  } catch (saveError) {
    if (req.file) {
      removeUploadedFile(`/uploads/${req.file.filename}`);
    }

    res.status(500).json({ message: saveError.message });
  }
};

const updatePhoto = async (req, res) => {
  try {
    const photo = await Photo.findOne({ _id: req.params.id, owner: req.user.id });

    if (!photo) {
      if (req.file) {
        removeUploadedFile(`/uploads/${req.file.filename}`);
      }

      return res.status(404).json({ message: 'Photo not found' });
    }

    const previousImagePath = photo.imagePath;
    const { payload, error } = buildPhotoPayload(req, photo);

    if (error) {
      if (req.file) {
        removeUploadedFile(`/uploads/${req.file.filename}`);
      }

      return res.status(400).json({ message: error });
    }

    Object.assign(photo, payload);
    const updatedPhoto = await photo.save();

    if (previousImagePath && previousImagePath !== updatedPhoto.imagePath) {
      removeUploadedFile(previousImagePath);
    }

    res.status(200).json(updatedPhoto);
  } catch (error) {
    if (req.file) {
      removeUploadedFile(`/uploads/${req.file.filename}`);
    }

    res.status(500).json({ message: error.message });
  }
};

const deletePhoto = async (req, res) => {
  try {
    const photo = await Photo.findOne({ _id: req.params.id, owner: req.user.id });

    if (!photo) {
      return res.status(404).json({ message: 'Photo not found' });
    }

    const previousImagePath = photo.imagePath;
    await photo.deleteOne();
    removeUploadedFile(previousImagePath);

    res.status(200).json({ message: 'Photo deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getPhotos,
  getPhotoById,
  createPhoto,
  updatePhoto,
  deletePhoto,
};
