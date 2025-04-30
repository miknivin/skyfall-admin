import express from "express";
import { authorizeRoles, isAuthenticateUser } from "./../middlewares/auth.js";
import {
  addRooms,
  getAdminResorts,
  getResortById,
} from "../controllers/propertiesController.js";
import { validateAddRooms } from "../middlewares/validateAddRooms.js";

const router = express.Router();

router
  .route("/my-properties")
  .get(isAuthenticateUser, authorizeRoles("admin"), getAdminResorts);

router
  .route("/my-properties/:id")
  .get(isAuthenticateUser, authorizeRoles("admin"), getResortById);

router
  .route("/my-properties/:id/rooms")
  .put( isAuthenticateUser, authorizeRoles("admin"), validateAddRooms, addRooms);

export default router;
