import { Hono } from "hono";
import {
  createUser,
  getAllUsers,
  getUser,
} from "../controllers/users.controller.js";

const userRoutes = new Hono();

userRoutes.post("/", createUser);
userRoutes.get("/", getAllUsers);
userRoutes.get("/", getUser);

export default userRoutes;
