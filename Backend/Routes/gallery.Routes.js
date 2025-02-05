const express = require("express");
const multer = require("multer");
const {
  addGalleryImage,
  getAllGalleryImages,
  getFeaturedImages,
  toggleFeatureStatus,
  likeGalleryImage,
  addCommentToImage,
  deleteGalleryImage,
  updateGalleryImage,
} = require("../Controllers/gallery.controller");

const router = express.Router();

// Configure Multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); 
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname); 
  },
});

const upload = multer({ storage });

// Define Routes
router.post("/add", upload.array("images", 10), addGalleryImage); 
router.get("/", getAllGalleryImages);
router.get("/featured", getFeaturedImages);
router.patch("/:id/feature", toggleFeatureStatus);

router.delete("/:id", deleteGalleryImage);
router.patch("/:id", upload.array("images", 10), updateGalleryImage); 

module.exports = router;