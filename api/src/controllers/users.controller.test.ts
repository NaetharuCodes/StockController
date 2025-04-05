import { describe, it, expect, vi, beforeEach } from "vitest";
import { createUser } from "./users.controller.js";
import { Role } from "@prisma/client";

vi.mock("../services/prisma.js");

import prisma from "../services/__mocks__/prisma.js";
import { create } from "domain";

describe("createUser", () => {
  let mockContext: any;

  beforeEach(() => {
    mockContext = {
      req: {
        json: vi.fn(),
      },
      json: vi.fn(),
    };
  });

  it("should create a user successfully", async () => {
    const userData = {
      name: "test user",
      email: "test@email.com",
      password: "password123",
      role: "USER" as Role,
    };

    mockContext.req.json.mockResolvedValue(userData);

    const createdUser = {
      id: "001",
      ...userData,
      organisationId: "ABC",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    prisma.user.create.mockResolvedValue(createdUser);

    await createUser(mockContext);

    expect(prisma.user.create).toHaveBeenCalledWith({ data: userData });

    expect(mockContext.json).toHaveBeenCalledWith(
      {
        message: "User created successfully",
        user: createdUser,
      },
      201
    );
  });

  it("should handle invalid JSON in requests body", async () => {
    const jsonParserError = new Error("Invalid JSON");
    mockContext.req.json.mockImplementation(() => {
      throw jsonParserError;
    });

    await createUser(mockContext);

    expect(mockContext.json).toHaveBeenCalledWith(
      { error: "Failed to create user" },
      400
    );
  });

  it("should handle any db errors generically", async () => {
    const genericError = new Error("Prisma Error");
    mockContext.req.json.mockImplementation(() => {
      throw genericError;
    });

    await createUser(mockContext);

    expect(mockContext.json).toHaveBeenCalledWith(
      {
        error: "Failed to create user",
      },
      400
    );
  });
});
