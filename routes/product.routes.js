import { Router } from "express";
import { productController } from "../controllers/productController.js";

const router = Router();

router.get("/", productController.findAll);
router.post("/", productController.create);

export default router;
