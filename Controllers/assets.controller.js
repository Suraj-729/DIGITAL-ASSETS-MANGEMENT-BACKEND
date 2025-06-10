const AssetsModel = require("../Models/assets.model");
const { getDb } = require("../Db/Db");

async function createAsset(req, res) {
  try {
    console.log("Received  Data:", JSON.stringify(req.body, null, 2));
    const id = await AssetsModel.createAsset(req.body);
    res.status(201).json({ message: 'Asset created successfully', assetId: id });

  
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error creating asset" });
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
          "BP.prismId": data.prismid,
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

async function getAssetByProjectName(req, res) {
  try {
    const db = getDb();
    const projectName = req.params.projectName;

    const asset = await db.collection("Assets").findOne({
      "BP.name": { $regex: new RegExp(`^${projectName}$`, "i") }, // case-insensitive match
    });

    if (!asset) {
      return res
        .status(404)
        .json({ error: `No asset found with project name '${projectName}'` });
    }

    // Restructure the asset so that projectName appears after assetsId
    const modifiedAsset = {
      assetsId: asset.assetsId,
      projectName: asset.BP.name,
      BP: asset.BP,
      SA: asset.SA,
      Infra: asset.Infra,
      TS: asset.TS,
    };

    res.status(200).json(modifiedAsset);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: "Failed to fetch asset", details: err.message });
  }
}

async function getAllProjects(req, res) {
  try {
    const db = getDb();
    const assets = await db.collection("Assets").find({}).toArray();

    if (!assets.length) {
      return res.status(404).json({ error: "No projects found" });
    }

    // Create an array of project names
    const projectNames = assets.map((asset) => {
      return `${asset.assetsId} - ${asset.BP.name}`;
    });

    return res.status(200).json({ projects: projectNames });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: "Failed to fetch all projects",
      details: err.message,
    });
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
  getAssetByProjectName,
  getAllProjects

};
