const fs = require("fs");
const path = require("path");
const Gallery = require("../Models/gallery.Model");

// Add new gallery images (supports multiple images)
const addGalleryImage = async (req, res) => {
  try {
    const { title, description, category, feature } = req.body;

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "At least one image is required." });
    }

    const images = req.files.map((file) => file.filename);

    const newGalleryItem = new Gallery({
      title,
      description,
      category,
      feature: feature === "true",
      images,
    });

    await newGalleryItem.save();
    res.status(201).json({
      success: true,
      message: "Gallery images added successfully.",
      data: newGalleryItem,
    });
  } catch (error) {
    res.status(500).json({ message: "Error adding gallery images", error: error.message });
  }
};

// Get all images with filters and pagination
const getAllGalleryImages = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, category, sort, feature } = req.query;
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    const filter = {};

    if (search) filter.title = { $regex: search, $options: "i" };
    if (category) filter.category = category;
    if (feature) filter.feature = feature === "true";

    let sortOptions = {};
    if (sort === "latest") sortOptions = { createdAt: -1 };
    if (sort === "oldest") sortOptions = { createdAt: 1 };

    const images = await Gallery.find(filter)
      .sort(sortOptions)
      .skip((pageNumber - 1) * limitNumber)
      .limit(limitNumber);

    const totalImages = await Gallery.countDocuments(filter);

    res.status(200).json({
      success: true,
      message: "Gallery images retrieved successfully.",
      totalPages: Math.ceil(totalImages / limitNumber),
      currentPage: pageNumber,
      data: images,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching gallery images", error: error.message });
  }
};

// Get only featured images
const getFeaturedImages = async (req, res) => {
  try {
    const featuredImages = await Gallery.find({ feature: true });
    res.status(200).json({ success: true, data: featuredImages });
  } catch (error) {
    res.status(500).json({ message: "Error fetching featured images", error: error.message });
  }
};

// Toggle featured status
const toggleFeatureStatus = async (req, res) => {
  try {
    const { feature } = req.body;
    const updatedImage = await Gallery.findByIdAndUpdate(
      req.params.id,
      { feature: feature === "true" },
      { new: true }
    );

    if (!updatedImage) {
      return res.status(404).json({ message: "Image not found." });
    }

    res.status(200).json({
      success: true,
      message: `Image ${feature === "true" ? "marked as featured" : "removed from featured"}.`,
      data: updatedImage,
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating feature status", error: error.message });
  }
};

// Delete an image (removes from uploads folder too)
const deleteGalleryImage = async (req, res) => {
  try {
    const { id } = req.params;
    const image = await Gallery.findById(id);

    if (!image) return res.status(404).json({ message: "Image not found!" });

    image.images.forEach((filename) => {
      const filePath = path.join(__dirname, "../uploads", filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    });

    await Gallery.findByIdAndDelete(id);
    res.status(200).json({ message: "Image deleted successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting image", error: error.message });
  }
};

// Update gallery (supports single image replacement)
const updateGalleryImage = async (req, res) => {
  try {
    const { title, description, category, feature, existingImages } = req.body;
    const { id } = req.params;

    let gallery = await Gallery.findById(id);
    if (!gallery) {
      return res.status(404).json({ message: "Gallery not found!" });
    }

 
    if (existingImages) {
      gallery.images = existingImages.split(','); 
    }

   
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map(file => file.filename);
      gallery.images = gallery.images.concat(newImages);
    }

    gallery.title = title || gallery.title;
    gallery.description = description || gallery.description;
    gallery.category = category || gallery.category;
    gallery.feature = feature === "true";

    await gallery.save();

    res.status(200).json({
      success: true,
      message: "Gallery updated successfully.",
      data: gallery,
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating gallery", error: error.message });
  }
};

module.exports = {
  addGalleryImage,
  getAllGalleryImages,
  getFeaturedImages,
  toggleFeatureStatus,
  deleteGalleryImage,
  updateGalleryImage,
};