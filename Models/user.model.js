const { getDb } = require("../Db/Db");
const bcrypt = require("bcrypt");

const UserModel = {
  // async createUser(data) {
  //   const db = getDb();
  //   const hashedPassword = await bcrypt.hash(data.password, 10);
  //   const userProfile = {
  //     assetsId: data.assetsId,
  //     password: hashedPassword,
  //     createdAt: new Date(),
  //   };
  //   const result = await db.collection("Users").insertOne(userProfile);
  //   return result.insertedId;
  // },

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

//  async findByLogin(assetsId, password) {
//   const db = getDb();
//   const user = await db.collection("Users").findOne({ assetsId });

//   if (!user) {
//     console.log("No user found for:", assetsId);
//     return null;
//   }

//   console.log("User found:", user);

//   const isMatch = await bcrypt.compare(password, user.password);
//   console.log("Password match result:", isMatch);

//   return isMatch ? user : null;
// }
 async findByLogin(userId, password) {
    const db = getDb();
    console.log(`Attempting to find user: ${userId}`);
    
    const user = await db.collection("Users").findOne({ userId });
    if (!user) {
      console.log(`User not found: ${userId}`);
      return null;
    }

    console.log(`User found, comparing password for: ${userId}`);
    const isMatch = await bcrypt.compare(password, user.password);
    console.log(`Password match result for ${userId}: ${isMatch}`);
    
    return isMatch ? user : null;
  },

  // Update other methods to use userId instead of assetsId
  async createUser(data) {
    const db = getDb();
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const userProfile = {
      userId: data.userId,  // Changed from assetsId
      password: hashedPassword,
      createdAt: new Date(),
    };
    console.log('Creating new user:', userProfile.userId);
    const result = await db.collection("Users").insertOne(userProfile);
    return result.insertedId;
  }
,
};

module.exports = UserModel;
