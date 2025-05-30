
const AssetsModel = require('../Models/assets.model');
const { getDb } = require('../Db/Db');

async function createAsset(req, res) {
  try {
    const id = await AssetsModel.createAsset(req.body);
    res.status(201).json({ message: 'Asset created successfully', assetId: id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error creating asset' });
  }
}

async function getAsset(req, res) {
  try {
    const { assetsId } = req.params;
    const db = getDb();
    const asset = await db.collection('Assets').findOne({ assetsId });

    if (!asset) return res.status(404).json({ error: 'Asset not found' });

    res.status(200).json({
      BP: asset.BP,
      SA: asset.SA,
      Infra: asset.Infra,
      TS: asset.TS
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to get asset' });
  }
}

async function deleteAsset(req, res) {
  try {
    const { assetsId } = req.params;
    const db = getDb();
    const result = await db.collection('Assets').deleteOne({ assetsId });

    if (result.deletedCount === 0)
      return res.status(404).json({ error: 'Asset not found' });

    res.status(200).json({ message: 'Asset deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete asset' });
  }
}

// Update BP section
async function updateBP(req, res) {
  const db = getDb();
  const { assetsId } = req.params;
  const data = req.body;

  try {
    const result = await db.collection('Assets').updateOne(
      { assetsId },
      {
        $set: {
          'BP.name': data.name,
          'BP.prismId': data.prismid,
          'BP.deptName': data.deptname,
          'BP.url': data.url,
          'BP.publicIp': data.public_ip,
          'BP.nodalOfficerNIC': {
            name: data.nodalofficerNIC.Name,
            empCode: data.nodalofficerNIC.Emp_code,
            mobile: data.nodalofficerNIC.Mob,
            email: data.nodalofficerNIC.Email,
          },
          'BP.nodalOfficerDept': {
            name: data.nodalofficerDept.Name,
            designation: data.nodalofficerDept.Designation,
            mobile: data.nodalofficerDept.Mob,
            email: data.nodalofficerDept.Email,
          }
        }
      }
    );
    res.status(200).json({ message: 'BP section updated', modifiedCount: result.modifiedCount });
  } catch (err) {
    res.status(500).json({ error: 'Update BP failed', details: err.message });
  }
}

async function updateSA(req, res) {
  const db = getDb();
  const { assetsId } = req.params;
  const data = req.body;

  try {
    const result = await db.collection('Assets').updateOne(
      { assetsId },
      {
        $set: {
          'SA.typeOfAudit': data.typeofaudit,
          'SA.auditDate': new Date(data.auditDate),
          'SA.auditingAgency': data.auditingahency,
          'SA.certificate': data.certi,
          'SA.sslLabScore': data.ssllabscore,
          'SA.tlsNextExpiry': new Date(data.tlsnextexpiry),
          'SA.secondaryAudits': data.Secaudits
        }
      }
    );
    res.status(200).json({ message: 'SA section updated', modifiedCount: result.modifiedCount });
  } catch (err) {
    res.status(500).json({ error: 'Update SA failed', details: err.message });
  }
}

async function updateInfra(req, res) {
  const db = getDb();
  const { assetsId } = req.params;
  const data = req.body;

  try {
    const result = await db.collection('Assets').updateOne(
      { assetsId },
      {
        $set: {
          'Infra.typeOfServer': data.typeofserver,
          'Infra.location': data.location,
          'Infra.deployment': data.deployment,
          'Infra.dataCentre': data.datacentre,
          'Infra.gitURL': data.giturl,
          'Infra.ipAddress': data.ipaddress,
          'Infra.purposeOfUse': data.puposeofuse,
          'Infra.vaScore': data.vascore,
          'Infra.dateOfVA': new Date(data.dateofva),
          'Infra.additionalInfra': data.infra
        }
      }
    );
    res.status(200).json({ message: 'Infra section updated', modifiedCount: result.modifiedCount });
  } catch (err) {
    res.status(500).json({ error: 'Update Infra failed', details: err.message });
  }
}

async function updateTS(req, res) {
  const db = getDb();
  const { assetsId } = req.params;
  const data = req.body;

  try {
    const result = await db.collection('Assets').updateOne(
      { assetsId },
      {
        $set: {
          'TS.frontEnd': data.frontend,
          'TS.framework': data.framework,
          'TS.database': data.database,
          'TS.os': data.OS
        }
      }
    );
    res.status(200).json({ message: 'TS section updated', modifiedCount: result.modifiedCount });
  } catch (err) {
    res.status(500).json({ error: 'Update TS failed', details: err.message });
  }
}

module.exports = {
  createAsset,
  getAsset,
  deleteAsset,
  updateBP,
  updateSA,
  updateInfra,
  updateTS
};
