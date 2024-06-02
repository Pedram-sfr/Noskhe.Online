const path = require("path");
const fs = require("fs");
const multer = require("multer");
const multerS3 = require("multer-s3");
const AWS = require("aws-sdk");
require("aws-sdk/lib/maintenance_mode_message").suppress = true;
const createHttpError = require("http-errors");
function createroute(req) {
  const date = new Date();
  const year = date.getFullYear().toString();
  const month = date.getMonth().toString();
  const day = date.getDay().toString();
  const directory = path.join(
    __dirname,
    "..",
    "..",
    "..",
    "public",
    "uploads",
    req.baseUrl.split("/")[2].toString(),
    year,
    month,
    day
  );
  req.body.fileUploadPath = path.join(
    "uploads",
    req.baseUrl.split("/")[2].toString(),
    year,
    month,
    day
  );
  fs.mkdirSync(directory, { recursive: true });
  return directory;
}
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file?.originalname) {
      // console.log()
      const filePath = createroute(req);
      return cb(null, filePath);
    }
    cb(null, null);
  },
  filename: (req, file, cb) => {
    if (file.originalname) {
      const ext = path.extname(file.originalname);
      const fileName = String(new Date().getTime() + ext);
      req.body.filename = fileName;
      return cb(null, fileName);
    }
    cb(null, null);
  },
});
function fileFilter(req, file, cb) {
  const ext = path.extname(file.originalname);
  const mimetypes = [".jpeg", ".jpg", ".png", ".webp", ".gif"];

  if (mimetypes.includes(ext)) {
    return cb(null, true);
  }
  return cb(createHttpError.BadRequest("فرمت ارسال شده صحیح نمیباشد"));
}
function videoFilter(req, file, cb) {
  const ext = path.extname(file.originalname);
  const mimetypes = [".mp4", ".mkv", ".mov", ".mpg", ".avi"];

  if (mimetypes.includes(ext)) {
    return cb(null, true);
  }
  return cb(createHttpError.BadRequest("فرمت ارسال شده صحیح نمیباشد"));
}
function excelFilter(req, file, cb) {
  const ext = path.extname(file.originalname);
  const mimetypes = [".xlsx"];

  if (mimetypes.includes(ext)) {
    return cb(null, true);
  }
  return cb(createHttpError.BadRequest("فرمت ارسال شده صحیح نمیباشد"));
}

const config = {
  endpoint: process.env.LIARA_ENDPOINT,
  accessKeyId: process.env.LIARA_ACCESS_KEY,
  secretAccessKey: process.env.LIARA_SECRET_KEY,
  region: "default",
};
const s3 = new AWS.S3(config);

const maxSize = 1 * 1000 * 1000;
const upload = multer({
  storage: multerS3({
    s3,
    bucket: process.env.LIARA_BUCKET_NAME,
    key: function (req, file, cb) {
      const ext = path.extname(file.originalname);
      const fileName = String(new Date().getTime() + ext);
      file.originalname = fileName;
      req.body.filename = fileName;
      cb(null, file.originalname);
    },
  }),
  limits: { fileSize: maxSize },
  fileFilter,
});
const uploadExcel = multer({
    storage: multerS3({
      s3,
      bucket: process.env.LIARA_BUCKET_NAME,
      key: function (req, file, cb) {
        const ext = path.extname(file.originalname);
        const fileName = String(new Date().getTime() + ext);
        file.originalname = fileName;
        req.body.filename = fileName;
        cb(null, file.originalname);
      },
    }),
    limits: { fileSize: maxSize },
    excelFilter,
  });

module.exports = {
  uploadExcel,
  upload,
};
