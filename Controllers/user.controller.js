const UserModel = require("../Models/user.model");

/**
 * Creates a new user.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @returns {Promise<void>}
 */
async function createUser(req, res) {
  try {
    const userId = await UserModel.createUser(req.body);
    res.status(201).json({ message: "User created", userId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create user", details: err.message });
  }
}

/**
 * Retrieves a user by their assetsId.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @returns {Promise<void>}
 */
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

/**
 * Updates a user's password.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @returns {Promise<void>}
 */
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

/**
 * Deletes a user by their assetsId.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @returns {Promise<void>}
 */
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

/**
 * Authenticates a user and starts a session.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @returns {Promise<void>}
 */
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
    req.session.user = { userId: user.userId, employeeId: user.employeeId, employeeType: user.employeeType  };
    req.session.createdAt = Date.now(); 
    res.status(200).json({ 
      message: "Login successful",
      user: { 
        userId: user.userId,
        employeeId: user.employeeId,
        employeeType: user.employeeType,
        HOD: typeof user.HOD === "string" ? user.HOD : "" // Always send HOD name or empty string
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

/**
 * Logs out a user and clears their session.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @returns {Promise<void>}
 */
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



/**
 * Registers a new user.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @returns {Promise<void>}
 */
async function register(req, res) {
  try {
   const { userId, password, employeeId, employeeType, employeeName } = req.body;
    console.log('Registration request for:', userId, 'Employee ID:', employeeId, 'Employee Type:', employeeType, employeeName,'employeeName');

    // Validate input
    if (!userId || !password || !employeeId || !employeeType || !employeeName) {
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
    const newUserId = await UserModel.createUser({ userId, password, employeeId, employeeType, employeeName });

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

/**
 * Changes a user's password after verifying their current password.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @returns {Promise<void>}
 */
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

// After login response
// console.log("Login response user object:", response.data.user);
// console.log("HOD value:", response.data.user.HOD);
// localStorage.setItem("HOD", response.data.user.HOD);