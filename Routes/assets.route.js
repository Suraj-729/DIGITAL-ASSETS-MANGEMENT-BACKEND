const express = require("express");
const router = express.Router();

const AssetsController = require('../Controllers/assets.controller');
const UserController = require('../Controllers/user.controller'); // Add this line
const upload = require('../middlewares/upload')
// router.post('/assets/createAsset', AssetsController.createAsset);
router.post(
    "/assets/createAsset",
    upload.single("certificate"), // or upload.fields([...]) if multiple files
    AssetsController.createAsset
  );
router.get('/assets/:assetsId', AssetsController.getAsset);
router.delete('/assets/:assetsId', AssetsController.deleteAsset);
router.put('/assets/update/bp/:assetsId', AssetsController.updateBP);
router.put('/assets/update/sa/:assetsId', AssetsController.updateSA);
router.put('/assets/update/infra/:assetsId', AssetsController.updateInfra);
router.put('/assets/update/ts/:assetsId', AssetsController.updateTS);
router.get('/assets/datacentre/:dataCentre', AssetsController.getAssetsByDataCentre);
router.get('/assets/by-department/:deptName', AssetsController.getAssetsByDepartment);
router.get('/assets/project/:projectName', AssetsController.getAssetByProjectName);
router.get('/assets/all-projects', AssetsController.getAllProjects);

// User routes
router.post('/users', UserController.createUser);
router.get('/users/:assetsId', UserController.getUserById);
router.put('/users/:assetsId/password', UserController.updatePassword);
router.delete('/users/:assetsId', UserController.deleteUser);
router.post('/users/login', UserController.login);
router.post('/users/logout', UserController.logout);

module.exports = router;





