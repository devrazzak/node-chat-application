// Dependencies
const multer = require("multer");
const path = require("path");
const createError = require("http-errors");

function uploader(subFolderPath, allowedFileTypes, maxFileSize, errMsg) {
  // File upload folder
  const uploadsFolder = `${__dirname}/../public/uploads/${subFolderPath}`;

  // Define the storage
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadsFolder);
    },
    filename: (req, file, cb) => {
      const fileExt = path.extname(file.originalname);
      const filename =
        file.originalname
          .replace(fileExt, "")
          .toLowerCase()
          .split(" ")
          .join("-") +
        "-" +
        Date.now();
      cb(null, filename + fileExt);
    },
  });

  const upload = multer({
    storage: storage,
    limits: {
      fileSize: maxFileSize,
    },
    fileFilter: (req, file, cb) => {
      if (allowedFileTypes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(createError(errMsg));
      }
    },
  });

  return upload;
}

// export module
module.exports = uploader;
