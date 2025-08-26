require("dotenv").config();
const { getDb } = require("../Db/Db");
const nodemailer = require("nodemailer");
const moment = require("moment");

const WARNING_DAYS = 30;

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  }
});

/**
 * Sends an email using nodemailer.
 * @param {string} email - Recipient email address
 * @param {string} text - Email body text
 * @returns {Promise<void>}
 */
async function send(email, text) {
  await transporter.sendMail({
    from: `"Asset‑Mgmt" <${process.env.MAIL_USER}>`,
    to: email,
    subject: "⚠️ SSL/TLS Certificate Expiry Alert",
    text
  });
}

/**
 * Checks all assets for expiring SSL/TLS certificates and notifies users by email if any are expiring within 30 days.
 * @returns {Promise<void>}
 */
async function notifyUsersAboutExpiringCerts() {
  const db = getDb();
  const today = new Date();

  const assets = await db.collection("Assets").find({}).toArray();

  for (const asset of assets) {
    const empId = asset?.BP?.employeeId; // ✅ Use this instead of nodalOfficerNIC.empCode
    if (!empId) continue;

    const user = await db.collection("Users").findOne({ employeeId: empId });
    if (!user) continue;

    const email = user.userId; // ✅ Email is stored in userId
    if (!email) continue;

    for (const audit of asset?.SA?.securityAudit || []) {
      const expiry = audit.tlsNextExpiry || audit.expireDate;
      if (!expiry) continue;

      const daysLeft = moment(expiry).diff(moment(today), "days");
      if (daysLeft > WARNING_DAYS || daysLeft < 0) continue;

      const body = `
Hello ${empId},

The SSL/TLS certificate for "${asset.BP.name}" (PRISM ID ${asset.BP.prismId})
expires on ${moment(expiry).format("DD‑MMM‑YYYY")} – only ${daysLeft} day(s) left.

Please renew it promptly.

— Digital Asset Management
`;
      await send(email, body);
      console.log(`Alert sent → ${email} (${asset.BP.name})`);
    }
  }
}

module.exports = notifyUsersAboutExpiringCerts;
