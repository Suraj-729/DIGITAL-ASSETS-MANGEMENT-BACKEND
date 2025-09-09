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
    const TLS = JSON.parse(req.body.TLS);
    const DR = JSON.parse(req.body.DR);

    // Step 1: Create asset and get the actual assetsId
    const assetId = await AssetsModel.createAsset({
      BP,
      SA,
      TS,
      Infra,
      TLS,
      DR,
      certificate: req.file || null,
    });

    console.log("✅ Asset created with assetsId:", assetId);

    // Step 2: Update AssignedAssets for this PM/project
    const db = getDb();
    const updateResult = await db.collection("AssignedAssets").updateOne(
      {
        projectName: BP.name,
        empCode: BP.nodalOfficerNIC?.empCode || "",
      },
      {
        $set: {
          updatedByPM: true,
          updatedAt: new Date(),
          linkedAssetId: assetId, // <-- store actual assetsId here
        },
      }
    );

    console.log("📝 AssignedAssets update result:", updateResult);

    // Step 3: Respond with the created assetId
    res.status(201).json({ assetId });
  } catch (err) {
    console.error("❌ Error in createAsset:", err);
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
        tlsInfo: asset.TLS ? Object.values(asset.TLS) : [],
      },
      DR: asset.DR || {},
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
    console.log(`[INFO] Fetching project details for: ${projectName}`);

    if (!projectName) {
      console.warn("[WARN] Project name not provided in request");
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
      console.warn(`[WARN] Project not found: ${projectName}`);
      return res.status(404).json({ error: "Project not found" });
    }

    console.log("[INFO] Project found, formatting TLS info");
    const tlsInfo = (project.TLS?.tlsInfo || []).map((record) => ({
      domainName: record.domainName || "",
      certProvider: record.certProvider || "",
      issueDate: record.issueDate
        ? record.issueDate instanceof Date
          ? record.issueDate.toISOString()
          : record.issueDate?.$date || record.issueDate || ""
        : "",
      expiryDate: record.expiryDate
        ? record.expiryDate instanceof Date
          ? record.expiryDate.toISOString()
          : record.expiryDate?.$date || record.expiryDate || ""
        : "",
      tlsStatus: record.tlsStatus || "",
      score: record.score || "",
      procuredFrom: record.procuredFrom || "",
    }));

    console.log("[INFO] Formatting DR VA records");
    const drVaRecords = (project.DR?.vaRecords || []).map((record) => ({
      ipAddress: record.ipAddress || "",
      dbServerIp: record.dbServerIp || "",
      purpose: record.purpose || "",
      vaScore: record.vaScore || "",
      dateOfVA:
        record.dateOfVA || record.vaDate
          ? (record.dateOfVA || record.vaDate) instanceof Date
            ? (record.dateOfVA || record.vaDate).toISOString()
            : (record.dateOfVA || record.vaDate)?.$date ||
              record.dateOfVA ||
              record.vaDate ||
              ""
          : "",
      vaReport:
        typeof record.vaReport === "string"
          ? record.vaReport
          : record.vaReport?.filename || "",
    }));

    console.log("[INFO] Formatting Infra VA records");
    const infraVaRecords = (project.Infra?.vaRecords || []).map((record) => ({
      ipAddress: record.ipAddress || "",
      dbServer: record.dbServer || "",
      purposeOfUse: record.purposeOfUse || "",
      vaScore: record.vaScore || "",
      dateOfVA: record.dateOfVA
        ? record.dateOfVA instanceof Date
          ? record.dateOfVA.toISOString()
          : record.dateOfVA?.$date || record.dateOfVA || ""
        : "",
      vaReport:
        typeof record.vaReport === "string"
          ? record.vaReport
          : record.vaReport?.filename || "",
    }));

    console.log("[INFO] Building response object");
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
            ? audit.auditDate instanceof Date
              ? audit.auditDate.toISOString()
              : audit.auditDate?.$date || audit.auditDate || ""
            : "",
          expireDate: audit.expireDate
            ? audit.expireDate instanceof Date
              ? audit.expireDate.toISOString()
              : audit.expireDate?.$date || audit.expireDate || ""
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
      TLS: { tlsInfo },
      DR: {
        location: project.DR?.location || "",
        antivirus: project.DR?.antivirus || "",
        serverType: project.DR?.serverType || "",
        dataCentre: project.DR?.dataCentre || "",
        deployment: project.DR?.deployment || "",
        gitUrls: project.DR?.gitUrls || [],
        vaRecords: drVaRecords,
      },
      createdAt: project.createdAt
        ? project.createdAt instanceof Date
          ? project.createdAt.toISOString()
          : project.createdAt?.$date || project.createdAt || ""
        : "",
    };

    console.log("[INFO] Sending response");
    res.status(200).json(response);
  } catch (error) {
    console.error("[ERROR] Error in getProjectDetailsByName:", error);
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
      // Match documents according to role/criteria
      { $match: matchStage },

      // Project relevant fields and keep only the latest securityAudit and TLS info
      {
        $project: {
          _id: 0,
          assetsId: 1,
          projectName: "$BP.name",
          prismId: "$BP.prismId",
          deptName: "$BP.deptName",
          HOD: "$BP.HOD",
          employeeId: "$BP.employeeId",
          // Latest security audit
          securityAudits: {
            $slice: [
              {
                $reverseArray: {
                  $sortArray: {
                    input: "$SA.securityAudit",
                    sortBy: { auditDate: 1 },
                  },
                },
              },
              1,
            ],
          },
          // Latest TLS info
          TLS: {
            $slice: [
              {
                $reverseArray: {
                  $sortArray: {
                    input: "$TLS.tlsInfo",
                    sortBy: { expiryDate: 1 },
                  },
                },
              },
              1,
            ],
          },
          dataCentre: "$Infra.dataCentre",
          createdAt: 1,
        },
      },

      // Flatten arrays to get scalar fields for latest audit and TLS
      {
        $project: {
          assetsId: 1,
          projectName: 1,
          prismId: 1,
          deptName: 1,
          HOD: 1,
          employeeId: 1,
          auditDate: { $arrayElemAt: ["$securityAudits.auditDate", 0] },
          expireDate: { $arrayElemAt: ["$securityAudits.expireDate", 0] },
          certificate: { $arrayElemAt: ["$securityAudits.certificate", 0] },
          auditStatus: { $arrayElemAt: ["$securityAudits.auditStatus", 0] },
          sslLabScore: { $arrayElemAt: ["$securityAudits.sslLabScore", 0] },
          tlsNextExpiry: { $arrayElemAt: ["$TLS.expiryDate", 0] },
          tlsStatus: { $arrayElemAt: ["$TLS.tlsStatus", 0] },
          dataCentre: 1,
          createdAt: 1,
        },
      },

      // Optional: sort by expireDate descending
      { $sort: { expireDate: -1 } },
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



// async function updateAssetByProjectName(req, res) {
//   try {
//     const { projectName } = req.params;
//     const { userType } = req.body; // 👈 check employeeType (admin/user)

//     console.log("[INFO] Incoming update request:", {
//       projectName,
//       userType,
//     });

//     // Parse body safely
//     const BP = JSON.parse(req.body.BP || "{}");
//     const SA = JSON.parse(req.body.SA || "{}");
//     const TS = JSON.parse(req.body.TS || "{}");
//     const Infra = JSON.parse(req.body.Infra || "{}");
//     const TLS = JSON.parse(req.body.TLS || "{}");
//     const DR = JSON.parse(req.body.DR || "{}");

//     const db = getDb();

//     // ✅ Match only by projectName
//     const matchStage = {
//       "BP.name": { $regex: new RegExp(`^${projectName}$`, "i") },
//     };

//     // 🔹 Prepare updated TLS info
//     const updatedTlsInfo = (TLS.tlsInfo || []).map((record, index) => {
//       const today = new Date();
//       today.setHours(0, 0, 0, 0);

//       let tlsStatus = "N/A";
//       if (record.expiryDate) {
//         const expiry = new Date(record.expiryDate);
//         expiry.setHours(0, 0, 0, 0);
//         tlsStatus = expiry >= today ? "Valid" : "Expired";
//       }
//       return { ...record, slNo: index + 1, tlsStatus };
//     });

//     // 🔹 Update Assets collection
//     const assetsResult = await db.collection("Assets").updateOne(matchStage, {
//       $set: {
//         BP,
//         SA,
//         TS,
//         Infra,
//         TLS: { tlsInfo: updatedTlsInfo },
//         DR,
//         updatedAt: new Date(),
//       },
//     });

//     if (assetsResult.matchedCount === 0) {
//       return res.status(404).json({ error: "Asset not found" });
//     }

//     // 🔹 Sync AssignedAssets
//     let assignedUpdate = {
//       projectName: BP.name,
//       deptName: BP.deptName,
//       HOD: BP.HOD,
//       projectManagerName: BP.nodalOfficerNIC?.name || "",
//       updatedAt: new Date(),
//     };

//     if (userType === "admin") {
//       assignedUpdate.employeeId = BP.hodId; // ✅ use HOD id selected by admin
//       assignedUpdate.empCode = BP.nodalOfficerNIC?.empCode || "";
//     } else {
//       assignedUpdate.employeeId = BP.employeeId; // ✅ normal case (HOD/PM flow)
//       assignedUpdate.empCode = BP.nodalOfficerNIC?.empCode || "";
//     }

//     const assignedAssetsResult = await db
//       .collection("AssignedAssets")
//       .updateOne(
//         { projectName: { $regex: new RegExp(`^${projectName}$`, "i") } },
//         { $set: assignedUpdate }
//       );

//     res.status(200).json({
//       message: "Asset & AssignedAsset updated successfully",
//       assetsModified: assetsResult.modifiedCount,
//       assignedAssetsModified: assignedAssetsResult.modifiedCount,
//     });
//   } catch (err) {
//     console.error("[ERROR] Error updating asset:", err);
//     res.status(500).json({
//       error: "Error updating asset",
//       details: err.message,
//     });
//   }
// }


async function updateAssetByProjectName(req, res) {
  try {
    const { projectName } = req.params;
    const { userType } = req.body; // "admin", "PM", "HOD"
    const BP = JSON.parse(req.body.BP || "{}");
    const SA = JSON.parse(req.body.SA || "{}");
    const TS = JSON.parse(req.body.TS || "{}");
    const Infra = JSON.parse(req.body.Infra || "{}");
    const TLS = JSON.parse(req.body.TLS || "{}");
    const DR = JSON.parse(req.body.DR || "{}");

    console.log("[INFO] Incoming update request:", {
      projectName,
      userType,
      BP,
    });

    const db = getDb();

    // ✅ Ensure project exists by matching projectName
    const matchStage = {
      "BP.name": { $regex: new RegExp(`^${projectName}$`, "i") },
    };

    // 🔹 Prepare updated TLS info with status
    const updatedTlsInfo = (TLS.tlsInfo || []).map((record, index) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      let tlsStatus = "N/A";
      if (record.expiryDate) {
        const expiry = new Date(record.expiryDate);
        expiry.setHours(0, 0, 0, 0);
        tlsStatus = expiry >= today ? "Valid" : "Expired";
      }
      return { ...record, slNo: index + 1, tlsStatus };
    });

    // ✅ Update the Assets collection
    const assetsResult = await db.collection("Assets").updateOne(matchStage, {
      $set: {
        BP,
        SA,
        TS,
        Infra,
        TLS: { tlsInfo: updatedTlsInfo },
        DR,
        updatedAt: new Date(),
      },
    });

    if (assetsResult.matchedCount === 0) {
      return res.status(404).json({ error: "Asset not found" });
    }

    // 🔹 Prepare update for AssignedAssets
    let assignedUpdate = {
      projectName: BP.name,
      deptName: BP.deptName,
      HOD: BP.HOD,
      projectManagerName: BP.nodalOfficerNIC?.name || "",
      updatedAt: new Date(),
    };

    if (userType === "admin") {
      // ✅ Admin case: hodId must be provided
      if (!BP.hodId) {
        console.error("[ERROR] Admin submission missing hodId");
        return res.status(400).json({ error: "Employee ID is required for Admin." });
      }
      assignedUpdate.employeeId = BP.hodId;
      assignedUpdate.empCode = BP.nodalOfficerNIC?.empCode || "";
      console.log("[INFO] Admin selected employeeId:", BP.hodId);
    } else {
      // ✅ PM/HOD case: use existing employeeId
      assignedUpdate.employeeId = BP.employeeId;
      assignedUpdate.empCode = BP.nodalOfficerNIC?.empCode || "";
      console.log("[INFO] Updating for userType:", userType);
    }

    // 🔹 Update the AssignedAssets collection
    const assignedAssetsResult = await db.collection("AssignedAssets").updateOne(
      { projectName: { $regex: new RegExp(`^${projectName}$`, "i") } },
      { $set: assignedUpdate }
    );

    res.status(200).json({
      message: "Asset & AssignedAsset updated successfully",
      assetsModified: assetsResult.modifiedCount,
      assignedAssetsModified: assignedAssetsResult.modifiedCount,
    });
  } catch (err) {
    console.error("[ERROR] Error updating asset:", err);
    res.status(500).json({
      error: "Error updating asset",
      details: err.message,
    });
  }
}


