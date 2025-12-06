// Polyfill setImmediate for Jest
if (typeof setImmediate === "undefined") {
  global.setImmediate = (fn, ...args) => setTimeout(fn, 0, ...args);
}

// 🔹 Mock nanoid
jest.mock("nanoid", () => ({
  customAlphabet: () => () => "mocked-id",
}));

// 🔹 Mock config/logger
jest.mock("../../utils/config.js", () => ({ default: { info: jest.fn(), error: jest.fn() } }));

// 🔹 Mock database
jest.mock("../../database/sqlite/setup.js", () => ({}));
jest.mock("../../database/queries/invite.js", () => ({
  getAllInvites: jest.fn(),
  createInvite: jest.fn(),
  pauseInvite: jest.fn(),
  deleteInvite: jest.fn(),
}));

// 🔹 Mock invites router
jest.mock("../invites.js", () => {
  const express = require("express");
  const router = express.Router();
  router.get("/all", (req, res) => res.send("invite all route executed"));
  router.post("/create", (req, res) => res.send("invite create route executed"));
  router.post("/pause", (req, res) => res.send("invite pause route executed"));
  router.post("/delete", (req, res) => res.send("invite delete route executed"));
  return router;
});

// 🔹 Mock auth router (or any other router used in initialiseRoutes)
jest.mock("../auth.js", () => {
  const express = require("express");
  const router = express.Router();
  router.get("/config", (req, res) => res.send("auth config route executed"));
  router.post("/config/update", (req, res) => res.send("auth update route executed"));
  return router;
});

// 🔹 Mock authorization middleware
jest.mock("../../middleware/authorization.js", () => {
  return (req, res, next) => next(); // default export is a function
});


// 🔹 Now import express, supertest, and initialiseRoutes
import express from "express";
import request from "supertest";
import initialiseRoutes from "../index.js"; // main router initializer

// 🔹 Setup Express app
const app = express();
app.use(express.json());
initialiseRoutes(app); // initialize all routes (all routers mocked)

// ✅ Tests
describe("Invites Router Tests", () => {
  test("GET /api/invite/all", async () => {
    const res = await request(app).get("/api/invite/all");
    expect(res.text).toBe("invite all route executed");
  });

  test("POST /api/invite/create", async () => {
    const res = await request(app).post("/api/invite/create");
    expect(res.text).toBe("invite create route executed");
  });

  test("POST /api/invite/pause", async () => {
    const res = await request(app).post("/api/invite/pause");
    expect(res.text).toBe("invite pause route executed");
  });

  test("POST /api/invite/delete", async () => {
    const res = await request(app).post("/api/invite/delete");
    expect(res.text).toBe("invite delete route executed");
  });
});
