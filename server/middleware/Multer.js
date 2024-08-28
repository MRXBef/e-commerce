import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/product-image");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "_" + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    // Check the file type
    if (file.mimetype.startsWith("image/")) {
      // Allow only images
      cb(null, true);
    } else {
      // Reject non-image files
      cb(new Error("Only image files are allowed!"), false);
      
    }
  },
});

export default upload;
