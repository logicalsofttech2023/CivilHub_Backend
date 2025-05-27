const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/admin");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  cb(null, true);
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

const tendorUpload = upload.fields([
  { name: "featured_image", maxCount: 1 },
  { name: "nit_document[0][nit_doc_file]", maxCount: 1 },
  { name: "nit_document[1][nit_doc_file]", maxCount: 1 },
  // Add more indices as needed (up to your maximum expected)
  { name: "pre_bid_meeting_document[0][pre_bid_doc_file]", maxCount: 1 },
  { name: "pre_bid_meeting_document[1][pre_bid_doc_file]", maxCount: 1 },
  { name: "work_item_document[0][work_item_doc_file]", maxCount: 1 },
  { name: "work_item_document[1][work_item_doc_file]", maxCount: 1 },
  { name: "corrigendum_list[0][corrigendum_doc_file]", maxCount: 1 },
  { name: "corrigendum_list[1][corrigendum_doc_file]", maxCount: 1 },
]);

module.exports = { upload, tendorUpload };
