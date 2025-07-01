const express = require("express");
const router = express.Router();

const AssetsController = require('../Controllers/assets.controller');
const UserController = require('../Controllers/user.controller'); // Add this line
const upload = require('../middlewares/upload')
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
// router.get('/assets/project/:projectName', AssetsController.getAssetByProjectName);
// router.get('/assets/all-projects', AssetsController.getAllProjects);

// User routes
// User routes
// router.post('/users', UserController.createUser);
// router.get('/users/verify-email', UserController.verifyEmail);
// router.get('/users/:email', UserController.getUserByEmail);
// router.put('/users/:email/password', UserController.updatePassword);
// router.delete('/users/:email', UserController.deleteUser);
router.post('/users/login', UserController.login);
router.post('/users/logout', UserController.logout);
router.post('/users/register', UserController.register);
router.get('/dashboard/dataSio',AssetsController.getDashboardAllProjectBySIO);
router.get('/dashboard/projectDetails/:projectName', AssetsController.getProjectDetailsByName);
router.get('/dashboard/by-type/:employeeId', AssetsController.getDashboardByType);
router.put('/users/change-password', UserController.changePassword);
router.put('/assets/update/by-project-name/:projectName', upload.single('certificate'), AssetsController.updateAssetByProjectName);
// router.post('/users/request-password-reset', UserController.requestPasswordReset);
// router.post('/users/reset-password', UserController.resetPassword);
module.exports = router;





