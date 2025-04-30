import express from "express";
import { validateAdminRequest } from "./../middlewares/validateAdminRequest.js";
import { createAdminRequest } from "../controllers/adminController.js";

const router = express.Router();

router.route("/admin/request").post(validateAdminRequest, createAdminRequest);

export default router;