async function getOs(req, res) {
  try {
    const db = getDb(); // Your DB connection method
    const collection = db.collection("os"); // Collection name for OS data

    const data = await collection
      .find({}, { projection: { os: 1, version: 1, _id: 0 } })
      .toArray();

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

  // const pipeline = [
  //   { $match: matchStage },
  //   {
  //     $project: {
  //       _id: 0,
  //       assetsId: 1,
  //       projectName: "$BP.name",
  //       prismId: "$BP.prismId",
  //       deptName: "$BP.deptName",
  //       HOD: "$BP.HOD",
  //       employeeId: "$BP.employeeId",
  //       securityAudits: "$SA.securityAudit",
  //       dataCentre: "$Infra.dataCentre",
  //       TLS: 1,
  //       createdAt: 1,
  //     },
  //   },
  //   {
  //     $unwind: {
  //       path: "$securityAudits",
  //       preserveNullAndEmptyArrays: true,
  //     },
  //   },
  //   {
  //     $unwind: {
  //       path: "$TLS.tlsInfo",
  //       preserveNullAndEmptyArrays: true,
  //     },
  //   },
  //   {
  //     $project: {
  //       assetsId: 1,
  //       projectName: 1,
  //       prismId: 1,
  //       deptName: 1,
  //       HOD: 1,
  //       employeeId: 1,
  //       auditDate: "$securityAudits.auditDate",
  //       expireDate: "$securityAudits.expireDate",
  //       tlsNextExpiry: "$TLS.tlsInfo.expiryDate", // ✅ fixed
  //       sslLabScore: "$securityAudits.sslLabScore",
  //       certificate: "$securityAudits.certificate",
  //       auditStatus: "$securityAudits.auditStatus",
  //       tlsStatus: "$TLS.tlsInfo.tlsStatus",
  //       dataCentre: 1,
  //       createdAt: 1,
  //     },
  //   },
  //   { $sort: { expireDate: 1 } },
  // ];

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
        securityAudits: {
          $slice: [
            {
              $reverseArray: {
                $sortArray: {
                  input: "$SA.securityAudit",
                  sortBy: { auditDate: 1 },
                },
              },
            },
            1,
          ],
        },
        TLS: {
          $slice: [
            {
              $reverseArray: {
                $sortArray: {
                  input: "$TLS.tlsInfo",
                  sortBy: { expiryDate: 1 },
                },
              },
            },
            1,
          ],
        },
        dataCentre: "$Infra.dataCentre",
        createdAt: 1,
      },
    },
    {
      $project: {
        assetsId: 1,
        projectName: 1,
        prismId: 1,
        deptName: 1,
        HOD: 1,
        employeeId: 1,
        auditDate: { $arrayElemAt: ["$securityAudits.auditDate", 0] },
        expireDate: { $arrayElemAt: ["$securityAudits.expireDate", 0] },
        tlsNextExpiry: { $arrayElemAt: ["$TLS.expiryDate", 0] },
        certificate: { $arrayElemAt: ["$securityAudits.certificate", 0] },
        auditStatus: { $arrayElemAt: ["$securityAudits.auditStatus", 0] },
        tlsStatus: { $arrayElemAt: ["$TLS.tlsStatus", 0] },
        dataCentre: 1,
        createdAt: 1,
      },
    },
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
      empCode,
      status, // ✅ allow status from request if provided
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
      empCode,
      status: status || "Assigned", // ✅ default status
      createdAt: new Date(), // optional: timestamp
    };

    const insertedId = await AssetsModel.assignByHOD(assignData);

    res.status(201).json({
      message: "Project assigned successfully by HOD",
      insertedId,
      status: assignData.status,
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
      employeeType: "HOD",
    });

    if (!hodUser || !hodUser.HOD) {
      return res
        .status(404)
        .json({ error: "HOD not found or missing HOD name" });
    }

    const hodName = hodUser.HOD;

    // Step 2: Get empCodes of PMs assigned by this HOD from AssignedAssets
    const assignedAssets = await db
      .collection("AssignedAssets")
      .find({ HOD: hodName })
      .toArray();

    const empCodes = [...new Set(assignedAssets.map((a) => a.empCode))]; // unique empCodes

    if (empCodes.length === 0) {
      return res.status(200).json({ projectManagers: [] });
    }

    // Step 3: Fetch PM user data from Users where employeeId in empCodes and type is PM
    const projectManagers = await db
      .collection("Users")
      .find({
        employeeId: { $in: empCodes },
        employeeType: "PM",
      })
      .toArray();

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
    const projectManagers = await db
      .collection("Users")
      .find(
        { employeeType: "PM" },
        {
          projection: {
            employeeId: 1,
            PM: 1,
            _id: 0,
          },
        }
      )
      .toArray();

    res.status(200).json({ projectManagers });
  } catch (err) {
    console.error("Error in getAllProjectManagers:", err);
    res.status(500).json({ error: "Failed to retrieve project managers" });
  }
}

