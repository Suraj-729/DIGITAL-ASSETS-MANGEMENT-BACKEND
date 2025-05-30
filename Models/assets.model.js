
  const { getDb } = require('../Db/Db');
  const { ObjectId } = require('mongodb');

  const DigitalAssetsModel = {
    // ✅ Create a full asset profile
    async createAsset(data) {
      const db = getDb();

      const assetProfile = {
        assetsId: data.assetsId, // custom asset ID passed from frontend
        
          BP: {
            name: data. BP.name,
            prismId: data .BP.prismid,
            deptName: data .BP.deptname,
            url: data .BP.url,
            publicIp: data .BP.public_ip,
            nodalOfficerNIC: {
              name: data. BP.nodalofficerNIC.Name,
              empCode: data .BP.nodalofficerNIC.Emp_code,
              mobile: data .BP.nodalofficerNIC.Mob,
              email: data. BP.nodalofficerNIC.Email,
            },
            nodalOfficerDept: {
              name: data. BP.nodalofficerDept.Name,
              designation: data .BP.nodalofficerDept.Designation,
              mobile: data .BP.nodalofficerDept.Mob,
              email: data .BP.nodalofficerDept.Email,
            },
          },
          SA: {
            typeOfAudit: data .SA.typeofaudit,
            auditDate: new Date(data.SA.auditDate),
            auditingAgency: data.SA.auditingagency,
            certificate: data.SA.certificate,
            sslLabScore: data.SA.sslLabScore,
            tlsNextExpiry: new Date(data .SA.tlsnextexpiry),
            secondaryAudits: data.SA.secondaryAudits || [],
          },
          Infra: {
            typeOfServer: data.Infra.typeOfServer,
            location: data.Infra.location,
            deployment: data.Infra.deployment,
            dataCentre: data.Infra.dataCentre,
            gitURL: data.Infra.gitURL || [],
            ipAddress: data.Infra.ipAddress,
            purposeOfUse: data.Infra.purposeOfUse,
            vaScore: data .Infra.vaScore,
            dateOfVA: new Date(data .Infra.dateOfVA),
            additionalInfra: data.Infra.additionalInfra || [],
          },
          TS: {
            frontEnd: data .TS.frontEnd || [],
            framework: data .TS.framework,
            database: data .TS.database || [],
            os: data .TS.os || [],
          },
        
        createdAt: new Date()
      };

      const result = await db.collection('Assets').insertOne(assetProfile);
      return result.insertedId;
    },

    // ✅ Get full asset by custom asset ID
    async getAssetByAssetsId(assetsId) {
      const db = getDb();
      const asset = await db.collection('Assets').findOne({ assetsId });
      return asset;
    },

    // ✅ Delete asset by custom asset ID
    async deleteAsset(assetsId) {
      const db = getDb();
      return await db.collection('Assets').deleteOne({ assetsId });
    },

    // ✅ Update BP section
  // ✅ Update BP section
  async updateBP(assetsId, newBP) {
    const db = getDb();
    return await db.collection('Assets').updateOne(
      { assetsId: assetsId }, // match by string value
      { $set: { BP: newBP } } // update top-level "BP" field
    );
  },


    // ✅ Update SA section
    async updateSA(assetsId, newSA) {
      if (newSA.auditDate) newSA.auditDate = new Date(newSA.auditDate);
      if (newSA.tlsnextexpiry) {
        newSA.tlsNextExpiry = new Date(newSA.tlsnextexpiry);
        delete newSA.tlsnextexpiry; // remove old field if exists
      }
    
      const db = getDb();
      return await db.collection('Assets').updateOne(
        { assetsId },
        { $set: { SA: newSA } }
      );
    },
    

    // ✅ Update Infra section
    async updateInfra(assetsId, newInfra) {
      if (newInfra.dateOfVA) newInfra.dateOfVA = new Date(newInfra.dateOfVA);
    
      const db = getDb();
      return await db.collection('Assets').updateOne(
        { assetsId },
        { $set: { Infra: newInfra } }
      );
    },
    

    // ✅ Update TS section
    async updateTS(assetsId, newTS) {
      const db = getDb();
      return await db.collection('Assets').updateOne(
        { assetsId },
        { $set: { TS: newTS } }
      );
    }
    
  };

  module.exports = DigitalAssetsModel;
