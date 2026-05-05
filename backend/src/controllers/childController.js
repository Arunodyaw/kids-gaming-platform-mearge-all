const ChildProfile = require('../models/ChildProfile');

const getChildren = async (req, res) => {
  try {
    const children = await ChildProfile.find({ parentId: req.user.id });
    res.json({ success: true, data: children });
  } catch (error) {
    console.error('❌ Get children error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch children' });
  }
};

const createChild = async (req, res) => {
  try {
    const { childName, childAge, diagnosis, notes, preferences } = req.body;
    const child = new ChildProfile({
      parentId: req.user.id,
      childName,
      childAge,
      diagnosis,
      notes,
      preferences
    });
    await child.save();
    res.status(201).json({ success: true, data: child });
  } catch (error) {
    console.error('❌ Create child error:', error);
    res.status(500).json({ success: false, message: 'Failed to create child' });
  }
};

module.exports = { getChildren, createChild };