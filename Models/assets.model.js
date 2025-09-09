const { getDb } = require("../Db/Db");
const { ObjectId } = require("mongodb");

const DigitalAssetsModel = {
  getStatus(expireDate) {
    if (!expireDate) return "N/A";
    return new Date(expireDate) > new Date() ? "Completed" : "Expired";
  },

  async createAsset(data) {
    const db = getDb();
    let assetsId;
    let isUnique = false;

    while (!isUnique) {
      const randomNum = Math.floor(1000 + Math.random() * 9000); // 4-digit random number
      const tempId = `NICOD-${randomNum}`;
      const existing = await db
        .collection("Assets")
        .findOne({ assetsId: tempId });
      if (!existing) {
        assetsId = tempId;
        isUnique = true;
      }
    }
    if (
      !data.BP ||
      !data.SA ||
      !data.TS ||
      !data.Infra ||
      !data.DR ||
      !data.TLS
    ) {
      throw new Error("Missing required asset sections (BP, SA, TS, Infra)");
    }

    // Validate and transform VA records
    const validatedVaRecords = data.Infra.vaRecords.map((record, index) => {
      if (!record.ipAddress) {
        throw new Error(`VA Record ${index + 1}: IP Address is required`);
      }
      if (!record.dbServer) {
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
        vaReport:
          typeof record.vaReport === "string"
            ? record.vaReport
            : record.vaReport?.filename || null, // <-- always store as string
      };
    });

    const assetProfile = {
      assetsId: assetsId,
      BP: {
        name: data.BP.name || "",
        prismId: data.BP.prismId || "",
        deptName: data.BP.deptName || "",
        employeeId: data.BP.employeeId || "",
        url: data.BP.url || "",
        publicIp: data.BP.publicIp || "",
        HOD: data.BP.HOD || "",
        nodalOfficerNIC: {
          name: data.BP.nodalOfficerNIC?.name || "",
          empCode: data.BP.nodalOfficerNIC?.empCode || "",
          mobile: data.BP.nodalOfficerNIC?.mobile || "",
          email: data.BP.nodalOfficerNIC?.email || "",
        },
        nodalOfficerDept: {
          name: data.BP.nodalOfficerDept?.name || "",
          designation: data.BP.nodalOfficerDept?.designation || "",
          mobile: data.BP.nodalOfficerDept?.mobile || "",
          email: data.BP.nodalOfficerDept?.email || "",
        },
      },

      // SA: {

      //   securityAudit:
      //     data.SA?.securityAudit?.length > 0
      //       ? data.SA.securityAudit.map((record, index) => ({
      //           slNo: record.slNo || index + 1,
      //           typeOfAudit: record.typeOfAudit || "N/A",
      //           auditingAgency: record.auditingAgency || "N/A",
      //           auditDate: record.auditDate || "",
      //           expireDate: record.expireDate || "",
      //           certificate:
      //             typeof record.certificate === "string"
      //               ? record.certificate
      //               : record.certificate?.filename || "N/A",
      //           auditStatus: DigitalAssetsModel.getStatus(record.expireDate), // force all active
      //         }))
      //       : [
      //           {
      //             slNo: 1,
      //             typeOfAudit: "N/A",
      //             auditingAgency: "N/A",
      //             auditDate: null,
      //             expireDate: null,
      //             certificate: "N/A",
      //             auditStatus: "N/A",
      //           },
      //         ],
      // },

      SA: {
        securityAudit:
          data.SA?.securityAudit?.length > 0
            ? data.SA.securityAudit.map((record, index) => ({
                slNo: record.slNo || index + 1,
                typeOfAudit: record.typeOfAudit || "N/A", // you can choose to handle empty values later in the UI
                auditingAgency: record.auditingAgency || "N/A",
                auditDate: record.auditDate || "",
                expireDate: record.expireDate || "",
                certificate:
                  typeof record.certificate === "string"
                    ? record.certificate
                    : record.certificate?.filename || "N/A",
                auditStatus: DigitalAssetsModel.getStatus(record.expireDate),
              }))
            : [], // empty array when no records are present
      },
      TLS: {
        tlsInfo:
          data.TLS?.tlsInfo?.length > 0
            ? data.TLS.tlsInfo.map((record, index) => {
                const today = new Date();
                today.setHours(0, 0, 0, 0); // normalize to midnight

                let tlsStatus = "N/A";
                if (record.expiryDate) {
                  const expiry = new Date(record.expiryDate);
                  expiry.setHours(0, 0, 0, 0);

                  tlsStatus = expiry >= today ? "Valid" : "Expired"; // ✅ Valid / Invalid
                }

                return {
                  slNo: index + 1,
                  issueDate: record.issueDate || "",
                  expiryDate: record.expiryDate || "",
                  tlsStatus,
                  score: record.score || "N/A",
                  procuredFrom: record.procuredFrom || "N/A",
                };
              })
            : [
                // {
                //   slNo: 1,
                //   issueDate: "",
                //   expiryDate: "",
                //   tlsStatus: "N/A",
                //   score: "N/A",
                //   procuredFrom: "N/A",
                // },
              ],
      },
      Infra: {
        typeOfServer: data.Infra?.typeOfServer || "",
        location: data.Infra?.location || "",
        deployment: data.Infra?.deployment || "",
        dataCentre: data.Infra?.dataCentre || "",
        antivirus: data.Infra?.antivirus || "",
        vaRecords: validatedVaRecords || [],
      },

      TS: {
        frontend: data.TS?.frontend || [],
        framework: data.TS?.framework || [],
        database: data.TS?.database || [],
        os: data.TS?.os || [],

        repoUrls: data.TS?.repoUrls || [],
      },

      DR: {
        serverType: data.DR?.serverType || "",
        dataCentre: data.DR?.dataCentre || "",
        deployment: data.DR?.deployment || "",
        location: data.DR?.location || "",
        antivirus: data.DR?.antivirus || "",
        vaRecords: (data.DR?.vaRecords || []).map((record) => ({
          ipAddress: record.ipAddress || "",
          dbServerIp: record.dbServerIp || "",
          purpose: record.purpose || "",
          vaScore: record.vaScore || "",
          vaDate: record.vaDate || "",
          vaReport: record.vaReport || "",
        })),
      },

      createdAt: new Date(),
    };

    const result = await db.collection("Assets").insertOne(assetProfile);
    // return result.insertedId;
    return assetProfile.assetsId;
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
      updatedByPM: false,
    };

    console.log(assignedAsset);

    const result = await db
      .collection("AssignedAssets")
      .insertOne(assignedAsset);
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
      updatedByPM: false,
    };

    console.log(assignedAsset);

    const result = await db
      .collection("AssignedAssets")
      .insertOne(assignedAsset);
    return result.insertedId;
  },
};

module.exports = DigitalAssetsModel;
