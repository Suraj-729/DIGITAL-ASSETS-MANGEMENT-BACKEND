const { getDb } = require("../Db/Db");
const { ObjectId } = require("mongodb");

const DigitalAssetsModel = {
  // // ✅ Create a full asset profile using the provided payload structure
  // async createAsset(data) {
  //   const db = getDb();

  //   if (!data.BP || !data.SA || !data.TS || !data.Infra) {
  //     throw new Error("Missing required asset sections (BP, SA, TS, Infra)");
  //   }

  //   const assetProfile = {
  //     assetsId: data.assetsId, // custom asset ID passed from frontend
  //     BP: {
  //       name: data.BP.name,
  //       prismId: data.BP.prismid,
  //       deptName: data.BP.deptname,
  //       url: data.BP.url,
  //       publicIp: data.BP.public_ip,
  //       nodalOfficerNIC: {
  //         name: data.BP.nodalofficerNIC.Name,
  //         empCode: data.BP.nodalofficerNIC.Emp_code,
  //         mobile: data.BP.nodalofficerNIC.Mob,
  //         email: data.BP.nodalofficerNIC.Email,
  //       },
  //       nodalOfficerDept: {
  //         name: data.BP.nodalofficerDept.Name,
  //         designation: data.BP.nodalofficerDept.Designation,
  //         mobile: data.BP.nodalofficerDept.Mob,
  //         email: data.BP.nodalofficerDept.Email,
  //       },
  //     },

  //     SA: {
  //       securityAudit: data.SA.securityAudit.map((record) => ({
  //         "Sl no": record["Sl no"],
  //         typeOfAudit: record.typeOfAudit,
  //         auditingAgency: record.auditingAgency,
  //         auditDate: record.auditDate ? new Date(record.auditDate) : null,
  //         expireDate: record.expireDate ? new Date(record.expireDate) : null,
  //         tlsNextExpiry: record.tlsNextExpiry
  //           ? new Date(record.tlsNextExpiry)
  //           : null,
  //         sslLabScore: record.sslLabScore,
  //         certificate: record.certificate,
  //       })),
  //     },
  //     Infra: {
  //       typeOfServer: data.Infra.typeOfServer, // Changed from serverType
  //       location: data.Infra.location,
  //       deployment: data.Infra.deployment,
  //       dataCentre: data.Infra.dataCentre,
  //       gitUrls: data.Infra.gitUrls || [], // Changed from giturl
  //       vaRecords: data.Infra.vaRecords.map((record) => ({
  //         ipAddress: record.ipAddress, // Changed from ip
  //         purposeOfUse: record.purposeOfUse, // Changed from purpose
  //         vaScore: record.vaScore,
  //         dateOfVA: record.dateOfVA ? new Date(record.dateOfVA) : null, // Changed from vaDate
  //         vaReport: record.vaReport,
  //       })),
  //       additionalInfra: [],
  //     },
  //     TS: {
  //       frontend: data.TS.frontend || [],
  //       framework: data.TS.framework,
  //       database: data.TS.database || [],
  //       os: data.TS.os || [],
  //     },
  //     createdAt: new Date(),
  //   };

  //   const result = await db.collection("Assets").insertOne(assetProfile);
  //   return result.insertedId;
  // },

  async createAsset(data) {
    const db = getDb();

    if (!data.BP || !data.SA || !data.TS || !data.Infra) {
      throw new Error("Missing required asset sections (BP, SA, TS, Infra)");
    }

    // Validate and transform VA records
    const validatedVaRecords = data.Infra.vaRecords.map((record, index) => {
      // Validate required fields
      if (!record.ipAddress) {
        throw new Error(`VA Record ${index + 1}: IP Address is required`);
      }
      if (!record.dateOfVA) {
        throw new Error(`VA Record ${index + 1}: Date of VA is required`);
      }

      // Transform the record
      return {
        ipAddress: record.ipAddress,
        purposeOfUse: record.purposeOfUse || "Application Server",
        vaScore: record.vaScore || null,
        dateOfVA: new Date(record.dateOfVA),
        vaReport: record.vaReport || null,
      };
    });

    const assetProfile = {
      assetsId: data.assetsId,
      BP: {
        name: data.BP.name,
        prismId: data.BP.prismId,
        deptName: data.BP.deptname,
        url: data.BP.url,
        publicIp: data.BP.public_ip,
        HOD: data.BP.HOD,
        nodalOfficerNIC: {
          name: data.BP.nodalofficerNIC.Name,
          empCode: data.BP.nodalofficerNIC.Emp_code,
          mobile: data.BP.nodalofficerNIC.Mob,
          email: data.BP.nodalofficerNIC.Email,
        },
        nodalOfficerDept: {
          name: data.BP.nodalofficerDept.Name,
          designation: data.BP.nodalofficerDept.Designation,
          mobile: data.BP.nodalofficerDept.Mob,
          email: data.BP.nodalofficerDept.Email,
        },
      },
      SA: {
        securityAudit: data.SA.securityAudit.map((record) => ({
          "Sl no": record["Sl no"],
          typeOfAudit: record.typeOfAudit,
          auditingAgency: record.auditingAgency,
          auditDate: record.auditDate ? new Date(record.auditDate) : null,
          expireDate: record.expireDate ? new Date(record.expireDate) : null,
          tlsNextExpiry: record.tlsNextExpiry
            ? new Date(record.tlsNextExpiry)
            : null,
          sslLabScore: record.sslLabScore,
          certificate: record.certificate,
        })),
      },
      Infra: {
        typeOfServer: data.Infra.typeOfServer,
        location: data.Infra.location,
        deployment: data.Infra.deployment,
        dataCentre: data.Infra.dataCentre,
        gitUrls: data.Infra.gitUrls || [],
        vaRecords: validatedVaRecords, // Use the validated and transformed records
        additionalInfra: [],
      },
      TS: {
        frontend: data.TS.frontend || [], // Changed from frontEnd to frontend
        framework: data.TS.framework,
        database: data.TS.database || [],
        os: data.TS.os || [],
        osVersion: data.TS.osVersion || [], // Add this if you want to keep OS versions
        repoUrls: data.TS.repoUrls || [], // Add this if you want to keep repo URLs
      },
      createdAt: new Date(),
    };

    const result = await db.collection("Assets").insertOne(assetProfile);
    return result.insertedId;
  },

  // ✅ Get full asset by custom asset ID
  async getAssetByAssetsId(assetsId) {
    const db = getDb();
    const asset = await db.collection("Assets").findOne({ assetsId });
    return asset;
  },

  // ✅ Delete asset by custom asset ID
  async deleteAsset(assetsId) {
    const db = getDb();
    return await db.collection("Assets").deleteOne({ assetsId });
  },

  // ✅ Update BP section
  async updateBP(assetsId, newBP) {
    const db = getDb();
    return await db
      .collection("Assets")
      .updateOne({ assetsId }, { $set: { BP: newBP } });
  },

  // ✅ Update SA section
  async updateSA(assetsId, newSA) {
    if (newSA.auditDate) newSA.auditDate = new Date(newSA.auditDate);
    if (newSA.tlsnextexpiry)
      newSA.tlsNextExpiry = new Date(newSA.tlsnextexpiry);

    const db = getDb();
    return await db
      .collection("Assets")
      .updateOne({ assetsId }, { $set: { SA: newSA } });
  },

  // ✅ Update Infra section
  async updateInfra(assetsId, newInfra) {
    if (newInfra.dateOfVA) newInfra.dateOfVA = new Date(newInfra.dateOfVA);

    const db = getDb();
    return await db
      .collection("Assets")
      .updateOne({ assetsId }, { $set: { Infra: newInfra } });
  },

  // ✅ Update TS section
  async updateTS(assetsId, newTS) {
    const db = getDb();
    return await db
      .collection("Assets")
      .updateOne({ assetsId }, { $set: { TS: newTS } });
  },

  async getDashboardAllProjectBySIO() {
  const db = getDb();
  
  return await db.collection("Assets").aggregate([
    {
      $project: {
        _id: 0,
        prismId: "$BP.prismId",
        HOD: "$BP.HOD",
        deptName: "$BP.deptName",
        audits: {
          $map: {
            input: "$SA.securityAudit",
            as: "audit",
            in: {
              auditDate: "$$audit.auditDate",
              expireDate: "$$audit.expireDate"
            }
          }
        }
      }
    }
  ]).toArray();
}
};

module.exports = DigitalAssetsModel;
