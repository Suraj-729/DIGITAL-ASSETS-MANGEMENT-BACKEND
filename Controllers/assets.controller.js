const AssetsModel = require("../Models/assets.model");
const { getDb } = require("../Db/Db");
const moment = require("moment");
const { ObjectId } = require("mongodb");



async function createAsset(req, res) {
  try {
  const BP = JSON.parse(req.body.BP);
  const SA = JSON.parse(req.body.SA);
  const TS = JSON.parse(req.body.TS);
  const Infra = JSON.parse(req.body.Infra);

  if (req.file) {
    SA.certificate = req.file.originalname;
  }

  const assetId = await AssetsModel.createAsset({
    // assetId,
    BP,
    SA,
    TS,
    Infra,
    certificate: req.file || null,
  });

  return res.status(201).json({ message: "Asset created", assetId });
} catch (err) {
  console.error("Error in createAsset:", err);
  console.log("Request body:", req.body); // 👈 Debug what was received
  return res.status(500).json({ error: "Error creating asset", details: err.message });
}
}


async function getAsset(req, res) {
  try {
    const { assetsId } = req.params;
    const db = getDb();
    const asset = await db.collection("Assets").findOne({ assetsId });

    if (!asset) return res.status(404).json({ error: "Asset not found" });

    res.status(200).json({
      BP: asset.BP,
      SA: asset.SA,
      Infra: asset.Infra,
      TS: asset.TS,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to get asset" });
  }
}

async function deleteAsset(req, res) {
  try {
    const { assetsId } = req.params;
    const db = getDb();
    const result = await db.collection("Assets").deleteOne({ assetsId });

    if (result.deletedCount === 0)
      return res.status(404).json({ error: "Asset not found" });

    res.status(200).json({ message: "Asset deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete asset" });
  }
}

// Update BP section
async function updateBP(req, res) {
  const db = getDb();
  const { assetsId } = req.params;
  const data = req.body;

  try {
    const result = await db.collection("Assets").updateOne(
      { assetsId },
      {
        $set: {
          "BP.name": data.name,
          "BP.prismId": data.prismId,
          "BP.deptName": data.deptname,
          "BP.url": data.url,
          "BP.publicIp": data.public_ip,
          "BP.nodalOfficerNIC": {
            name: data.nodalofficerNIC.Name,
            empCode: data.nodalofficerNIC.Emp_code,
            mobile: data.nodalofficerNIC.Mob,
            email: data.nodalofficerNIC.Email,
          },
          "BP.nodalOfficerDept": {
            name: data.nodalofficerDept.Name,
            designation: data.nodalofficerDept.Designation,
            mobile: data.nodalofficerDept.Mob,
            email: data.nodalofficerDept.Email,
          },
        },
      }
    );
    res
      .status(200)
      .json({
        message: "BP section updated",
        modifiedCount: result.modifiedCount,
      });
  } catch (err) {
    res.status(500).json({ error: "Update BP failed", details: err.message });
  }
}

async function updateSA(req, res) {
  const db = getDb();
  const { assetsId } = req.params;
  const data = req.body;

  try {
    const result = await db.collection("Assets").updateOne(
      { assetsId },
      {
        $set: {
          "SA.typeOfAudit": data.typeofaudit,
          "SA.auditDate": new Date(data.auditDate),
          "SA.auditingAgency": data.auditingahency,
          "SA.certificate": data.certi,
          "SA.sslLabScore": data.ssllabscore,
          "SA.tlsNextExpiry": new Date(data.tlsnextexpiry),
          "SA.secondaryAudits": data.Secaudits,
        },
      }
    );
    res
      .status(200)
      .json({
        message: "SA section updated",
        modifiedCount: result.modifiedCount,
      });
  } catch (err) {
    res.status(500).json({ error: "Update SA failed", details: err.message });
  }
}

async function updateInfra(req, res) {
  const db = getDb();
  const { assetsId } = req.params;
  const data = req.body;

  try {
    const result = await db.collection("Assets").updateOne(
      { assetsId },
      {
        $set: {
          "Infra.typeOfServer": data.typeofserver,
          "Infra.location": data.location,
          "Infra.deployment": data.deployment,
          "Infra.dataCentre": data.datacentre,
          "Infra.gitURL": data.giturl,
          "Infra.ipAddress": data.ipaddress,
          "Infra.purposeOfUse": data.puposeofuse,
          "Infra.vaScore": data.vascore,
          "Infra.dateOfVA": new Date(data.dateofva),
          "Infra.additionalInfra": data.infra,
        },
      }
    );
    res
      .status(200)
      .json({
        message: "Infra section updated",
        modifiedCount: result.modifiedCount,
      });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Update Infra failed", details: err.message });
  }
}

async function updateTS(req, res) {
  const db = getDb();
  const { assetsId } = req.params;
  const data = req.body;

  try {
    const result = await db.collection("Assets").updateOne(
      { assetsId },
      {
        $set: {
          "TS.frontEnd": data.frontend,
          "TS.framework": data.framework,
          "TS.database": data.database,
          "TS.os": data.OS,
        },
      }
    );
    res
      .status(200)
      .json({
        message: "TS section updated",
        modifiedCount: result.modifiedCount,
      });
  } catch (err) {
    res.status(500).json({ error: "Update TS failed", details: err.message });
  }
}

async function getAssetsByDataCentre(req, res) {
  try {
    const db = getDb();
    const dataCentre = req.params.dataCentre; // parameter name remains dataCentre

    const assets = await db
      .collection("Assets")
      .find({ "Infra.dataCentre": dataCentre })
      .toArray();

    if (assets.length === 0) {
      return res.status(404).json({
        error: `No assets found for data centre '${dataCentre}'`,
      });
    }

    // Restructure each asset so that the returned JSON has assetsId and dataCentre at the top level
    const modifiedAssets = assets.map((asset) => {
      return {
        assetsId: asset.assetsId,
        dataCentre: asset.Infra?.dataCentre,
        BP: asset.BP,
        SA: asset.SA,
        Infra: asset.Infra,
        TS: asset.TS,
      };
    });

    return res.status(200).json(modifiedAssets);
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: "Failed to fetch assets by data centre",
      details: err.message,
    });
  }
}