async function getAllHods(req, res) {
  try {
    const db = getDb();

    // Fetch only employeeId and PM name (exclude _id)
    const projectHods = await db
      .collection("Users")
      .find(
        { employeeType: "HOD" },
        {
          projection: {
            employeeId: 1,
            HOD: 1,
            _id: 0,
          },
        }
      )
      .toArray();

    res.status(200).json({ projectHods });
  } catch (err) {
    console.error("Error in getAllProjectManagers:", err);
    res.status(500).json({ error: "Failed to retrieve project managers" });
  }
}

async function getProjectAssignDataForHOD(req, res) {
  try {
    const db = getDb();
    const collection = db.collection("AssignedAssets");

    const { employeeId } = req.params;

    if (!employeeId) {
      return res.status(400).json({ message: "employeeId is required" });
    }

    // Only return projects NOT updated by HOD
    const result = await collection.find({ employeeId }).toArray();

    if (result.length === 0) {
      return res.status(404).json({
        message: "No pending project data found for the given employeeId",
      });
    }

    res.status(200).json(result);
  } catch (err) {
    console.error("Error fetching HOD project assignment data:", err);
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
      const isPM =
        userType === "PM" && bp?.nodalOfficerNIC?.empCode === employeeId;

      if (!isAdmin && !isHOD && !isPM) continue;

      const messages = [];

      // ✅ Latest Security Audit (last added)
      if (asset.SA?.securityAudit?.length) {
        const latestAudit =
          asset.SA.securityAudit[asset.SA.securityAudit.length - 1];

        if (latestAudit?.expireDate) {
          const auditExpireDate = new Date(latestAudit.expireDate);
          const daysLeft = Math.ceil(
            (auditExpireDate - now) / (1000 * 60 * 60 * 24)
          );

          if (daysLeft < 0) {
            messages.push({
              type: "Security Audit",
              status: "Expired",
              expiredOn: auditExpireDate.toISOString().split("T")[0],
              assetId,
              message: `Security Audit expired for asset ${assetId} on ${auditExpireDate.toDateString()}`,
            });
          } else if (daysLeft <= 30) {
            messages.push({
              type: "Security Audit",
              status: "Expiring Soon",
              expiresIn: `${daysLeft} day(s)`,
              expireDate: auditExpireDate.toISOString().split("T")[0],
              assetId,
              message: `Security Audit for asset ${assetId} will expire in ${daysLeft} day(s) on ${auditExpireDate.toDateString()}`,
            });
          }
        }
      }

      // ✅ Latest TLS Certificate (last added)
      if (asset.TLS?.tlsInfo?.length) {
        const latestTLS = asset.TLS.tlsInfo[asset.TLS.tlsInfo.length - 1];

        if (latestTLS?.expiryDate) {
          const tlsExpireDate = new Date(latestTLS.expiryDate);
          const daysLeftTLS = Math.ceil(
            (tlsExpireDate - now) / (1000 * 60 * 60 * 24)
          );

          if (daysLeftTLS < 0) {
            messages.push({
              type: "TLS Certificate",
              status: "Expired",
              expiredOn: tlsExpireDate.toISOString().split("T")[0],
              assetId,
              message: `TLS Certificate expired for asset ${assetId} on ${tlsExpireDate.toDateString()}`,
            });
          } else if (daysLeftTLS <= 30) {
            messages.push({
              type: "TLS Certificate",
              status: "Expiring Soon",
              expiresIn: `${daysLeftTLS} day(s)`,
              expireDate: tlsExpireDate.toISOString().split("T")[0],
              assetId,
              message: `TLS Certificate for asset ${assetId} will expire in ${daysLeftTLS} day(s) on ${tlsExpireDate.toDateString()}`,
            });
          }
        }
      }

      // ✅ Combine messages for this asset
      if (messages.length > 0) {
        notifications.push({
          assetId,
          messages,
        });
      }
    }

    return res.json({
      employeeId,
      employeeType: userType,
      totalNotifications: notifications.reduce(
        (count, notif) => count + notif.messages.length,
        0
      ),
      notifications,
    });
  } catch (err) {
    console.error("Error in getAuditExpiryForUser:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

async function getProjectAssignData(req, res) {
  try {
    const db = getDb();
    const collection = db.collection("AssignedAssets");

    const { empCode  } = req.params;

    if (!empCode) {
      return res.status(400).json({ message: "empCode is required" });
    }

    // Only return projects NOT updated by PM
    const result = await collection
      .find({ empCode , updatedByPM:false  }) //there is part i want to work it
      .toArray();

    if (result.length === 0) {
      return res.status(404).json({
        message: "No pending project data found for the given empCode",
      });
    }

    res.status(200).json(result);
  } catch (err) {
    console.error("Error fetching project assignment data:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// Get project assignments for HOD by employeeId

// Generic function for fetching project assignments



async function getProjectsAssignedToPM(req, res) {
  try {
    const { empCode } = req.params;
    console.log("Received empCode:", empCode); // DEBUG LOG

    if (!empCode) {
      return res.status(400).json({ message: "empCode is required" });
    }

    const db = getDb();
    const collection = db.collection("AssignedAssets");

    const projects = await collection
      .find(
        { empCode }, // ✅ filter
        {
          projection: {
            projectName: 1,
            deptName: 1,
            HOD: 1,
            projectManagerName: 1,
            empCode: 1,
            employeeId: 1,
            _id: 0,
          },
        }
      )
      .toArray();

    if (projects.length === 0) {
      return res
        .status(404)
        .json({ message: "No projects found for the given empCode" });
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
    const data = await collection
      .find({}, { projection: { DB: 1, Version: 1, _id: 0 } })
      .toArray();

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

    if (!dataCenter || !employeeType) {
      return res.status(400).json({
        error: "Data center name and Employee Type are required.",
      });
    }

    const matchStage = {
      "Infra.dataCentre": { $regex: new RegExp(`^${dataCenter}$`, "i") },
    };

    if (employeeType === "PM") {
      matchStage["BP.nodalOfficerNIC.empCode"] = employeeId.trim();
    } else if (employeeType === "HOD") {
      matchStage["BP.employeeId"] = employeeId.trim();
    }
    // 👆 Notice: Admin has NO employeeId filter

    const data = await getFilteredDashboard(matchStage);

    if (!data.length) {
      return res.status(404).json({
        error: "No assets found for this data center and employee.",
      });
    }

    res.status(200).json(data);
  } catch (error) {
    console.error("filterByDataCenter error:", error);
    res.status(500).json({
      error: "Internal Server Error",
      details: error.message,
    });
  }
}

async function filterByPrismId(req, res) {
  try {
    const { prismId, employeeId, employeeType } = req.params;

    if (!prismId || !employeeId || !employeeType) {
      return res.status(400).json({
        error: "Prism ID, Employee ID, and Employee Type are required.",
      });
    }

    const matchStage = {
      "BP.prismId": prismId.trim(),
    };

    // if (employeeType === "PM") {
    //   matchStage["BP.nodalOfficerNIC.empCode"] = employeeId.trim();
    // } else {
    //   matchStage["BP.employeeId"] = employeeId.trim();
    // }
    if (employeeType === "PM") {
      matchStage["BP.nodalOfficerNIC.empCode"] = employeeId.trim();
    } else if (employeeType === "HOD") {
      matchStage["BP.employeeId"] = employeeId.trim();
    }
    // 👆 Notice: Admin has NO employeeId filter

    const data = await getFilteredDashboard(matchStage);

    if (!data.length) {
      return res.status(404).json({
        error: "No assets found for this Prism ID and employee.",
      });
    }

    res.status(200).json(data);
  } catch (error) {
    console.error("filterByPrismId error:", error);
    res.status(500).json({
      error: "Internal Server Error",
      details: error.message,
    });
  }
}

async function filterByDepartment(req, res) {
  try {
    const { deptName, employeeId, employeeType } = req.params;

    if (!deptName || !employeeId || !employeeType) {
      return res.status(400).json({
        error: "Department name, Employee ID, and Employee Type are required.",
      });
    }

    const matchStage = {
      "BP.deptName": deptName,
    };

    // if (employeeType === "PM") {
    //   matchStage["BP.nodalOfficerNIC.empCode"] = employeeId;
    // } else {
    //   matchStage["BP.employeeId"] = employeeId;
    // }

    if (employeeType === "PM") {
      matchStage["BP.nodalOfficerNIC.empCode"] = employeeId.trim();
    } else if (employeeType === "HOD") {
      matchStage["BP.employeeId"] = employeeId.trim();
    }
    // 👆 Notice: Admin has NO employeeId filter

    const data = await getFilteredDashboard(matchStage);

    if (!data.length) {
      return res
        .status(404)
        .json({ error: "No assets found for this department and employee." });
    }

    res.status(200).json(data);
  } catch (error) {
    console.error("filterByDepartment error:", error);
    res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
}

async function getFrontend(req, res) {
  try {
    const db = getDb(); // Ensure this returns your MongoDB instance
    const collection = db.collection("frontend");

    const data = await collection
      .find({}, { projection: { technology: 1, version: 1, _id: 0 } })
      .toArray();

    if (!data.length) {
      return res
        .status(404)
        .json({ message: "No frontend technologies found" });
    }

    res.status(200).json(data);
  } catch (err) {
    console.error("Error fetching frontend technologies:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

async function markProjectForEdit(req, res) {
  try {
    const { projectName, empCode, employeeId } = req.body;

    if (!projectName || (!empCode && !employeeId)) {
      return res.status(400).json({
        message:
          "projectName and either empCode (PM) or employeeId (HOD) is required",
      });
    }

    const db = getDb();
    const filter = { projectName };

    if (empCode) filter.empCode = empCode;
    if (employeeId) filter.employeeId = employeeId;

    const updateFields = {
      status: "Editing",
      updatedAt: new Date(),
    };

    const result = await db
      .collection("AssignedAssets")
      .updateOne(filter, { $set: updateFields });

    if (result.matchedCount === 0)
      return res
        .status(404)
        .json({ message: "Project not found or identifier mismatch" });

    res.status(200).json({ message: "Project marked for edit successfully" });
  } catch (err) {
    console.error("Error in markProjectForEdit:", err);
    res
      .status(500)
      .json({ message: "Internal Server Error", details: err.message });
  }
}

async function updateProjectStatus(req, res) {
  try {
    const { projectName, empCode, employeeId, userType } = req.body;
    console.log("[updateProjectStatus] Incoming request:", {
      projectName,
      empCode,
      employeeId,
      userType,
    });

    if (!projectName) {
      console.warn("[updateProjectStatus] Missing projectName");
      return res.status(400).json({ message: "projectName is required" });
    }

    // Detect role: PM, HOD, or Admin
    const role = userType || (empCode ? "PM" : employeeId ? "HOD" : "Admin");
    console.log("[updateProjectStatus] Determined role:", role);

    const db = getDb();
    const filter = { projectName };

    if (role === "PM" && empCode) filter.empCode = empCode;
    if (role === "HOD" && employeeId) filter.employeeId = employeeId;
    // Admin doesn’t need extra filter (can review any project)

    console.log("[updateProjectStatus] Using filter:", filter);

    // Status message by role
    let statusText;
    if (role === "PM") statusText = "Added by PM";
    else if (role === "HOD") statusText = "Assigned by HOD";
    else if (role === "Admin") statusText = "Reviewed by Admin";

    const set = {
      status: statusText,
      updatedAt: new Date(),
    };

    console.log("[updateProjectStatus] Update fields:", set);

    const result = await db
      .collection("AssignedAssets")
      .updateOne(filter, { $set: set });
    console.log("[updateProjectStatus] Update result:", result);

    if (result.matchedCount === 0) {
      console.warn("[updateProjectStatus] No project matched filter:", filter);
      return res
        .status(404)
        .json({ message: "Project not found or identifier mismatch" });
    }

    console.log(`[updateProjectStatus] Success: Project ${statusText}`);
    res.json({ success: true, message: `Project ${statusText}` });
  } catch (err) {
    console.error("❌ Error in updateProjectStatus:", err);
    res.status(500).json({ message: "Server error", details: err.message });
  }
}

async function getDepartments(req, res) {
  try {
    const db = getDb();
    console.log(req.body);

    const departments = await db.collection("departments").find({}).toArray();
    res.status(200).json(departments);
  } catch (err) {
    console.error("Error fetching departments:", err);
    res
      .status(500)
      .json({ message: "Internal Server Error", details: err.message });
  }
}

async function getProjectStats(req, res) {
  try {
    const db = getDb();

    // 1️⃣ Get all assets
    const assets = await db.collection("Assets").find({}).toArray();

    // 2️⃣ Total assets
    const totalAssets = assets.length;

    // 3️⃣ Treat each asset as a project
    const totalProjects = totalAssets;
    const activeProjects = totalAssets;

    // 4️⃣ Active projects per asset (same as before)
    const activeProjectsPerAsset = assets.map((asset) => ({
      assetsId: asset.assetsId,
      activeProjectCount: 1,
    }));

    // 5️⃣ Department-wise project counts
    const deptMap = {};
    assets.forEach((asset) => {
      const dept = asset.BP?.deptName || "Unknown";
      deptMap[dept] = (deptMap[dept] || 0) + 1;
    });

    const activeProjectsPerDept = Object.entries(deptMap).map(
      ([deptName, count]) => ({
        deptName,
        projectCount: count,
      })
    );

    res.json({
      totalProjects,
      activeProjects,
      totalAssets,
      activeProjectsPerAsset,
      activeProjectsPerDept, // ✅ send this for charts
    });
  } catch (error) {
    console.error("Error fetching project stats:", error);
    res.status(500).json({ message: "Internal Server Error", error });
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
  getFrontend,
  markProjectForEdit,
  updateProjectStatus,
  getDepartments,
  getProjectAssignDataForHOD,
  getAllHods,
  getProjectStats,
};
