const AssetsModel = require("../Models/assets.model");
const { getDb } = require("../Db/Db");
const moment = require("moment");
const { ObjectId } = require("mongodb");

async function createAsset(req, res) {
  try {
    // Parse the JSON strings from multipart/form-data
    const BP = JSON.parse(req.body.BP);
    const SA = JSON.parse(req.body.SA);
    const TS = JSON.parse(req.body.TS);
    const Infra = JSON.parse(req.body.Infra);
    const TLS=JSON.parse(req.body.TLS);
    const  DR=JSON.parse(req.body.DR);

    const assetId = await AssetsModel.createAsset({
      BP,
      SA,
      TS,
      Infra,
      TLS,
      DR,
      certificate: req.file || null,
    });

    res.status(201).json({ assetId });
  } catch (err) {
    console.error("Error in createAsset:", err);
    res.status(500).json({ error: "Failed to create asset" });
  }
}

async function getAsset(req, res) {
  try {
    const { assetsId } = req.params;
    const db = getDb();
    const asset = await db.collection("Assets").findOne({ assetsId });

    if (!asset) return res.status(404).json({ error: "Asset not found" });

    res.status(200).json({
    //   BP: asset.BP,
    //   SA: asset.SA,
    //   Infra: asset.Infra,
    //   TS: asset.TS,
    //   TLS: {
    //     tlsInfo: asset.TLS ? Object.values(asset.TLS) : []
    //   }, 
    //    DR: asset.DR
    // });
    BP: asset.BP || {},
    SA: asset.SA || {},
    Infra: asset.Infra || {},
    TS: asset.TS || {},
    TLS: {
      tlsInfo: asset.TLS ? Object.values(asset.TLS) : []
    },
    DR: asset.DR || {}
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
    res.status(200).json({
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
    res.status(200).json({
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
    res.status(200).json({
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
    res.status(200).json({
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
    res.status(500).json({
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
          securityAudits: "$SA.securityAudit",
          tlsInfo: {
            expiryDate: "$TLS.tlsInfo.expiryDate",
          },
        },
      },
      {
        $unwind: {
          path: "$securityAudits",
          preserveNullAndEmptyArrays: true,
        },
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
          tlsNextExpiry: "$tlsInfo.expiryDate",
          sslLabScore: "$securityAudits.sslLabScore",
        },
      },
      {
        $sort: {
          expireDate: 1,
        },
      },
    ];

    const dashboardData = await db
      .collection("Assets")
      .aggregate(pipeline)
      .toArray();

    if (!dashboardData.length) {
      return res.status(404).json({
        error: "No projects found for dashboard",
      });
    }

    res.status(200).json(dashboardData);
  } catch (err) {
    console.error("Error in getDashboardAllProjectBySIO:", err);
    res.status(500).json({
      error: "Failed to fetch dashboard data",
      details: err.message,
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
          projectName: 1,
          BP: 1,
          SA: 1,
          Infra: 1,
          TS: 1,
          DR: 1,
          TLS: 1,
          createdAt: 1,
          employeeId: 1,
        },
      }
    );

    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    // Format TLS Info
    const tlsInfo = (project.TLS?.tlsInfo || []).map((record) => ({
      domainName: record.domainName || "",
      certProvider: record.certProvider || "",
      issueDate: record.issueDate
        ? (record.issueDate instanceof Date
            ? record.issueDate.toISOString()
            : record.issueDate?.$date || record.issueDate || "")
        : "",
      expiryDate: record.expiryDate
        ? (record.expiryDate instanceof Date
            ? record.expiryDate.toISOString()
            : record.expiryDate?.$date || record.expiryDate || "")
        : "",
      certStatus: record.certStatus || "",
      score: record.score || "",
      procuredFrom: record.procuredFrom || "",
    }));

    // Format DR VA Records
    const drVaRecords = (project.DR?.vaRecords || []).map((record) => ({
      ipAddress: record.ipAddress || "",
      dbServerIp: record.dbServerIp || "",
      purpose: record.purpose || "",
      vaScore: record.vaScore || "",
      dateOfVA: record.dateOfVA || record.vaDate
        ? ((record.dateOfVA || record.vaDate) instanceof Date
            ? (record.dateOfVA || record.vaDate).toISOString()
            : (record.dateOfVA || record.vaDate)?.$date || record.dateOfVA || record.vaDate || "")
        : "",
      vaReport:
        typeof record.vaReport === "string"
          ? record.vaReport
          : record.vaReport?.filename || "",
    }));

    // Format Infra VA Records
    const infraVaRecords = (project.Infra?.vaRecords || []).map((record) => ({
      ipAddress: record.ipAddress || "",
      dbServer: record.dbServer || "",
      purposeOfUse: record.purposeOfUse || "",
      
      vaScore: record.vaScore || "",
      dateOfVA: record.dateOfVA
        ? (record.dateOfVA instanceof Date
            ? record.dateOfVA.toISOString()
            : record.dateOfVA?.$date || record.dateOfVA || "")
        : "",
      vaReport:
        typeof record.vaReport === "string"
          ? record.vaReport
          : record.vaReport?.filename || "",
    }));

    const response = {
      assetsId: project.assetsId || "",
      projectName: project.projectName || project.BP?.name || "",
      BP: {
        prismId: project.BP?.prismId || "",
        deptName: project.BP?.deptName || "",
        employeeId: project.BP?.employeeId || project.employeeId || "",
        url: project.BP?.url || "",
        publicIp: project.BP?.publicIp || "",
        HOD: project.BP?.HOD || "",
        nodalOfficerNIC: project.BP?.nodalOfficerNIC || {
          name: "",
          empCode: "",
          mobile: "",
          email: "",
        },
        nodalOfficerDept: project.BP?.nodalOfficerDept || {
          name: "",
          designation: "",
          mobile: "",
          email: "",
        },
      },
      SA: {
        securityAudit: (project.SA?.securityAudit || []).map((audit) => ({
          ...audit,
          auditDate: audit.auditDate
            ? (audit.auditDate instanceof Date
                ? audit.auditDate.toISOString()
                : audit.auditDate?.$date || audit.auditDate || "")
            : "",
          expireDate: audit.expireDate
            ? (audit.expireDate instanceof Date
                ? audit.expireDate.toISOString()
                : audit.expireDate?.$date || audit.expireDate || "")
            : "",
        })),
      },
      Infra: {
        typeOfServer: project.Infra?.typeOfServer || "",
        location: project.Infra?.location || "",
        antivirus: project.Infra?.antivirus || "",
        deployment: project.Infra?.deployment || "",
        dataCentre: project.Infra?.dataCentre || "",
        gitUrls: project.Infra?.gitUrls || [],
        vaRecords: infraVaRecords,
        additionalInfra: project.Infra?.additionalInfra || [],
      },
      TS: {
        frontend: project.TS?.frontend || [],
        framework: project.TS?.framework || [],
        database: project.TS?.database || [],
        os: project.TS?.os || [],
        osVersion: project.TS?.osVersion || [],
        repoUrls: project.TS?.repoUrls || [],
      },
      TLS: {
        tlsInfo,
      },
      DR: {
        location: project.DR?.location || project.DR?.location || "",
        antivirus: project.DR?.antivirus || "",
        // drStatus: project.DR?.drStatus || "",
        // lastDrTestDate: project.DR?.lastDrTestDate
        //   ? (project.DR.lastDrTestDate instanceof Date
        //       ? project.DR.lastDrTestDate.toISOString()
        //       : project.DR.lastDrTestDate?.$date || project.DR.lastDrTestDate || "")
        //   : "",
        // remarks: project.DR?.remarks || "",
        serverType: project.DR?.serverType || "",
        dataCentre: project.DR?.dataCentre || "",
        deployment: project.DR?.deployment || "",
        gitUrls: project.DR?.gitUrls || [],
        vaRecords: drVaRecords,
      },
      createdAt: project.createdAt
        ? (project.createdAt instanceof Date
            ? project.createdAt.toISOString()
            : project.createdAt?.$date || project.createdAt || "")
        : "",
    };

    res.status(200).json(response);
  } catch (error) {
    console.error("Error in getProjectDetailsByName:", error);
    res.status(500).json({
      error: "Failed to fetch project details",
      details: error.message,
    });
  }
}



async function getDashboardByType(req, res) {
  try {
    const db = getDb();
    const employeeId =
      req.params.employeeId || (req.user && req.user.employeeId);
    const employeeType =
      req.query.employeeType || (req.user && req.user.employeeType);
    const name = req.query.name || (req.user && req.user.name);

    if (!employeeId || !employeeType) {
      return res
        .status(400)
        .json({ error: "employeeId and employeeType are required" });
    }

    let matchStage = {};



    if (employeeType === "Admin" && /^\d{4}$/.test(employeeId)) {
      matchStage = {}; // Admin sees everything
    } else if (employeeType === "HOD" && /^\d{4}$/.test(employeeId)) {
      matchStage = { "BP.employeeId": employeeId };
    } else if (employeeType === "PM" && /^\d{4}$/.test(employeeId)) {
      matchStage = { "BP.nodalOfficerNIC.empCode": employeeId };
    } else {
      return res
        .status(403)
        .json({ error: "Unauthorized: Invalid employeeId or employeeType" });
    }


    const pipeline = [
      // Match documents based on role
      { $match: matchStage },

      // Unwind each securityAudit entry into a flat document
      {
        $unwind: {
          path: "$SA.securityAudit",
          preserveNullAndEmptyArrays: false
        }
      },

      // Project necessary fields, include both dates
      {
        $project: {
          _id: 0,
          assetsId: 1,
          projectName: "$BP.name",
          prismId: "$BP.prismId",
          deptName: "$BP.deptName",
          HOD: "$BP.HOD",
          employeeId: "$BP.employeeId",
          auditDate: "$SA.securityAudit.auditDate",
          expireDate: "$SA.securityAudit.expireDate",
          tlsNextExpiry: "$TLS.tlsInfo.expiryDate",
          sslLabScore: "$SA.securityAudit.sslLabScore",
          certificate: "$SA.securityAudit.certificate",
          auditStatus: "$SA.securityAudit.auditStatus",
          sslStatus: "$SA.securityAudit.sslStatus",
          dataCentre: "$Infra.dataCentre",
          createdAt: 1
        }
      },

      // Sort audits so the most recent audit appears first
      {
        $sort: {
          assetsId: 1,
          auditDate: -1,
          expireDate: -1  // tie-breaker if auditDate is same
        }
      },

      // Group by asset, keeping the first (latest) audit
      {
        $group: {
          _id: "$assetsId",
          assetsId: { $first: "$assetsId" },
          projectName: { $first: "$projectName" },
          prismId: { $first: "$prismId" },
          deptName: { $first: "$deptName" },
          HOD: { $first: "$HOD" },
          employeeId: { $first: "$employeeId" },
          auditDate: { $first: "$auditDate" },
          expireDate: { $first: "$expireDate" },
          tlsNextExpiry: { $first: "$tlsNextExpiry" },
          sslLabScore: { $first: "$sslLabScore" },
          certificate: { $first: "$certificate" },
          auditStatus: { $first: "$auditStatus" },
          sslStatus: { $first: "$sslStatus" },
          dataCentre: { $first: "$dataCentre" },
          createdAt: { $first: "$createdAt" }
        }
      },

      // Optional: Sort final output by expiry if desired
      { $sort: { expireDate: -1 } }
    ];



    const dashboardData = await db
      .collection("Assets")
      .aggregate(pipeline)
      .toArray();

    res.status(200).json(dashboardData);
  } catch (err) {
    console.error("Error in getDashboardByType:", err);
    res
      .status(500)
      .json({ error: "Failed to fetch dashboard data", details: err.message });
  }
}


async function updateAssetByProjectName(req, res) {
  try {
    const { projectName } = req.params;
    console.log("🔍 Project Name Received:", projectName);

    if (!projectName) {
      return res.status(400).json({ error: "Project name is required" });
    }

    // Parse incoming fields
    const BP = JSON.parse(req.body.BP);
    const SA = JSON.parse(req.body.SA);
    const TS = JSON.parse(req.body.TS);
    const TLS = JSON.parse(req.body.TLS);
    const DR = JSON.parse(req.body.DR);
    const Infra = JSON.parse(req.body.Infra);

    console.log("📦 Parsed BP:", BP);
    console.log("📦 Parsed SA (before array check):", SA);
    console.log("📦 Parsed TS:", TS);
    console.log("📦 Parsed Infra:", Infra);
    console.log("parsed TLS:",TLS );
    console.log("parsd DR", DR );
    
    

    // Ensure SA.securityAudit is an array
    if (SA && SA.securityAudit && !Array.isArray(SA.securityAudit)) {
      SA.securityAudit = [SA.securityAudit];
      console.log("✅ Converted SA.securityAudit to array");
    }

    // Handle certificate file upload
    if (req.file && SA.securityAudit?.length > 0) {
      SA.securityAudit[0].certificate = req.file.originalname;
      console.log("📎 Uploaded file attached to securityAudit[0]:", req.file.originalname);
    }

    const db = getDb();

    // Log final update object
    console.log("📤 Final Update Payload:", {
      BP,
      SA,
      TS,
      Infra,
      DR,
      TLS
    });

    // Update document in DB
    const result = await db.collection("Assets").updateOne(
      { "BP.name": { $regex: new RegExp(`^${projectName}$`, "i") } },
      {
        $set: {
          BP,
          SA,
          TS,
          Infra,
          TLS,
          DR
        }
      }
    );

    console.log("📊 Update Result:", result);

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: "Asset not found for this project name" });
    }

    res.status(200).json({
      message: "Asset updated successfully",
      modifiedCount: result.modifiedCount,
    });
  } catch (err) {
    console.error("❌ Error in updateAssetByProjectName:", err);
    res.status(500).json({ error: "Error updating asset", details: err.message });
  }
}

async function getOs(req, res) {
  try {
    const db = getDb(); // Your DB connection method
    const collection = db.collection("os"); // Collection name for OS data

    const data = await collection.find({}, { projection: { os: 1, version: 1, _id: 0 } }).toArray();

    if (!data.length) {
      return res.status(404).json({ message: "No OS versions found" });
    }

    res.status(200).json(data);
  } catch (err) {
    console.error("Error fetching OS versions:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
}







async function getFilteredDashboard(matchStage) {
  const db = getDb();


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
      TLS: 1,
      createdAt: 1
    }
  },
  {
    $unwind: {
      path: "$securityAudits",
      preserveNullAndEmptyArrays: true
    }
  },
  {
    $unwind: {
      path: "$TLS.tlsInfo",
      preserveNullAndEmptyArrays: true
    }
  },
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
      tlsNextExpiry: "$TLS.tlsInfo.expiryDate", // ✅ fixed
      sslLabScore: "$securityAudits.sslLabScore",
      certificate: "$securityAudits.certificate",
      auditStatus: "$securityAudits.auditStatus",
      sslStatus: "$securityAudits.sslStatus",
      dataCentre: 1,
      createdAt: 1
    }
  },
  { $sort: { expireDate: 1 } }
];

  return db.collection("Assets").aggregate(pipeline).toArray();
}

















async function assignHodProject(req, res) {
  try {
    const {
      projectName,
      employeeId,
      deptName,
      hodName,
      projectManagerName,
      empCode
    } = req.body;

    if (!projectName || !employeeId || !deptName) {
      return res.status(400).json({ error: "Required fields missing" });
    }

    const assignData = {
      projectName,
      employeeId,
      deptName,
      hodName,
      projectManagerName,
      empCode
    };

    const insertedId = await AssetsModel.assignByHOD(assignData);

    res.status(201).json({
      message: "Project assigned successfully by HOD",
      insertedId
    });

  } catch (err) {
    console.error("Error in assignHodProject:", err);
    res.status(500).json({ error: "Failed to assign project by HOD" });
  }
}



async function getProjectManagersAssignedByHOD(req, res) {
  try {
    const db = getDb();
    const hodEmployeeId = req.params.employeeId;

    if (!hodEmployeeId) {
      return res.status(400).json({ error: "HOD employeeId is required" });
    }

    // Step 1: Get HOD name from Users collection
    const hodUser = await db.collection("Users").findOne({
      employeeId: hodEmployeeId,
      employeeType: "HOD"
    });

    if (!hodUser || !hodUser.HOD) {
      return res.status(404).json({ error: "HOD not found or missing HOD name" });
    }

    const hodName = hodUser.HOD;

    // Step 2: Get empCodes of PMs assigned by this HOD from AssignedAssets
    const assignedAssets = await db.collection("AssignedAssets").find({ HOD: hodName }).toArray();

    const empCodes = [...new Set(assignedAssets.map(a => a.empCode))]; // unique empCodes

    if (empCodes.length === 0) {
      return res.status(200).json({ projectManagers: [] });
    }

    // Step 3: Fetch PM user data from Users where employeeId in empCodes and type is PM
    const projectManagers = await db.collection("Users").find({
      employeeId: { $in: empCodes },
      employeeType: "PM"
    }).toArray();

    res.status(200).json({ projectManagers });
  } catch (err) {
    console.error("Error in getProjectManagersAssignedByHOD:", err);
    res.status(500).json({ error: "Failed to retrieve project managers" });
  }
}



async function getAllProjectManagers(req, res) {
  try {
    const db = getDb();

    // Fetch only employeeId and PM name (exclude _id)
    const projectManagers = await db.collection("Users").find(
      { employeeType: "PM" },
      {
        projection: {
          employeeId: 1,
          PM: 1,
          _id: 0
        }
      }
    ).toArray();

    res.status(200).json({ projectManagers });
  } catch (err) {
    console.error("Error in getAllProjectManagers:", err);
    res.status(500).json({ error: "Failed to retrieve project managers" });
  }
}

async function getProjectAssignData(req, res) {
  try {
    const db = getDb();
    const collection = db.collection("AssignedAssets"); // Update if your collection name differs

    const { empCode } = req.params;

    if (!empCode) {
      return res.status(400).json({ message: "empCode is required" });
    }

    const result = await collection.find({ empCode }).toArray();

    if (result.length === 0) {
      return res.status(404).json({ message: "No project data found for the given empCode" });
    }

    res.status(200).json(result);
  } catch (err) {
    console.error("Error fetching project assignment data:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

const getAuditExpiryForUser = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const db = getDb();

    // ✅ Fetch user info
    const user = await db.collection("Users").findOne({ employeeId });
    if (!user) return res.status(404).json({ error: "User not found" });

    const userType = user.employeeType?.toUpperCase();
    

    // ✅ Fetch all assets
    const assets = await db.collection("Assets").find({}).toArray();
    const now = new Date();
    const notifications = [];

    for (const asset of assets) {
      const assetId = asset.assetsId?.trim();
      const bp = asset.BP || {};

      // ✅ User access type check
      const isAdmin = userType === "ADMIN";
      const isHOD = userType === "HOD" && bp.employeeId === employeeId;
      const isPM = userType === "PM" && bp?.nodalOfficerNIC?.empCode === employeeId;

      if (!isAdmin && !isHOD && !isPM) continue;

      const messages = [];

      // ✅ Latest Security Audit
      if (asset.SA?.securityAudit?.length) {
        const latestAudit = asset.SA.securityAudit.reduce((latest, current) =>
          new Date(current.expireDate) > new Date(latest.expireDate) ? current : latest
        );

        if (latestAudit) {
          const auditExpireDate = new Date(latestAudit.expireDate);
          const daysLeft = Math.ceil((auditExpireDate - now) / (1000 * 60 * 60 * 24));

          if (daysLeft < 0) {
            messages.push({
              type: "Security Audit",
              status: "Expired",
              expiredOn: auditExpireDate.toISOString().split("T")[0],
              assetId,
              message: `Security Audit expired for asset ${assetId} on ${auditExpireDate.toDateString()}`
            });
            // if u want to show notification between 7 days then change this 
          } else if (daysLeft <= 7) {
            messages.push({
              type: "Security Audit",
              status: "Expiring Soon",
              expiresIn: `${daysLeft} day(s)`,
              expireDate: auditExpireDate.toISOString().split("T")[0],
              assetId,
              message: `Security Audit for asset ${assetId} will expire in ${daysLeft} day(s) on ${auditExpireDate.toDateString()}`
            });
          }
        }
      }

      // ✅ Latest TLS Certificate
      if (asset.TLS?.tlsInfo?.length) {
        const latestTLS = asset.TLS.tlsInfo.reduce((latest, current) =>
          new Date(current.expiryDate) > new Date(latest.expiryDate) ? current : latest
        );

        if (latestTLS) {
          const tlsExpireDate = new Date(latestTLS.expiryDate);
          const daysLeftTLS = Math.ceil((tlsExpireDate - now) / (1000 * 60 * 60 * 24));

          if (daysLeftTLS < 0) {
            messages.push({
              type: "TLS Certificate",
              status: "Expired",
              expiredOn: tlsExpireDate.toISOString().split("T")[0],
              assetId,
              message: `TLS Certificate expired for asset ${assetId} on ${tlsExpireDate.toDateString()}`
            });
          } else if (daysLeftTLS <= 7) {
            messages.push({
              type: "TLS Certificate",
              status: "Expiring Soon",
              expiresIn: `${daysLeftTLS} day(s)`,
              expireDate: tlsExpireDate.toISOString().split("T")[0],
              assetId,
              message: `TLS Certificate for asset ${assetId} will expire in ${daysLeftTLS} day(s) on ${tlsExpireDate.toDateString()}`
            });
          }
        }
      }

      // ✅ Combine messages for this asset
      if (messages.length > 0) {
        notifications.push({
          assetId,
          messages
        });
      }
    }

    return res.json({
      employeeId,
      employeeType: userType,
      totalNotifications: notifications.reduce((count, notif) => count + notif.messages.length, 0),
      notifications,
    });

  } catch (err) {
    console.error("Error in getAuditExpiryForUser:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};


async function getProjectsAssignedToPM(req, res) {
  try {
    const { empCode } = req.params;
    console.log("Received empCode:", empCode); // DEBUG LOG

    if (!empCode) {
      return res.status(400).json({ message: "empCode is required" });
    }

    const db = getDb();
    const collection = db.collection("AssignedAssets");

    // Only return specific fields
    const projects = await collection
      .find({ empCode }, { projection: { projectName: 1, 
deptName: 1, HOD: 1, projectManagerName: 1, empCode: 1,
 employeeId: 1, _id: 0 } })
      .toArray();

    if (projects.length === 0) {
      return res.status(404).json({ message: "No projects found for the given empCode" });
    }

    res.status(200).json(projects);
  } catch (err) {
    console.error("Error fetching PM projects:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

async function getDatabaseList(req, res) {
  try {
    const db = getDb();
    const collection = db.collection("database"); // Your collection name

    // const data = await collection.find({ projection: { DB: 1, Version: 1,  _id: 0 } }).toArray(); // Fetch all entries
   const data = await collection.find({}, { projection: { DB: 1, Version: 1, _id: 0 } }).toArray();

    if (!data.length) {
      return res.status(404).json({ message: "No database versions found" });
    }

    res.status(200).json(data);
  } catch (err) {
    console.error("Error fetching database versions:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
}




async function filterByDataCenter(req, res) {
  try {
    const { dataCenter, employeeId, employeeType } = req.params;

    if (!dataCenter || !employeeId || !employeeType) {
      return res.status(400).json({ 
        error: "Data center name, Employee ID, and Employee Type are required." 
      });
    }

    const matchStage = {
      "Infra.dataCentre": { $regex: new RegExp(`^${dataCenter}$`, "i") }
    };

    if (employeeType === "PM") {
      matchStage["BP.nodalOfficerNIC.empCode"] = employeeId.trim();
    } else {
      matchStage["BP.employeeId"] = employeeId.trim();
    }

    const data = await getFilteredDashboard(matchStage);

    if (!data.length) {
      return res.status(404).json({ 
        error: "No assets found for this data center and employee." 
      });
    }

    res.status(200).json(data);
  } catch (error) {
    console.error("filterByDataCenter error:", error);
    res.status(500).json({ 
      error: "Internal Server Error", 
      details: error.message 
    });
  }
}









async function filterByPrismId(req, res) {
  try {
    const { prismId, employeeId, employeeType } = req.params;

    if (!prismId || !employeeId || !employeeType) {
      return res.status(400).json({ 
        error: "Prism ID, Employee ID, and Employee Type are required." 
      });
    }

    const matchStage = {
      "BP.prismId": prismId.trim()
    };

    if (employeeType === "PM") {
      matchStage["BP.nodalOfficerNIC.empCode"] = employeeId.trim();
    } else {
      matchStage["BP.employeeId"] = employeeId.trim();
    }

    const data = await getFilteredDashboard(matchStage);

    if (!data.length) {
      return res.status(404).json({ 
        error: "No assets found for this Prism ID and employee." 
      });
    }

    res.status(200).json(data);
  } catch (error) {
    console.error("filterByPrismId error:", error);
    res.status(500).json({ 
      error: "Internal Server Error", 
      details: error.message 
    });
  }
}






async function filterByDepartment(req, res) {
  try {
    const { deptName, employeeId, employeeType } = req.params;

    if (!deptName || !employeeId || !employeeType) {
      return res.status(400).json({ error: "Department name, Employee ID, and Employee Type are required." });
    }

    const matchStage = {
      "BP.deptName": deptName,
    };

    if (employeeType === "PM") {
      matchStage["BP.nodalOfficerNIC.empCode"] = employeeId;
    } else {
      matchStage["BP.employeeId"] = employeeId;
    }

    const data = await getFilteredDashboard(matchStage);

    if (!data.length) {
      return res.status(404).json({ error: "No assets found for this department and employee." });
    }

    res.status(200).json(data);
  } catch (error) {
    console.error("filterByDepartment error:", error);
    res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
}

async function getFrontend(req, res) {
  try {
    const db = getDb(); // Ensure this returns your MongoDB instance
    const collection = db.collection("frontend");

    const data = await collection.find({}, { projection: { technology: 1, version: 1, _id: 0 } }).toArray();

    if (!data.length) {
      return res.status(404).json({ message: "No frontend technologies found" });
    }

    res.status(200).json(data);
  } catch (err) {
    console.error("Error fetching frontend technologies:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
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
  
  filterByDepartment,
  filterByDataCenter,
  filterByPrismId,

 

  assignHodProject,
  getProjectManagersAssignedByHOD,
  getAllProjectManagers,
  getProjectAssignData,

  getProjectsAssignedToPM,
  getDatabaseList,

  // getAssetByProjectName, // Make sure this exists!
  // getAllProjects         // Make sure this exists!


  getAuditExpiryForUser,
  getOs,
  getFrontend

};
