import express from "express";
import { authorizeRoles, isAuthenticateUser } from "./../middlewares/auth.js";
import {
  addEventSpace,
  addRooms,
  getAdminResorts,
  getResortById,
} from "../controllers/propertiesController.js";
import { validateAddRooms } from "../middlewares/validateAddRooms.js";
import { validateEventSpace } from "../middlewares/validateAddEvents.js";

const router = express.Router();

router
  .route("/my-properties")
  .get(isAuthenticateUser, authorizeRoles("admin"), getAdminResorts);

router
  .route("/my-properties/:id")
  .get(isAuthenticateUser, authorizeRoles("admin"), getResortById);

router
  .route("/my-properties/:id/rooms")
  .put(isAuthenticateUser, authorizeRoles("admin"), validateAddRooms, addRooms);

router
  .route("/my-properties/:id/event-space")
  .put(
    isAuthenticateUser,
    authorizeRoles("admin"),
    validateEventSpace,
    addEventSpace
  );
export default router;
