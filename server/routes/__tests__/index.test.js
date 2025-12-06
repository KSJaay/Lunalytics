/**
 * @jest-environment node
 */
import request from "supertest";
import express from "express";
import initialiseRoutes from "../index.js"; // main router initializer

jest.mock("../auth.js", () => {
  const express = require("express");
  const router = express.Router();
  router.get("/", (req, res) => res.send("auth route executed"));
  return router;
});
jest.mock("../user.js", () => jest.fn((req, res) => res.send("user route executed")));
jest.mock("../tokens.js", () => jest.fn((req, res) => res.send("token route executed")));
jest.mock("../monitor.js", () => jest.fn((req, res) => res.send("monitor route executed")));
jest.mock("../invites.js", () => jest.fn((req, res) => res.send("invite route executed")));
jest.mock("../incident.js", () => jest.fn((req, res) => res.send("incident route executed")));
jest.mock("../provider.js", () => jest.fn((req, res) => res.send("provider route executed")));
jest.mock("../statusApi.js", () => jest.fn((req, res) => res.send("status api route executed")));
jest.mock("../statusPages.js", () => jest.fn((req, res) => res.send("status pages route executed")));
jest.mock("../notifications.js", () => jest.fn((req, res) => res.send("notifications route executed")));

jest.mock("../../middleware/fetchIcons.js", () => jest.fn((req, res) => res.send("fetch icons executed")));
jest.mock("../../middleware/authorization.js", () => jest.fn((req, res, next) => next()));
jest.mock("../../middleware/setupExists.js", () => jest.fn((req, res) => res.send("setup exists executed")));
jest.mock("../../middleware/status/defaultPage.js", () => jest.fn((req, res) => res.send("default page executed")));
jest.mock("../../middleware/getDockerContainers.js", () => jest.fn((req, res) => res.send("docker containers executed")));
jest.mock("../../middleware/status/statusPageUsingId.js", () => jest.fn((req, res) => res.send("status page by id executed")));
jest.mock("../../middleware/createPushHeartbeat.js", () => jest.fn((req, res) => res.send("push heartbeat executed")));

// 🔹 Setup Express app
const app = express();
app.use(express.json());
initialiseRoutes(app); // initialize all routes

// ✅ Tests
describe("Main Router Initialisation Tests", () => {
  test("GET /api/auth/setup/exists", async () => {
    const res = await request(app).get("/api/auth/setup/exists");
    expect(res.text).toBe("setup exists executed");
  });

  test("GET /", async () => {
    const res = await request(app).get("/");
    expect(res.text).toBe("default page executed");
  });

  test("GET /status/:id", async () => {
    const res = await request(app).get("/status/123");
    expect(res.text).toBe("status page by id executed");
  });

  test("POST /api/push", async () => {
    const res = await request(app).post("/api/push");
    expect(res.text).toBe("push heartbeat executed");
  });

  test("GET /api/icons", async () => {
    const res = await request(app).get("/api/icons");
    expect(res.text).toBe("fetch icons executed");
  });

  test("GET /api/docker/containers", async () => {
    const res = await request(app).get("/api/docker/containers");
    expect(res.text).toBe("docker containers executed");
  });

  // sub-route mounts
  test("sub-route /api/auth", async () => {
    const res = await request(app).get("/api/auth");
    expect(res.text).toBe("auth route executed");
  });

  test("sub-route /api/user", async () => {
    const res = await request(app).get("/api/user");
    expect(res.text).toBe("user route executed");
  });

  test("sub-route /api/tokens", async () => {
    const res = await request(app).get("/api/tokens");
    expect(res.text).toBe("token route executed");
  });

  test("sub-route /api/monitor", async () => {
    const res = await request(app).get("/api/monitor");
    expect(res.text).toBe("monitor route executed");
  });

  test("sub-route /api/invite", async () => {
    const res = await request(app).get("/api/invite");
    expect(res.text).toBe("invite route executed");
  });

  test("sub-route /api/incident", async () => {
    const res = await request(app).get("/api/incident");
    expect(res.text).toBe("incident route executed");
  });

  test("sub-route /api/providers", async () => {
    const res = await request(app).get("/api/providers");
    expect(res.text).toBe("provider route executed");
  });

  test("sub-route /api/status", async () => {
    const res = await request(app).get("/api/status");
    expect(res.text).toBe("status api route executed");
  });

  test("sub-route /api/status-pages", async () => {
    const res = await request(app).get("/api/status-pages");
    expect(res.text).toBe("status pages route executed");
  });

  test("sub-route /api/notifications", async () => {
    const res = await request(app).get("/api/notifications");
    expect(res.text).toBe("notifications route executed");
  });
});
