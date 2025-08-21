const { getDb } = require("../Db/Db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const SECRET_KEY = "your-secret-key";
const UserModel = {


  async getUserById(assetsId) {
    const db = getDb();
    return await db.collection("Users").findOne({ assetsId });
  },

  async updatePassword(assetsId, newPassword) {
    const db = getDb();
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    return await db
      .collection("Users")
      .updateOne({ assetsId }, { $set: { password: hashedPassword } });
  },

  async deleteUser(assetsId) {
    const db = getDb();
    return await db.collection("Users").deleteOne({ assetsId });
  },



async findByLogin(identifier, password) {
  const db = getDb();
  console.log(`Attempting to find user by userId or employeeId: ${identifier}`);

  // Try to find by userId or employeeId
  const user = await db.collection("Users").findOne({
    $or: [{ userId: identifier }, { employeeId: identifier }]
  });

  if (!user) {
    console.log(`User not found: ${identifier}`);
    return null;
  }

  console.log(`User found, comparing password for: ${identifier}`);
  const isMatch = await bcrypt.compare(password, user.password);
  console.log(`Password match result for ${identifier}: ${isMatch}`);

  return isMatch ? user : null;
},

// async findByLogin(identifier, password) {
//   const db = getDb();
//   const user = await db.collection("Users").findOne({
//     $or: [{ userId: identifier }, { employeeId: identifier }]
//   });

//   if (!user) return null;

//   const isMatch = await bcrypt.compare(password, user.password);
//   if (!isMatch) return null;

//   // Generate JWT
//   const token = jwt.sign(
//     { userId: user.userId, employeeId: user.employeeId, role: user.employeeType },
//     SECRET_KEY,
//     { expiresIn: "1h" }
//   );

//   return { user, token };
// },

async createUser(data) {
  const db = getDb();
  const hashedPassword = await bcrypt.hash(data.password, 10);

  // Base user profile
  const userProfile = {
    userId: data.userId,
    password: hashedPassword,
    employeeId: data.employeeId,
    employeeType: data.employeeType,
    createdAt: new Date(),
  };

  // Conditionally add the name under PM, HOD, or Admin field
  if (data.employeeType === "PM") {
    userProfile.PM = data.employeeName;
  } else if (data.employeeType === "HOD") {
    userProfile.HOD = data.employeeName;
  } else if (data.employeeType === "Admin") {
    userProfile.Admin = data.employeeName;
  }

  console.log('Creating new user:', userProfile);
  const result = await db.collection("Users").insertOne(userProfile);
  return result.insertedId;
}
,

async updatePasswordByLoginId(identifier, newPassword) {
  const db = getDb();
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  return await db.collection("Users").updateOne(
    { $or: [{ userId: identifier }, { employeeId: identifier }] },
    { $set: { password: hashedPassword } }
  );
},


};

module.exports = UserModel;