async function getAssetsByDepartment(req, res) {
  try {
    const db = getDb();
    const deptName = req.params.deptName;

    console.log("Looking for deptName:", deptName);

    const assets = await db
      .collection("Assets")
      .find({
        "BP.deptName": {
          $regex: new RegExp(`^${deptName}$`, "i"),
        },
      })
      .toArray();

    console.log("Assets found:", assets.length); // debug line

    if (!assets.length) {
      return res
        .status(404)
        .json({ error: `No assets found for department '${deptName}'` });
    }

    const modifiedAssets = assets.map((asset) => {
      return {
        assetsId: asset.assetsId,
        deptName: asset.BP.deptName,
        BP: asset.BP,
        SA: asset.SA,
        Infra: asset.Infra,
        TS: asset.TS,
      };
    });

    res.status(200).json(modifiedAssets);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({
        error: "Failed to fetch assets by department",
        details: err.message,
      });
  }
}

async function getDashboardAllProjectBySIO(req, res) {
  try {
    const db = getDb();
    
    const pipeline = [
      {
        $project: {
          _id: 0,
          assetsId: 1,
          prismId: "$BP.prismId",
          HOD: "$BP.HOD",
          deptName: "$BP.deptName",
          projectName: "$BP.name",
          securityAudits: "$SA.securityAudit"
        }
      },
      {
        $unwind: {
          path: "$securityAudits",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $project: {
          assetsId: 1,
          prismId: 1,
          HOD: 1,
          deptName: 1,
          projectName: 1,
          auditDate: "$securityAudits.auditDate",
          expireDate: "$securityAudits.expireDate",
          tlsNextExpiry: "$securityAudits.tlsNextExpiry",
          sslLabScore: "$securityAudits.sslLabScore"
        }
      },
      {
        $sort: {
          expireDate: 1
        }
      }
    ];

    const dashboardData = await db.collection("Assets").aggregate(pipeline).toArray();

    if (!dashboardData.length) {
      return res.status(404).json({ 
        error: "No projects found for dashboard" 
      });
    }

    res.status(200).json(dashboardData);

  } catch (err) {
    console.error("Error in getDashboardAllProjectBySIO:", err);
    res.status(500).json({ 
      error: "Failed to fetch dashboard data", 
      details: err.message 
    });
  }
}


async function getProjectDetailsByName(req, res) {
  try {
    const db = getDb();
    const { projectName } = req.params;

    if (!projectName) {
      return res.status(400).json({ error: "Project name is required" });
    }

    const project = await db.collection("Assets").findOne(
      { "BP.name": { $regex: new RegExp(`^${projectName}$`, "i") } },
      {
        projection: {
          _id: 0,
          assetsId: 1,
          BP: 1,
          SA: 1,
          Infra: 1,
          TS: 1,
          createdAt: 1
        }
      }
    );

    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    // Format the response to match your document structure
    const response = {
      assetsId: project.assetsId,
      projectName: project.BP.name,
      BP: {
        prismId: project.BP.prismId,
        deptName: project.BP.deptName,
        url: project.BP.url,
        publicIp: project.BP.publicIp,
        HOD: project.BP.HOD,
        nodalOfficerNIC: project.BP.nodalOfficerNIC || null,
        nodalOfficerDept: project.BP.nodalOfficerDept || null
      },
      SA: {
        securityAudit: project.SA.securityAudit || []
      },
      Infra: {
        typeOfServer: project.Infra.typeOfServer || null,
        location: project.Infra.location || null,
        deployment: project.Infra.deployment || null,
        dataCentre: project.Infra.dataCentre || null,
        gitUrls: project.Infra.gitUrls || [],
        vaRecords: project.Infra.vaRecords || [],
        additionalInfra: project.Infra.additionalInfra || []
      },
      TS: {
        frontend: project.TS.frontend || [],
        framework: project.TS.framework || null,
        database: project.TS.database || [],
        os: project.TS.os || [],
        osVersion: project.TS.osVersion || [],
        repoUrls: project.TS.repoUrls || []
      },
      createdAt: project.createdAt
    };

    res.status(200).json(response);
  } catch (error) {
    console.error("Error in getProjectDetailsByName:", error);
    res.status(500).json({ 
      error: "Failed to fetch project details",
      details: error.message 
    });
  }
}

// async function 



 async function getDashboardByType(req, res) {
  try {
    const db = getDb();
    const employeeId = req.params.employeeId || (req.user && req.user.employeeId);
    const employeeType = req.query.employeeType || (req.user && req.user.employeeType);
    const name = req.query.name || (req.user && req.user.name);

    if (!employeeId || !employeeType) {
      return res.status(400).json({ error: "employeeId and employeeType are required" });
    }

    let matchStage = {};

    if (employeeType === "Admin" && /^ADMINNIC-\d+$/.test(employeeId)) {
      matchStage = {};
    } else if (employeeType === "HOD" && /^HODNIC-\d+$/.test(employeeId)) {
      matchStage = { "BP.employeeId": employeeId };
    } else if (employeeType === "ProjectManager" && /^PMNIC-\d+$/.test(employeeId)) {
      matchStage = { "BP.employeeId": employeeId };
    } else {
      return res.status(403).json({ error: "Unauthorized" });
    }

    const pipeline = [
      { $match: matchStage },
      {
        $project: {
          _id: 0,
          assetsId: 1,
          projectName: "$BP.name",
          prismId: "$BP.prismId",
          deptName: "$BP.deptName",
          HOD: "$BP.HOD",
          employeeId: "$BP.employeeId",
          securityAudits: "$SA.securityAudit",
          dataCentre: "$Infra.dataCentre",
          createdAt: 1
        }
      },
      { $unwind: { path: "$securityAudits", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          assetsId: 1,
          projectName: 1,
          prismId: 1,
          deptName: 1,
          HOD: 1,
          employeeId: 1,
          auditDate: "$securityAudits.auditDate",
          expireDate: "$securityAudits.expireDate",
          tlsNextExpiry: "$securityAudits.tlsNextExpiry",
          sslLabScore: "$securityAudits.sslLabScore",
          certificate: "$securityAudits.certificate",
          auditStatus: "$securityAudits.auditStatus",   // <-- Add this line
          sslStatus: "$securityAudits.sslStatus",       // <-- Add this line
          dataCentre: 1,
          createdAt: 1
        }
      },
      { $sort: { expireDate: 1 } }
    ];

    const dashboardData = await db.collection("Assets").aggregate(pipeline).toArray();

    if (!dashboardData.length) {
      return res.status(404).json({ error: "No assets found for your role" });
    }

    res.status(200).json(dashboardData);
  } catch (err) {
    console.error("Error in getDashboardByType:", err);
    res.status(500).json({ error: "Failed to fetch dashboard data", details: err.message });
  }
}

async function updateAssetByProjectName(req, res) {
  try {
    const { projectName } = req.params;
    if (!projectName) {
      return res.status(400).json({ error: "Project name is required" });
    }

    const BP = JSON.parse(req.body.BP);
    const SA = JSON.parse(req.body.SA);
    const TS = JSON.parse(req.body.TS);
    const Infra = JSON.parse(req.body.Infra);

    if (req.file) {
      SA.certificate = req.file.originalname;
    }

    const db = getDb();
    const result = await db.collection("Assets").updateOne(
      { "BP.name": { $regex: new RegExp(`^${projectName}$`, "i") } },
      {
        $set: {
          BP,
          SA,
          TS,
          Infra,
          certificate: req.file || null,
        }
      }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: "Asset not found for this project name" });
    }

    res.status(200).json({ message: "Asset updated successfully", modifiedCount: result.modifiedCount });
  } catch (err) {
    console.error("Error in updateAssetByProjectName:", err);
    res.status(500).json({ error: "Error updating asset", details: err.message });
  }
}

