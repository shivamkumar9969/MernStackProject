
const express = require("express");
const { getAllProdutcs, createProduct, updateProduct, deleteProduct, getProductDetails } = require("../controllers/productController");
const productModels = require("../models/productModels");


const router = express.Router();


router.route("/products").get(getAllProdutcs);

router.route("/product/new").post(createProduct);
router.route("/product/:id").put(updateProduct).delete(deleteProduct).get(getProductDetails);

module.exports = router