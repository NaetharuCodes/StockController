import type { Context } from "hono";
import prisma from "../services/prisma.js";

export const createUser = async (c: Context) => {
  try {
    const body = await c.req.json();

    const user = await prisma.user.create({
      data: {
        name: body.name,
        email: body.email,
        password: body.password,
        role: body.role,
      },
    });

    return c.json({ message: "User created successfully", user }, 201);
  } catch (error) {
    console.error("Error creating user", error);
    return c.json({ error: "Failed to create user" }, 400);
  }
};

export const getAllUsers = async (c: Context) => {
  try {
    const name = c.req.query("name");
    const email = c.req.query("email");

    const where: any = {};
    if (name) where.name = name;
    if (email) where.email = email;

    const users = await prisma.user.findMany({
      where,
    });

    return c.json({ message: "Users found", users }, 200);
  } catch (error) {
    console.error("Error getting user", error);
    return c.json({ error: "Failed to get user" }, 400);
  }
};

export const getUser = async (c: Context) => {
  try {
    const id = c.req.param("id");

    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      return c.json({ error: "User not found" }, 404);
    }

    return c.json({ message: "User found", user }, 200);
  } catch (error) {
    console.error("Error getting user", error);
    return c.json({ error: "Failed to get user" }, 400);
  }
};
