
const express = require("express");
const router = express.Router();
const { GridFSBucket } = require("mongodb");
const { getDb } = require('../Db/Db');
const mongoose = require('mongoose');
const upload = require('../middlewares/pdfUpload');
const stream = require('stream');
const AssetsController = require('../Controllers/assets.controller');
 const UserController = require('../Controllers/user.controller'); // Add this line
 const fs = require("fs");
const path = require("path");
  // const upload = require('../middlewares/pdfUpload');
 


// Asset routes
router.post('/assets/createAsset', upload.single('certificate'), AssetsController.createAsset);
router.get('/assets/:assetsId', AssetsController.getAsset);
router.delete('/assets/:assetsId', AssetsController.deleteAsset);
router.put('/assets/update/bp/:assetsId', AssetsController.updateBP);
router.put('/assets/update/sa/:assetsId', AssetsController.updateSA);
router.put('/assets/update/infra/:assetsId', AssetsController.updateInfra);
router.put('/assets/update/ts/:assetsId', AssetsController.updateTS);
router.get('/assets/datacentre/:dataCentre', AssetsController.getAssetsByDataCentre);
router.get('/assets/by-department/:deptName', AssetsController.getAssetsByDepartment);
// router.get('/dashboard/expiring/:employeeId', AssetsController.getExpiringCertsByEmployeeId);
// router.get('/notifications/expiring-certificates', AssetsController.getExpiringCertNotifications);
// router.get("/notifications/expiring-certificates/:assetsId", AssetsController.getExpiringCertByAssetsId);

router.get("/audit-expiry-alerts/:employeeId", AssetsController.getAuditExpiryNotificationsByEmployee);

router.get("/audit-expiry-by-asset/:assetsId", AssetsController.getAuditExpiryByAssetId);
// router.get("/notifications/:employeeId", AssetsController.getNotifications);
router.get("/notifications/:employeeId", AssetsController.getNotificationByEmployeeId);
router.get("/audit-expiry/:employeeId", AssetsController.getAuditExpiryForUser);

router.get("/view-va-report/:filename", (req, res) => {
  const filename = decodeURIComponent(req.params.filename);
  const filePath = path.join(__dirname, "..", "uploads", filename);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: "File not found" });
  }

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `inline; filename="${filename}"`);

  const fileStream = fs.createReadStream(filePath);
  fileStream.pipe(res);

  fileStream.on("error", (err) => {
    console.error("File stream error:", err);
    res.status(500).json({ error: "Error reading the file" });
  });
});


// Verification endpoint


  
  // module.exports = router;

// User routes
router.post('/users/login', UserController.login);
router.post('/users/logout', UserController.logout);
router.post('/users/register', UserController.register);
router.put('/users/change-password', UserController.changePassword);

// Dashboard routes
router.get('/dashboard/dataSio', AssetsController.getDashboardAllProjectBySIO);
router.get('/dashboard/projectDetails/:projectName', AssetsController.getProjectDetailsByName);
router.get('/dashboard/by-type/:employeeId', AssetsController.getDashboardByType);
router.put('/assets/update/by-project-name/:projectName', upload.single('certificate'), AssetsController.updateAssetByProjectName);

// Filter routes
// router.get('/dashboard/filter/department/:deptName', AssetsController.filterByDepartment);
// router.get('/dashboard/filter/department/:deptName/employee/:employeeId', AssetsController.filterByDepartment);
// router.get('/dashboard/department/filter', AssetsController.filterByDepartment);
// router.get('/dashboard/filter/department/:deptName/employee/:employeeId',AssetsController.filterByDepartment);
router.get('/dashboard/filter/department/:deptName/employee/:employeeId', AssetsController.filterByDepartment);

router.get('/dashboard/filter/datacenter/:dataCenter', AssetsController.filterByDataCenter);
router.get('/dashboard/filter/prismid/:prismId', AssetsController.filterByPrismId);



// ✅ Upload VA Report (Disk Storage)
router.post("/upload-va-report", upload.single("vaReport"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    res.status(201).json({
      message: "VA Report uploaded successfully",
      filename: req.file.filename,
      path: req.file.path,
    });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ error: "Upload failed", details: err.message });
  }
});



router.post("/upload-va-report", upload.single("vaReport"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });
  res.status(201).json({ filename: req.file.filename });
});
router.get("/va-reports/:filename", (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, "..", "uploads", filename);
  res.sendFile(filePath, (err) => {
    if (err) {
      console.error("File not found:", filename);
      res.status(404).send("File not found");
    }
  });
});

// View certificate
router.get("/view-certificate/:filename", (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, "..", "uploads", filename); // or GridFS stream
  res.sendFile(filePath);
});

// View VA report
router.get("/view-va-report/:filename", (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, "..", "uploads", filename);
  res.sendFile(filePath);
});


router.get('/va-reports/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, '..', 'uploads', filename); // ← Make sure path is correct

  res.sendFile(filePath, (err) => {
    if (err) {
      console.error("File not found:", filename);
      res.status(404).send("File not found");
    }
  });
});

router.post('/addprojectbyhod',AssetsController.assignHodProject);

router.get('/projectsAssignedByHOD/:employeeId',AssetsController.getProjectManagersAssignedByHOD);
router.get('/allProjectManagers', AssetsController.getAllProjectManagers);

router.get("/project-assignments/:empCode", AssetsController.getProjectAssignData);
router.get("/project-assignments/by-pm/:empCode", AssetsController.getProjectsAssignedToPM);
router.get("/databases", AssetsController.getDatabaseList);


module.exports = router;





