const multer = require("multer");
const storage = multer.memoryStorage(); // or use diskStorage if you want to save files

const upload = multer({ storage });

module.exports = upload;