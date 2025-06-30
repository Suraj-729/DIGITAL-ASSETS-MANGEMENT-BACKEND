const UserModel = require("../Models/user.model");

// Create a new user
async function createUser(req, res) {
  try {
    const userId = await UserModel.createUser(req.body);
    res.status(201).json({ message: "User created", userId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create user", details: err.message });
  }
}

// Get user by assetsId
async function getUserById(req, res) {
  try {
    const user = await UserModel.getUserById(req.params.assetsId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to get user", details: err.message });
  }
}

// Update user password
async function updatePassword(req, res) {
  try {
    const { assetsId } = req.params;
    const { password } = req.body;
    const result = await UserModel.updatePassword(assetsId, password);
    if (result.modifiedCount === 0) {
      return res.status(404).json({ error: "User not found or password unchanged" });
    }
    res.status(200).json({ message: "Password updated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update password", details: err.message });
  }
}

// Delete user by assetsId
async function deleteUser(req, res) {
  try {
    const result = await UserModel.deleteUser(req.params.assetsId);
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json({ message: "User deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete user", details: err.message });
  }
}

// Login user
// async function login(req, res) {
//   try {
//     const { assetsId, password } = req.body;
//     console.log('Login payload:', req.body);

//     const user = await UserModel.findByLogin(assetsId, password);
//     console.log('User found:', user);

//     if (!user) {
//       console.log('No user found with provided credentials');
//       return res.status(401).json({ error: "Invalid credentials" });
//     }
//     req.session = req.session || {};
//     req.session.user = { assetsId: user.assetsId };
//     res.status(200).json({ message: "Login successful" });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Login failed", details: err.message });
//   }
// }


// async function login(req, res) {
//   try {
//     const { userId, password } = req.body;
//     console.log('Login request received for userId:', userId);
    
//     if (!userId || !password) {
//       console.log('Missing credentials');
//       return res.status(400).json({ error: "UserId and password are required" });
//     }

//     const user = await UserModel.findByLogin(userId, password);
    
//     if (!user) {
//       console.log('Invalid login attempt for userId:', userId);
//       return res.status(401).json({ error: "Invalid credentials" });
//     }

//     console.log('User authenticated successfully:', userId);
//     req.session.user = { userId: user.userId };
//     res.status(200).json({ 
//       message: "Login successful",
//       user: { userId: user.userId }
//     });
//   } catch (err) {
//     console.error('Login error:', {
//       message: err.message,
//       stack: err.stack,
//       requestBody: req.body
//     });
//     res.status(500).json({ 
//       error: "Login failed",
//       details: process.env.NODE_ENV === 'development' ? err.message : undefined
//     });
//   }
// }
async function login(req, res) {
  try {
    const { loginId, password } = req.body; // Accept loginId (can be userId or employeeId)
    console.log('Login request received for loginId:', loginId);

    if (!loginId || !password) {
      console.log('Missing credentials');
      return res.status(400).json({ error: "Login ID and password are required" });
    }

    const user = await UserModel.findByLogin(loginId, password);

    if (!user) {
      console.log('Invalid login attempt for loginId:', loginId);
      return res.status(401).json({ error: "Invalid credentials" });
    }

    console.log('User authenticated successfully:', loginId);
    req.session.user = { userId: user.userId, employeeId: user.employeeId, employeeType: user.employeeType };
    res.status(200).json({ 
      message: "Login successful",
      user: { 
        userId: user.userId,
        employeeId: user.employeeId,
        employeeType: user.employeeType
      }
    });
  } catch (err) {
    console.error('Login error:', {
      message: err.message,
      stack: err.stack,
      requestBody: req.body
    });
    res.status(500).json({ 
      error: "Login failed",
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
}

// Logout user
async function logout(req, res) {
  try {
    if (req.session) {
      req.session.user = null;
    }
    res.status(200).json({ message: "Logout successful" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Logout failed", details: err.message });
  }
}

// async function register(req, res) {
//   try {
//     const { userId, password } = req.body;
//     console.log('Registration request for:', userId);

//     // Validate input
//     if (!userId || !password) {
//       console.log('Missing registration fields');
//       return res.status(400).json({ error: "UserId and password are required" });
//     }

//     // Check if user already exists
//     const existingUser = await UserModel.getUserById(userId);
//     if (existingUser) {
//       console.log('User already exists:', userId);
//       return res.status(409).json({ error: "User already exists" });
//     }

//     // Create new user
//     const newUserId = await UserModel.createUser({ userId, password });
//     console.log('New user created:', newUserId);

//     res.status(201).json({ 
//       message: "Registration successful",
//       userId
//     });
//   } catch (err) {
//     console.error('Registration error:', {
//       message: err.message,
//       stack: err.stack,
//       requestBody: req.body
//     });
//     res.status(500).json({ 
//       error: "Registration failed",
//       details: process.env.NODE_ENV === 'development' ? err.message : undefined
//     });
//   }
// }

async function register(req, res) {
  try {
    const { userId, password, employeeId, employeeType } = req.body;
    console.log('Registration request for:', userId, 'Employee ID:', employeeId, 'Employee Type:', employeeType);

    // Validate input
    if (!userId || !password || !employeeId || !employeeType) {
      console.log('Missing registration fields');
      return res.status(400).json({ error: "UserId, password, employeeId, and employeeType are required" });
    }

    // Check if user already exists
    const existingUser = await UserModel.getUserById(userId);
    if (existingUser) {
      console.log('User already exists:', userId);
      return res.status(409).json({ error: "User already exists" });
    }

    // Create new user
    const newUserId = await UserModel.createUser({ userId, password, employeeId, employeeType });
    console.log('New user created:', newUserId);

    res.status(201).json({ 
      message: "Registration successful",
      userId,
      employeeId,
      employeeType
    });
  } catch (err) {
    console.error('Registration error:', {
      message: err.message,
      stack: err.stack,
      requestBody: req.body
    });
    res.status(500).json({ 
      error: "Registration failed",
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
}

async function changePassword(req, res) {
  try {
    const { loginId, currentPassword, newPassword } = req.body;
    if (!loginId || !currentPassword || !newPassword) {
      return res.status(400).json({ error: "loginId, currentPassword, and newPassword are required" });
    }

    const user = await UserModel.findByLogin(loginId, currentPassword);
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    await UserModel.updatePasswordByLoginId(loginId, newPassword);
    res.status(200).json({ message: "Password changed successfully" });
  } catch (err) {
    console.error('Change password error:', err);
    res.status(500).json({ error: "Failed to change password", details: err.message });
  }
}



module.exports = {
  createUser,
  getUserById,
  updatePassword,
  deleteUser,
  login,
  logout,
  register,
  changePassword
};