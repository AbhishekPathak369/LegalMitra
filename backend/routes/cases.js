const express = require("express");
const router = express.Router();
const Case = require("../models/Case");
const { protect } = require("../middleware/auth");

// Get all cases for current user (both lawyer and client)
router.get("/my-cases", protect, async (req, res) => {
  try {
    let cases;
    
    if (req.user.role === 'lawyer') {
      cases = await Case.find({ lawyer: req.user.id }).sort({ createdAt: -1 });
    } else if (req.user.role === 'client') {
      cases = await Case.find({ client: req.user.id }).sort({ createdAt: -1 });
    } else {
      return res.status(403).json({ error: "Access denied" });
    }

    res.json({ success: true, cases });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new case (Lawyer)
router.post("/create", protect, async (req, res) => {
  try {
    if (req.user.role !== 'lawyer') {
      return res.status(403).json({ error: "Only lawyers can create cases" });
    }

    const caseData = {
      ...req.body,
      lawyer: req.user.id
    };

    const newCase = new Case(caseData);
    await newCase.save();

    res.status(201).json({ success: true, case: newCase });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new case (Client) - FIXED VERSION
router.post("/client/create", protect, async (req, res) => {
  try {
    console.log("Client case creation request:", req.body);
    console.log("User role:", req.user.role);
    
    if (req.user.role !== 'client') {
      return res.status(403).json({ 
        success: false, 
        error: "Only clients can create client cases" 
      });
    }

    // Map the form data to match your Case model
    const caseData = {
      caseName: req.body.caseName,
      caseType: req.body.caseType,
      caseNumber: req.body.caseNumber,
      courtName: req.body.courtName,
      filingDate: req.body.filingDate,
      nextHearing: req.body.nextHearing,
      caseDescription: req.body.caseDescription || req.body.description,
      lawyerName: req.body.lawyerName,
      lawyerEmail: req.body.lawyerEmail,
      lawyerPhone: req.body.lawyerPhone,
      client: req.user.id,
      clientName: req.user.name,
      clientEmail: req.user.email,
      status: 'ongoing',
      priority: 'medium'
    };

    console.log("Case data to save:", caseData);

    const newCase = new Case(caseData);
    await newCase.save();

    res.status(201).json({ 
      success: true, 
      message: "Case created successfully",
      case: newCase 
    });
  } catch (error) {
    console.error("Error creating client case:", error);
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
});

// Update case status (Both lawyer and client)
router.put("/:id/status", protect, async (req, res) => {
  try {
    const { status } = req.body;
    let updatedCase;

    if (req.user.role === 'lawyer') {
      updatedCase = await Case.findOneAndUpdate(
        { _id: req.params.id, lawyer: req.user.id },
        { status },
        { new: true }
      );
    } else if (req.user.role === 'client') {
      updatedCase = await Case.findOneAndUpdate(
        { _id: req.params.id, client: req.user.id },
        { status },
        { new: true }
      );
    }

    if (!updatedCase) return res.status(404).json({ msg: "Case not found" });
    res.json({ success: true, case: updatedCase });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update case notes (Both lawyer and client)
router.put("/:id/notes", protect, async (req, res) => {
  try {
    const { notes } = req.body;
    let updatedCase;

    if (req.user.role === 'lawyer') {
      updatedCase = await Case.findOneAndUpdate(
        { _id: req.params.id, lawyer: req.user.id },
        { notes },
        { new: true }
      );
    } else if (req.user.role === 'client') {
      updatedCase = await Case.findOneAndUpdate(
        { _id: req.params.id, client: req.user.id },
        { notes },
        { new: true }
      );
    }

    if (!updatedCase) return res.status(404).json({ msg: "Case not found" });
    res.json({ success: true, case: updatedCase });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update case details (Edit functionality)
router.put("/:id", protect, async (req, res) => {
  try {
    let updatedCase;

    if (req.user.role === 'lawyer') {
      updatedCase = await Case.findOneAndUpdate(
        { _id: req.params.id, lawyer: req.user.id },
        { ...req.body },
        { new: true }
      );
    } else if (req.user.role === 'client') {
      // Clients can only update specific fields for their cases
      const allowedFields = {
        caseName: req.body.caseName,
        caseType: req.body.caseType,
        caseNumber: req.body.caseNumber,
        courtName: req.body.courtName,
        filingDate: req.body.filingDate,
        nextHearing: req.body.nextHearing,
        caseDescription: req.body.caseDescription,
        lawyerName: req.body.lawyerName,
        lawyerEmail: req.body.lawyerEmail,
        lawyerPhone: req.body.lawyerPhone
      };

      updatedCase = await Case.findOneAndUpdate(
        { _id: req.params.id, client: req.user.id },
        { ...allowedFields },
        { new: true }
      );
    }

    if (!updatedCase) return res.status(404).json({ msg: "Case not found" });
    res.json({ success: true, case: updatedCase });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get solved cases
router.get("/solved-cases", protect, async (req, res) => {
  try {
    let solvedCases;
    
    if (req.user.role === 'lawyer') {
      solvedCases = await Case.find({ 
        lawyer: req.user.id, 
        status: 'solved' 
      }).sort({ updatedAt: -1 });
    } else if (req.user.role === 'client') {
      solvedCases = await Case.find({ 
        client: req.user.id, 
        status: 'solved' 
      }).sort({ updatedAt: -1 });
    } else {
      return res.status(403).json({ error: "Access denied" });
    }

    res.json({ success: true, cases: solvedCases });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get ongoing cases
router.get("/ongoing-cases", protect, async (req, res) => {
  try {
    let ongoingCases;
    
    if (req.user.role === 'lawyer') {
      ongoingCases = await Case.find({ 
        lawyer: req.user.id, 
        status: 'ongoing' 
      }).sort({ createdAt: -1 });
    } else if (req.user.role === 'client') {
      ongoingCases = await Case.find({ 
        client: req.user.id, 
        status: 'ongoing' 
      }).sort({ createdAt: -1 });
    } else {
      return res.status(403).json({ error: "Access denied" });
    }

    res.json({ success: true, cases: ongoingCases });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete case
router.delete("/:id", protect, async (req, res) => {
  try {
    let deletedCase;

    if (req.user.role === 'lawyer') {
      deletedCase = await Case.findOneAndDelete({
        _id: req.params.id,
        lawyer: req.user.id
      });
    } else if (req.user.role === 'client') {
      deletedCase = await Case.findOneAndDelete({
        _id: req.params.id,
        client: req.user.id
      });
    }

    if (!deletedCase) return res.status(404).json({ msg: "Case not found" });
    res.json({ success: true, message: "Case deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;