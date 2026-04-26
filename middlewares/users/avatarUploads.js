const uploader = require("../../utilities/singleUploader");

function avatarUpload(req, res, next) {
  const upload = uploader(
    "avatars",
    ["image/jpeg", "image/jpg", "image/png"],
    1000000,
    "Only .jpeg .jpg or .png allowed!",
  );

  // call the middleware function
  upload.any()(req, res, (err) => {
    if (err) {
      res.status(500).json({
        error: {
          avatar: {
            message: err.message,
          },
        },
      });
    } else {
      next();
    }
  });
}

// export module
module.exports = avatarUpload;
