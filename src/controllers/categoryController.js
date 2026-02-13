const Category = require("../models/categoryModel");

exports.createCategory = async (req, res) => {
    console.log(req.body);
    
  try {
    const category = await Category.create(req.body);
    res.status(201).json(category);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getCategories = async (req, res) => {
  const categories = await Category.find();
  res.json(categories);
};
