const { getDb } = require("../Db/Db");
const bcrypt = require("bcrypt");

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


//  async findByLogin(userId, password) {
//     const db = getDb();
//     console.log(`Attempting to find user: ${userId}`);
    
//     const user = await db.collection("Users").findOne({ userId });
//     if (!user) {
//       console.log(`User not found: ${userId}`);
//       return null;
//     }

//     console.log(`User found, comparing password for: ${userId}`);
//     const isMatch = await bcrypt.compare(password, user.password);
//     console.log(`Password match result for ${userId}: ${isMatch}`);
    
//     return isMatch ? user : null;
//   },
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


  async createUser(data) {
  const db = getDb();
  const hashedPassword = await bcrypt.hash(data.password, 10);
  const userProfile = {
    userId: data.userId,
    password: hashedPassword,
    employeeId: data.employeeId,
    employeeType: data.employeeType,
    createdAt: new Date(),
  };
  console.log('Creating new user:', userProfile.userId, userProfile.employeeId, userProfile.employeeType);
  const result = await db.collection("Users").insertOne(userProfile);
  return result.insertedId;
}
,
};

module.exports = UserModel;
