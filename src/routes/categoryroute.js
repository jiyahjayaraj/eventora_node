const express = require("express");
const router = express.Router();
const categoryCtrl = require("../controllers/categoryController");

router.post("/create", categoryCtrl.createCategory);
router.get("/", categoryCtrl.getCategories);

module.exports = router;
