const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { protect, generateToken } = require("../middleware/auth");

router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role, specialization, experience, barCouncilNumber, phone, address } = req.body;

    console.log("📝 Registration attempt:", { name, email, role, specialization, experience });

    // Prevent admin registration through normal registration
    if (role === 'admin') {
      return res.status(403).json({ 
        success: false,
        error: "Admin registration not allowed through this endpoint" 
      });
    }

    // Basic validation
    if (!name || !email || !password || !role) {
      return res.status(400).json({ 
        success: false,
        error: "Please enter all required fields" 
      });
    }

    // Lawyer-specific validation
    if (role === 'lawyer') {
      if (!specialization || !experience || !barCouncilNumber) {
        return res.status(400).json({ 
          success: false,
          error: "Lawyers must provide specialization, experience, and bar council number" 
        });
      }
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ 
        success: false,
        error: "User already exists with this email" 
      });
    }

    // Create user data object
    const userData = {
      name,
      email,
      password,
      role
    };

    // Add lawyer-specific fields if role is lawyer
    if (role === 'lawyer') {
      userData.specialization = specialization;
      userData.experience = experience;
      userData.barCouncilNumber = barCouncilNumber;
      userData.phone = phone || '';
      userData.address = address || '';
      userData.isVerified = false; // Lawyers need verification
       userData.verificationStatus = 'not_requested'; // CHANGED FROM 'pending'
      userData.joinTeamStatus = 'not_requested'; // ADDED THIS LINE
    }

    // For clients and students, mark as verified automatically
    if (role === 'client' || role === 'student') {
      userData.isVerified = true;
      userData.verificationStatus = 'approved';
    }

    console.log("✅ Creating user with data:", userData);

    const newUser = new User(userData);
    await newUser.save();

    const token = generateToken(newUser._id);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        isVerified: newUser.isVerified,
        hasPaid: newUser.hasPaid
      },
      message: role === 'lawyer' 
        ? "Registration successful! Your account is pending verification." 
        : "Registration successful!"
    });
  } catch (err) {
    console.error("❌ Registration error:", err);
    res.status(500).json({ 
      success: false,
      error: err.message 
    });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ msg: "Please enter all fields" });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    // Check if user is active
    if (!user.isActive && user.role !== 'admin') {
      return res.status(403).json({ 
        success: false,
        error: "Account is deactivated. Please contact administrator." 
      });
    }

    const token = generateToken(user._id);

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        hasPaid: user.hasPaid
      }
    });
  } catch (err) {

    res.status(500).json({ error: err.message });
  }
});

router.get("/me", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        hasPaid: user.hasPaid
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/mycollection", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        role: user.role,
        hasPaid: user.hasPaid
      },
      collection: []
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create admin user (one-time setup)
router.post('/create-admin', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Check if any admin already exists
    const existingAdmin = await User.findOne({ role: 'admin' });
    if (existingAdmin) {
      console.log('⚠️ Admin user already exists:', existingAdmin.email);
      return res.status(400).json({ 
        success: false, 
        error: 'Admin user already exists',
        admin: {
          id: existingAdmin._id,
          email: existingAdmin.email
        }
      });
    }

    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Name, email and password are required'
      });
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: 'Email already exists'
      });
    }

    // Create admin user with full privileges
    const adminUser = new User({
      name: name,
      email: email,
      password: password,
      role: 'admin',
      isVerified: true,
      isActive: true,
      hasPaid: true // Admin doesn't need payment
    });

    await adminUser.save();

    console.log('✅ Admin user created successfully:', adminUser.email);

    res.status(201).json({
      success: true,
      message: 'Admin user created successfully',
      user: {
        id: adminUser._id,
        name: adminUser.name,
        email: adminUser.email,
        role: adminUser.role
      }
    });
  } catch (error) {
    console.error('❌ Error creating admin:', error);
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
});

// Check if admin exists
router.get('/check-admin', async (req, res) => {
  try {
    const adminExists = await User.findOne({ role: 'admin' });
    
    res.json({
      success: true,
      adminExists: !!adminExists,
      admin: adminExists ? {
        id: adminExists._id,
        email: adminExists.email,
        name: adminExists.name
      } : null
    });
  } catch (error) {
    console.error('Error checking admin:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;