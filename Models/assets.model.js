


const { getDb } = require("../Db/Db");
const { ObjectId } = require("mongodb");

const DigitalAssetsModel = {
  
  // async createAsset(data) {
  //   const db = getDb();
  //   let assetsId;
  //   let isUnique = false;

  //   while (!isUnique) {
  //     const randomNum = Math.floor(1000 + Math.random() * 9000); // 4-digit random number
  //     const tempId = `NICOD-${randomNum}`;
  
  //     const existing = await db.collection("Assets").findOne({ assetsId: tempId });
  //     if (!existing) {
  //       assetsId = tempId;
  //       isUnique = true;
  //     }
  //   }
  //   if (!data.BP || !data.SA || !data.TS || !data.Infra) {
  //     throw new Error("Missing required asset sections (BP, SA, TS, Infra)");
  //   }
  //   // const assetsId = await this.generateNextNICId();

  //   // Validate and transform VA records
  //   const validatedVaRecords = data.Infra.vaRecords.map((record, index) => {
  //     // Validate required fields
  //     if (!record.ipAddress) {
  //       throw new Error(`VA Record ${index + 1}: IP Address is required`);
  //     }
  //     if (!record.dateOfVA) {
  //       throw new Error(`VA Record ${index + 1}: Date of VA is required`);
  //     }

  //     // Transform the record
  //     return {
  //       ipAddress: record.ipAddress,
  //       purposeOfUse: record.purposeOfUse || "Application Server",
  //       vaScore: record.vaScore || null,
  //       dateOfVA: new Date(record.dateOfVA),
  //       vaReport: record.vaReport || null,
  //     };
  //   });

  //   const assetProfile = {
  //     assetsId: assetsId,
  //     BP: {
  //       name: data.BP.name,
  //       prismId: data.BP.prismId,
  //       deptName: data.BP.deptName, // <-- fix typo
  //       employeeId: data.BP.employeeId, // <-- add this line
  //       url: data.BP.url,
  //       publicIp: data.BP.publicIp, // <-- fix typo
  //       HOD: data.BP.HOD,
  //       nodalOfficerNIC: {
  //         name: data.BP.nodalOfficerNIC.name, // <-- fix typo
  //         empCode: data.BP.nodalOfficerNIC.empCode, // <-- fix typo
  //         mobile: data.BP.nodalOfficerNIC.mobile, // <-- fix typo
  //         email: data.BP.nodalOfficerNIC.email, // <-- fix typo
  //       },
  //       nodalOfficerDept: {
  //         name: data.BP.nodalOfficerDept.name, // <-- fix typo
  //         designation: data.BP.nodalOfficerDept.designation, // <-- fix typo
  //         mobile: data.BP.nodalOfficerDept.mobile, // <-- fix typo
  //         email: data.BP.nodalOfficerDept.email, // <-- fix typo
  //       },
  //     },
      
  //     SA: {

  //       securityAudit: data.SA.securityAudit.map((record, index) => {
  //         // Handle possible undefined/null values
  //         console.log("hooooo");

  //         const auditDate = record.auditDate ? new Date(record.auditDate) : null;
  //         const expireDate = record.expireDate ? new Date(record.expireDate) : null;
  //         const tlsNextExpiry = record.tlsNextExpiry ? new Date(record.tlsNextExpiry) : null;

  //         // Determine audit status
  //         let auditStatus = "Completed";
  //         if (expireDate && new Date() > expireDate) {
  //           auditStatus = "Expired";
  //         }

  //         // Determine SSL status
  //         let sslStatus = "Valid";
  //         if (tlsNextExpiry && new Date() > tlsNextExpiry) {
  //           sslStatus = "Expired";
  //         }

  //         return {
  //           "Sl no": record["Sl no"],
  //           typeOfAudit: record.typeOfAudit,
  //           auditingAgency: record.auditingAgency,
  //           auditDate,
  //           expireDate,
  //           sslLabScore: record.sslLabScore,
  //           certificate: record.certificate,
  //           auditStatus,
  //           sslStatus
  //         };
  //       }),
  //     }
  //     ,
  //     TLS: {
  //       tlsInfo: (data.TLS?.tlsInfo || []).map((record, index) => {
  //         // Use 'record' here, not 'tlsInfo'
  //         console.log(record, "TLS Record"); // Optional, just for debugging
      
  //         const issueDate = record.issueDate ? new Date(record.issueDate) : null;
  //         const expiryDate = record.expiryDate ? new Date(record.expiryDate) : null;
      
  //         // Determine certificate status
  //         let certStatus = "Valid";
  //         if (expiryDate && new Date() > expiryDate) {
  //           certStatus = "Expired";
  //         } else if (expiryDate) {
  //           const warningPeriod = new Date();
  //           warningPeriod.setDate(warningPeriod.getDate() + 30);
  //           if (expiryDate < warningPeriod) {
  //             certStatus = "Expiring Soon";
  //           }
  //         }
      
  //         return {
  //           domainName: record.domainName,
  //           certProvider: record.certProvider,
  //           issueDate,
  //           expiryDate,
  //           certStatus,
  //         };
  //       }),
  //     },

    


  //     Infra: {
  //       typeOfServer: data.Infra.typeOfServer,
  //       location: data.Infra.location,
  //       deployment: data.Infra.deployment,
  //       dataCentre: data.Infra.dataCentre,
  //       gitUrls: data.Infra.gitUrls || [],
  //       vaRecords: validatedVaRecords, // Use the validated and transformed records
  //       additionalInfra: [],
  //     },
  //     TS: {
  //       frontend: data.TS.frontend || [], // Changed from frontEnd to frontend
  //       framework: data.TS.framework,
  //       database: data.TS.database || [],
  //       os: data.TS.os || [],
  //       osVersion: data.TS.osVersion || [], // Add this if you want to keep OS versions
  //       repoUrls: data.TS.repoUrls || [], // Add this if you want to keep repo URLs
  //     },
  //     DR: {
  //       drLocation: data.DR.DRInfo?.drLocation || "",
  //       drStatus: data.DR.DRInfo?.drStatus || "",
  //       lastDrTestDate: data.DR.DRInfo?.lastDrTestDate ? new Date(data.DR.DRInfo.lastDrTestDate) : null,
  //       remarks: data.DR.DRInfo?.remarks || "",
  //       gitUrls: data.DR.gitUrls || [],
  //       vaRecords: (data.DR.vaRecords || []).map((record, index) => ({
  //         ipAddress: record.ipAddress || "",
  //         dbServerIp: record.dbServerIp || "",
  //         purposeOfUse: record.purposeOfUse || "",
  //         vaScore: record.vaScore || "",
  //         dateOfVA: record.dateOfVA ? new Date(record.dateOfVA) : null,
  //         vaReport: record.vaReport || null,
  //       })),
  //     },
  //     createdAt: new Date(),
  //   };



  //   const result = await db.collection("Assets").insertOne(assetProfile);
  //   return result.insertedId;
  // },

  // ✅ Get full asset by custom asset ID


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
  if (!data.BP || !data.SA || !data.TS || !data.Infra) {
    throw new Error("Missing required asset sections (BP, SA, TS, Infra)");
  }

  // Validate and transform VA records
  const validatedVaRecords = data.Infra.vaRecords.map((record, index) => {
    if (!record.ipAddress) {
      throw new Error(`VA Record ${index + 1}: IP Address is required`);
    }
    if (!record.dateOfVA) {
      throw new Error(`VA Record ${index + 1}: Date of VA is required`);
    }
    return {
      ipAddress: record.ipAddress,
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
    SA: {
      securityAudit: data.SA.securityAudit.map((record, index) => {
        const auditDate = record.auditDate ? new Date(record.auditDate) : null;
        const expireDate = record.expireDate ? new Date(record.expireDate) : null;
        const tlsNextExpiry = record.tlsNextExpiry ? new Date(record.tlsNextExpiry) : null;
        let auditStatus = "Completed";
        if (expireDate && new Date() > expireDate) {
          auditStatus = "Expired";
        }
        let sslStatus = "Valid";
        if (tlsNextExpiry && new Date() > tlsNextExpiry) {
          sslStatus = "Expired";
        }
        return {
          "Sl no": record["Sl no"],
          typeOfAudit: record.typeOfAudit,
          auditingAgency: record.auditingAgency,
          auditDate,
          expireDate,
          sslLabScore: record.sslLabScore,
          certificate: typeof record.certificate === "string"
            ? record.certificate
            : record.certificate?.filename || null, // <-- always store as string
          auditStatus,
          sslStatus
        };
      }),
    },
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
          domainName: record.domainName || "",
          certProvider: record.certProvider || "",
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
      gitUrls: data.Infra.gitUrls || [],
      vaRecords: validatedVaRecords,
      additionalInfra: [],
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
      drLocation: data.DR.DRInfo?.drLocation || "",
      drStatus: data.DR.DRInfo?.drStatus || "",
      lastDrTestDate: data.DR.DRInfo?.lastDrTestDate
        ? new Date(data.DR.DRInfo.lastDrTestDate)
        : null,
      remarks: data.DR.DRInfo?.remarks || "",
      gitUrls: data.DR.gitUrls || [],
      vaRecords: (data.DR.vaRecords || []).map((record, index) => ({
        ipAddress: record.ipAddress || "",
        dbServerIp: record.dbServerIp || "",
        purposeOfUse: record.purposeOfUse || "",
        vaScore: record.vaScore || "",
        dateOfVA: record.dateOfVA ? new Date(record.dateOfVA) : null,
        vaReport: typeof record.vaReport === "string"
          ? record.vaReport
          : record.vaReport?.filename || null, // <-- always store as string
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
};

module.exports = DigitalAssetsModel;