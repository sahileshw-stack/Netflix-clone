const multer = require("multer");
const path = require("path");
const fs = require("fs");

const uploadFolder = path.join(
  __dirname,
  "../uploads/movies"
);

if (!fs.existsSync(uploadFolder)) {
  fs.mkdirSync(uploadFolder, {
    recursive: true,
  });
}

const storage = multer.diskStorage({
  destination: function (
    req,
    file,
    cb
  ) {
    cb(null, uploadFolder);
  },

  filename: function (
    req,
    file,
    cb
  ) {
    const uniqueName =
      Date.now() +
      "-" +
      Math.round(
        Math.random() * 1e9
      );

    cb(
      null,
      uniqueName +
        path.extname(
          file.originalname
        )
    );
  },
});

const fileFilter = function (
  req,
  file,
  cb
) {
  if (
    file.mimetype.startsWith(
      "image/"
    ) ||
    file.mimetype.startsWith(
      "video/"
    )
  ) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Only image and video files are allowed"
      ),
      false
    );
  }
};

const movieUpload = multer({
  storage,
  fileFilter,

  limits: {
    fileSize:
      200 * 1024 * 1024,
  },
});

module.exports = movieUpload;