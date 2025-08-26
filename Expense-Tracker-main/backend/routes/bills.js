import { billUpload } from "../controllers/bill.js";
import { Router } from "express";
import { authenticateToken } from "../middlewares/auth.js";
import multer from "multer";
import path from "path";

const billRoute = Router();

// Configure Multer for file storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/"); // Save files to 'uploads' folder
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Rename file with timestamp
    },
});

const upload = multer({ storage: storage });

// Upload bill image and process extracted data
billRoute.route("/upload").post(authenticateToken, upload.single("billImage"), billUpload);

export default billRoute;
