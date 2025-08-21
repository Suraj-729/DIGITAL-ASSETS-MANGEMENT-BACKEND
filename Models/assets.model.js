


const { getDb } = require("../Db/Db");
const { ObjectId } = require("mongodb");

const DigitalAssetsModel = {
  
 



  async createAsset(data) {
  const db = getDb();
  let assetsId;
  let isUnique = false;

  while (!isUnique) {
    const randomNum = Math.floor(1000 + Math.random() * 9000); // 4-digit random number
    const tempId = `NICOD-${randomNum}`;
    const existing = await db.collection("Assets").findOne({ assetsId: tempId });
    if (!existing) {
      assetsId = tempId;
      isUnique = true;
    }
  }
  if (!data.BP || !data.SA || !data.TS || !data.Infra || !data.DR || !data.TLS) {
    throw new Error("Missing required asset sections (BP, SA, TS, Infra)");
  }

  // Validate and transform VA records
  const validatedVaRecords = data.Infra.vaRecords.map((record, index) => {
    if (!record.ipAddress) {
      throw new Error(`VA Record ${index + 1}: IP Address is required`);
    }
    if(!record.dbServer) {
      throw new Error(`VA Record ${index + 1}: DB Server IP is required`);
    }
    if (!record.dateOfVA) {
      throw new Error(`VA Record ${index + 1}: Date of VA is required`);
    }
    return {
      ipAddress: record.ipAddress,
      dbServer: record.dbServer || "", // Ensure dbServerIp is always a string
      purposeOfUse: record.purposeOfUse || "Application Server",
      vaScore: record.vaScore || null,
      dateOfVA: new Date(record.dateOfVA),
      vaReport: typeof record.vaReport === "string"
        ? record.vaReport
        : record.vaReport?.filename || null, // <-- always store as string
    };
  });

  const assetProfile = {
    assetsId: assetsId,
    BP: {
      name: data.BP.name,
      prismId: data.BP.prismId,
      deptName: data.BP.deptName,
      employeeId: data.BP.employeeId,
      url: data.BP.url,
      publicIp: data.BP.publicIp,
      HOD: data.BP.HOD,
      nodalOfficerNIC: {
        name: data.BP.nodalOfficerNIC.name,
        empCode: data.BP.nodalOfficerNIC.empCode,
        mobile: data.BP.nodalOfficerNIC.mobile,
        email: data.BP.nodalOfficerNIC.email,
      },
      nodalOfficerDept: {
        name: data.BP.nodalOfficerDept.name,
        designation: data.BP.nodalOfficerDept.designation,
        mobile: data.BP.nodalOfficerDept.mobile,
        email: data.BP.nodalOfficerDept.email,
      },
    },
    // SA: {
    //   securityAudit: data.SA.securityAudit.map((record, index) => {
    //     const auditDate = record.auditDate ? new Date(record.auditDate) : null;
    //     const expireDate = record.expireDate ? new Date(record.expireDate) : null;
    //     // const tlsNextExpiry = record.tlsNextExpiry ? new Date(record.tlsNextExpiry) : null;
    //     let auditStatus = "Completed";
    //     if (expireDate && new Date() > expireDate) {
    //       auditStatus = "Expired";
    //     }
    //     let sslStatus = "Valid";
    //     if (expireDate && new Date() > expireDate) {
    //       sslStatus = "Expired";
    //     }
    //     return {
    //       "Sl no": record["Sl no"],
    //       typeOfAudit: record.typeOfAudit,
    //       auditingAgency: record.auditingAgency,
    //       auditDate,
    //       expireDate,
    //       // sslLabScore: record.sslLabScore,
    //       certificate: typeof record.certificate === "string"
    //         ? record.certificate
    //         : record.certificate?.filename || null, // <-- always store as string
    //       auditStatus,
    //       sslStatus
    //     };
    //   }),
    // },

    SA: {
      securityAudit: data.SA.securityAudit.map((record, index) => {
        const auditDate = record.auditDate ? new Date(record.auditDate) : null;
        const expireDate = record.expireDate ? new Date(record.expireDate) : null;
    
        let auditStatus = "Completed";
        if (expireDate && new Date() > expireDate) {
          auditStatus = "Expired";
        }
    
        let sslStatus = "Valid";
        if (expireDate && new Date() > expireDate) {
          sslStatus = "Expired";
        }
    
        return {
          "Sl no": record["Sl no"] || index + 1,  // default to index if missing
          typeOfAudit: record.typeOfAudit || "N/A",
          auditingAgency: record.auditingAgency || "N/A",
          auditDate: auditDate || "N/A",
          expireDate: expireDate || "N/A",
          certificate: typeof record.certificate === "string"
            ? record.certificate
            : record.certificate?.filename || "N/A", // always fallback
          auditStatus: auditStatus || "N/A",
          sslStatus: sslStatus || "N/A"
        };
      }),
    }
,    
    TLS: {
      tlsInfo: (data.TLS?.tlsInfo || []).map((record, index) => {
        const issueDate = record.issueDate ? new Date(record.issueDate) : null;
        const expiryDate = record.expiryDate ? new Date(record.expiryDate) : null;
        let certStatus = "Valid";
        if (expiryDate && new Date() > expiryDate) {
          certStatus = "Expired";
        } else if (expiryDate) {
          const warningPeriod = new Date();
          warningPeriod.setDate(warningPeriod.getDate() + 30);
          if (expiryDate < warningPeriod) {
            certStatus = "Expiring Soon";
          }
        }
        return {
          // domainName: record.domainName || "",
          // certProvider: record.certProvider || "",
          issueDate,
          expiryDate,
          certStatus,
          score: record.score || "",
          procuredFrom: record.procuredFrom || "",
        };
      }),
    },
    Infra: {
      typeOfServer: data.Infra.typeOfServer,
      location: data.Infra.location,
      deployment: data.Infra.deployment,
      dataCentre: data.Infra.dataCentre,
      antivirus:data.Infra.antivirus,
      // gitUrls: data.Infra.gitUrls || [],
      vaRecords: validatedVaRecords,
      // additionalInfra: [],
    },
    TS: {
      frontend: data.TS.frontend || [],
      framework: data.TS.framework,
      database: data.TS.database || [],
      os: data.TS.os || [],
      osVersion: data.TS.osVersion || [],
      repoUrls: data.TS.repoUrls || [],
    },
    DR: {
      serverType: data.DR.serverType || "",
      dataCentre: data.DR.dataCentre || "",
      deployment: data.DR.deployment || "",
      location: data.DR.location || "",
      antivirus: data.DR.antivirus || "",
      // gitUrls: data.DR.gitUrls || [],
      vaRecords: (data.DR.vaRecords || []).map((record) => ({
        ipAddress: record.ipAddress || "",
        dbServerIp: record.dbServerIp || "",
        purpose: record.purpose || "",
        vaScore: record.vaScore || "",
        vaDate: record.vaDate ? new Date(record.vaDate) : null,
        vaReport: record.vaReport || "",
      })),
    },
  
    createdAt: new Date(),
  };

  const result = await db.collection("Assets").insertOne(assetProfile);
  return result.insertedId;
},

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
  async updateTLS(assetsId, newTLS) {
    const db = getDb();
    return await db
      .collection("Assets")
      .updateOne({ assetsId }, { $set: { TLS: newTLS } });
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
  async updateTS(assetsId, newTLS) {
    const db = getDb();
    return await db
      .collection("Assets")
      .updateOne({ assetsId }, { $set: { TLS: newTLS } });
  },
  async updateDRInfo(assetsId, newDRInfo) {
    const db = getDb();
    return await db
      .collection("Assets")
      .updateOne({ assetsId }, { $set: { DRInfo: newDRInfo } });
  },
  async assignByHOD(data) {
    const db = getDb();
  
    const assignedAsset = {
      projectName: data.projectName || "",
      employeeId: data.employeeId || "",
      deptName: data.deptName || "",
      HOD: data.hodName || "",
      projectManagerName: data.projectManagerName || "",
      empCode: data.empCode || "",
      createdAt: new Date(),
      updatedByPM: false
    };
  
    console.log(assignedAsset);
  
    const result = await db.collection("AssignedAssets").insertOne(assignedAsset);
    return result.insertedId;
  },

  async getDashboardAllProjectBySIO() {
    const db = getDb();

    return await db
      .collection("Assets")
      .aggregate([
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
                  expireDate: "$$audit.expireDate",
                },
              },
            },
          },
        },
      ])
      .toArray();
  },

  async assignByHOD(data) {
    const db = getDb();
  
    const assignedAsset = {
      projectName: data.projectName || "",
      employeeId: data.employeeId || "",
      deptName: data.deptName || "",
      HOD: data.hodName || "",
      projectManagerName: data.projectManagerName || "",
      empCode: data.empCode || "",
      createdAt: new Date(),
      updatedByPM: false
    };
  
    console.log(assignedAsset);
  
    const result = await db.collection("AssignedAssets").insertOne(assignedAsset);
    return result.insertedId;
  }
};


module.exports = DigitalAssetsModel;