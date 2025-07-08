const express = require("express");
const router = express.Router();
const {getDb} = require('../Db/Db'); // Ensure this is correctly imported
const AssetsController = require('../Controllers/assets.controller');
const UserController = require('../Controllers/user.controller'); // Add this line
const upload = require('../middlewares/pdfUpload');
  const { GridFSBucket } = require("mongodb");

// router.post('/assets/createAsset', AssetsController.createAsset);
router.post('/assets/createAsset', upload.single('certificate'), AssetsController.createAsset);
router.get('/assets/:assetsId', AssetsController.getAsset);
router.delete('/assets/:assetsId', AssetsController.deleteAsset);
router.put('/assets/update/bp/:assetsId', AssetsController.updateBP);
router.put('/assets/update/sa/:assetsId', AssetsController.updateSA);
router.put('/assets/update/infra/:assetsId', AssetsController.updateInfra);
router.put('/assets/update/ts/:assetsId', AssetsController.updateTS);
router.get('/assets/datacentre/:dataCentre', AssetsController.getAssetsByDataCentre);
router.get('/assets/by-department/:deptName', AssetsController.getAssetsByDepartment);
router.get('/dashboard/expiring/:employeeId', AssetsController.getExpiringCertsByEmployeeId);
router.get('/notifications/expiring-certificates', AssetsController.getExpiringCertNotifications);
router.get("/notifications/latest",AssetsController.getLatestNotifications);
router.get("/notifications/all",AssetsController.getAllNotifications);
router.post("/notifications/:id/read",AssetsController.markNotificationRead);

// 🔽 Upload PDF to MongoDB
router.post("/upload-certificate", upload.single("certificate"), async (req, res) => {
    try {
      const db = getDb();
      const bucket = new GridFSBucket(db, { bucketName: "certificates" });
  
      const uploadStream = bucket.openUploadStream(req.file.originalname, {
        contentType: req.file.mimetype,
      });
  
      uploadStream.end(req.file.buffer);
  
      uploadStream.on("finish", () => {
        return res.status(201).json({ filename: uploadStream.filename });
      });
  
      uploadStream.on("error", (err) => {
        console.error("Upload error:", err);
        res.status(500).json({ error: "Error uploading file" });
      });
    } catch (err) {
      console.error("Error in /upload-certificate:", err);
      res.status(500).json({ error: "Server error" });
    }
  });
  
  // 🔽 View PDF from MongoDB
  router.get("/view-certificate/:filename", async (req, res) => {
    try {
      const db = getDb();
      const bucket = new GridFSBucket(db, { bucketName: "certificates" });
  
      const downloadStream = bucket.openDownloadStreamByName(req.params.filename);
  
      res.set("Content-Type", "application/pdf");
  
      downloadStream.pipe(res).on("error", (err) => {
        console.error("Stream error:", err);
        res.status(404).json({ error: "File not found" });
      });
    } catch (err) {
      console.error("Error in /view-certificate:", err);
      res.status(500).json({ error: "Server error" });
    }
  });
  // ✅ Upload VA Report PDF
router.post("/upload-va-report", upload.single("vaReport"), async (req, res) => {
  try {
    const db = getDb();
    const bucket = new GridFSBucket(db, { bucketName: "vaReports" });

    const uploadStream = bucket.openUploadStream(req.file.originalname, {
      contentType: req.file.mimetype,
    });

    uploadStream.end(req.file.buffer);

    uploadStream.on("finish", () => {
      return res.status(201).json({ filename: uploadStream.filename });
    });

    uploadStream.on("error", (err) => {
      console.error("Upload error:", err);
      res.status(500).json({ error: "Error uploading file" });
    });
  } catch (err) {
    console.error("Error in /upload-va-report:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ View VA Report PDF
router.get("/va-reports/:filename", async (req, res) => {
  try {
    const db = getDb();
    const bucket = new GridFSBucket(db, { bucketName: "vaReports" });

    const downloadStream = bucket.openDownloadStreamByName(req.params.filename);

    res.set("Content-Type", "application/pdf");
    downloadStream.pipe(res).on("error", (err) => {
      console.error("Stream error:", err);
      res.status(404).json({ error: "File not found" });
    });
  } catch (err) {
    console.error("Error in /va-reports/:filename:", err);
    res.status(500).json({ error: "Server error" });
  }
});
  
  module.exports = router;

router.post('/users/login', UserController.login);
router.post('/users/logout', UserController.logout);
router.post('/users/register', UserController.register);
router.get('/dashboard/dataSio',AssetsController.getDashboardAllProjectBySIO);
router.get('/dashboard/projectDetails/:projectName', AssetsController.getProjectDetailsByName);
router.get('/dashboard/by-type/:employeeId', AssetsController.getDashboardByType);
router.put('/users/change-password', UserController.changePassword);
router.put('/assets/update/by-project-name/:projectName', upload.single('certificate'), AssetsController.updateAssetByProjectName);

router.get('/dashboard/filter/department/:deptName', AssetsController.filterByDepartment);
router.get('/dashboard/filter/datacenter/:dataCenter', AssetsController.filterByDataCenter);
router.get('/dashboard/filter/prismid/:prismId', AssetsController.filterByPrismId);
module.exports = router;





