const express = require("express");
const marketController = require("../controllers/marketController"); 
const upload = require("../middlewares/uploadMiddleware");
const authenticateToken = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/all_market_banner",authenticateToken,marketController.AllmarketplacebanneryFatch);
router.post("/get_market_product",authenticateToken,marketController.getMarketProduct);
router.post("/get_market_service",authenticateToken,marketController.getMarketService);
router.get("/all_best_business",authenticateToken,marketController.Allbestbusiness);
router.post("/get_business_product",authenticateToken,marketController.getBusinessProduct);
router.post("/get_business_service",authenticateToken,marketController.getBusinessService);
router.post("/add_product_requirment",authenticateToken,marketController.AddProductRequirment);
router.post("/get_product_requirment",authenticateToken,marketController.GetProductRequirment);
router.post("/add_to_product_cart",authenticateToken,marketController.addToProductCart);
router.post("/get_to_product_cart",authenticateToken,marketController.getToProductCart);
router.post("/delete_to_product_cart",authenticateToken,marketController.deleteToProductCart);
router.post('/update_to_cart',authenticateToken,marketController.Update_To_Cart);
router.post("/market_checkout_product",authenticateToken,marketController.CheckToCartmarket);
router.post("/market_order_product",authenticateToken,marketController.GetCheckoutOrder);
router.post("/market_order_details",authenticateToken,marketController.GetCheckoutOrderDetails);
router.post("/add_service_requiest",authenticateToken,marketController.addserviceRequiest);

module.exports = router;