async function getExpiringCertNotifications(req, res) {
  const db = getDb();
  const today = new Date();
  const WARNING_DAYS = 30;

  try {
    const notifications = [];

    const assets = await db.collection("Assets").find({}).toArray();

    for (const asset of assets) {
      const empId = asset?.BP?.employeeId;
      if (!empId) continue;

      const user = await db.collection("Users").findOne({ employeeId: empId });
      if (!user || !user.userId) continue;

      for (const audit of asset?.SA?.securityAudit || []) {
        const expiry = audit.tlsNextExpiry || audit.expireDate;
        if (!expiry) continue;

        const daysLeft = moment(expiry).diff(moment(today), "days");
        if (daysLeft <= WARNING_DAYS && daysLeft >= 0) {
          notifications.push({
            assetName: asset.BP.name,
            projectName: asset.BP.name, // 👈 used by frontend
            prismId: asset.BP.prismId,
            employeeId: empId,
            daysLeft,
            expireDate: moment(expiry).format("DD-MMM-YYYY"),
            message: `SSL/TLS certificate will expire on ${moment(expiry).format("DD-MMM-YYYY")}`,
          });
        }
      }
    }

    res.status(200).json({ notifications });
  } catch (err) {
    console.error("Notification Fetch Error:", err);
    res.status(500).json({ error: "Failed to fetch notifications" });
  }
}





