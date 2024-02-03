
const express = require("express");
const { getAllProdutcs, createProduct, updateProduct, deleteProduct, getProductDetails } = require("../controllers/productController");
const { isAuthenticatedUser, authorizeRoles } = require("../Middleware/auth");




const router = express.Router();


router.route("/products").get( getAllProdutcs);

router.route("/product/new").post(isAuthenticatedUser,authorizeRoles("admin") ,createProduct);
router.route("/product/:id")
.put(isAuthenticatedUser,authorizeRoles("admin") , updateProduct)
.delete(isAuthenticatedUser,authorizeRoles("admin") , deleteProduct)
.get(getProductDetails);

module.exports = router