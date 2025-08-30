import { Router } from "express";
import * as ctrl from "../controllers/editorials.controller.js";

const router = Router();

// Pubbliche
router.get("/", ctrl.list);
router.get("/:idOrSlug", ctrl.getByIdOrSlug);

// Admin (aggiungi un tuo middleware se vuoi proteggerle)
router.post("/", ctrl.create);
router.put("/:idOrSlug", ctrl.update);
router.delete("/:idOrSlug", ctrl.remove);

export default router;