// GET notifications about expiring certificates
async function getExpiringCertNotifications(req, res) {
  const db = getDb();
  const today = new Date();
  const WARNING_DAYS = 30;

  try {
    const notifications = [];

    const assets = await db.collection("Assets").find({}).toArray();

    for (const asset of assets) {
      const empId = asset?.BP?.employeeId;
      if (!empId) continue;

      const user = await db.collection("Users").findOne({ employeeId: empId });
      if (!user || !user.userId) continue;

      for (const audit of asset?.SA?.securityAudit || []) {
        const expiry = audit.tlsNextExpiry || audit.expireDate;
        if (!expiry) continue;

        const daysLeft = moment(expiry).diff(moment(today), "days");
        if (daysLeft <= WARNING_DAYS && daysLeft >= 0) {
          notifications.push({
            assetName: asset.BP.name,
            projectName: asset.BP.name, // 👈 used by frontend
            prismId: asset.BP.prismId,
            employeeId: empId,
            daysLeft,
            expireDate: moment(expiry).format("DD-MMM-YYYY"),
            message: `SSL/TLS certificate will expire on ${moment(expiry).format("DD-MMM-YYYY")}`,
          });
        }
      }
    }

    res.status(200).json({ notifications });
  } catch (err) {
    console.error("Notification Fetch Error:", err);
    res.status(500).json({ error: "Failed to fetch notifications" });
  }
}
// async function getExpiringCertNotifications(req, res) {
//   const db = getDb();
//   const today = new Date();
//   const WARNING_DAYS = 30;

//   try {
//     const assets = await db.collection("Assets").find({}).toArray();

//     for (const asset of assets) {
//       const empId = asset?.BP?.employeeId;
//       if (!empId) continue;

//       const user = await db.collection("Users").findOne({ employeeId: empId });
//       if (!user || !user.userId) continue;

//       for (const audit of asset?.SA?.securityAudit || []) {
//         const expiry = audit.tlsNextExpiry || audit.expireDate;
//         if (!expiry) continue;

//         const daysLeft = moment(expiry).diff(moment(today), "days");
//         if (daysLeft <= WARNING_DAYS && daysLeft >= 0) {
//           const expireDateStr = moment(expiry).format("DD-MMM-YYYY");

//           // Check if same notification already exists
//           const existing = (user.notifications || []).some(n =>
//             n.assetName === asset.BP.name &&
//             n.expireDate === expireDateStr &&
//             !n.read
//           );
//           if (existing) continue;

//           // Create notification object
//           const notification = {
//             _id: new ObjectId(),
//             assetName: asset.BP.name,
//             projectName: asset.BP.name,
//             prismId: asset.BP.prismId,
//             employeeId: empId,
//             read: false,
//             type: daysLeft <= 7 ? "critical" : "warning", // or use your own logic
//             createdAt: new Date(),
//             expireDate: expireDateStr,
//             message: `SSL/TLS certificate will expire on ${expireDateStr}`,
//           };

//           // Push to user.notifications
//           await db.collection("Users").updateOne(
//             { employeeId: empId },
//             { $push: { notifications: notification } }
//           );
//         }
//       }
//     }

//     res.status(200).json({ message: "Expiry notifications synced to user accounts" });
//   } catch (err) {
//     console.error("Notification Fetch Error:", err);
//     res.status(500).json({ error: "Failed to fetch notifications" });
//   }
// }


async function getExpiringCertsByEmployeeId(req, res) {
  try {
    const db = getDb();
    const { employeeId } = req.params;
    const WARNING_DAYS = 30;
    const today = new Date();

    const assets = await db
      .collection("Assets")
      .find({ "BP.nodalOfficerNIC.empCode": employeeId })
      .toArray();

    const expiring = [];

    assets.forEach((asset) => {
      (asset.SA?.securityAudit || []).forEach((audit) => {
        const expiry = audit.tlsNextExpiry || audit.expireDate;
        if (!expiry) return;
        const daysLeft = moment(expiry).diff(moment(today), "days");
        if (daysLeft <= WARNING_DAYS && daysLeft >= 0) {
          expiring.push({
            assetsId: asset.assetsId,
            projectName: asset.BP.name,
            prismId: asset.BP.prismId,
            expiry,
            daysLeft
          });
        }
      });
    });

    res.json({ employeeId, total: expiring.length, expiring });
  } catch (err) {
    console.error("getExpiringCertsByEmployeeId:", err);
    res.status(500).json({ error: "Failed to fetch expiry data", details: err.message });
  }
}

// GET newest unread (limit 5)
// async function getLatestNotifications(req, res) {
//   const db = getDb();
//   const { employeeId } = req.session.user;        // from login session

//   const user = await db
//     .collection("Users")
//     .findOne({ employeeId }, { projection: { notifications: 1 } });

//   const latest = (user?.notifications || [])
//     .filter(n => !n.read)
//     .sort((a, b) => b.createdAt - a.createdAt)
//     .slice(0, 5);

//   res.json(latest);
// }
async function getLatestNotifications(req, res) {
  const sessionUser = req.session.user;
  if (!sessionUser || !sessionUser.employeeId) {
    return res.status(401).json({ error: "Unauthorized. Please login." });
  }

  const db = getDb();
  const { employeeId } = sessionUser;

  const user = await db.collection("Users").findOne(
    { employeeId },
    { projection: { notifications: 1 } }
  );

  const latest = (user?.notifications || [])
    .filter(n => !n.read)
    .sort((a, b) => b.createdAt - a.createdAt)
    .slice(0, 5);

  res.json(latest);
}



// GET all notifications
async function getAllNotifications(req, res) {
  const db = getDb();
  const { employeeId } = req.session.user;

  const user = await db
    .collection("Users")
    .findOne({ employeeId }, { projection: { notifications: 1 } });

  res.json(user?.notifications || []);
}

// POST mark one as read
async function markNotificationRead(req, res) {
  const db = getDb();
  const { employeeId } = req.session.user;
  const { id } = req.params;                 // notification _id

  await db.collection("Users").updateOne(
    { employeeId, "notifications._id": ObjectId(id) },
    { $set: { "notifications.$.read": true } }
  );
  res.json({ ok: true });
}


module.exports = {
  createAsset,
  getAsset,
  deleteAsset,
  updateBP,
  updateSA,
  updateInfra,
  updateTS,
  getAssetsByDataCentre,
  getAssetsByDepartment,
  getDashboardAllProjectBySIO,
  getProjectDetailsByName,
  getDashboardByType,
  updateAssetByProjectName,
  getExpiringCertNotifications,
  markNotificationRead,
  getLatestNotifications,
  getAllNotifications,
  getExpiringCertsByEmployeeId,
  // getAssetByProjectName, // Make sure this exists!
  // getAllProjects         // Make sure this exists!
};