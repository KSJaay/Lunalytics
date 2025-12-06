import request from "supertest";
import express from "express";
import router from "../incident.js"; // relative path to your router

// 🔹 Inline mocks

jest.mock("../../../shared/permissions/bitFlags.js", () => ({
  PermissionsBits: {
    VIEW_INCIDENTS: 1,
    MANAGE_INCIDENTS: 2,
  },
}));

jest.mock("../../middleware/user/hasPermission.js", () => ({
  hasRequiredPermission: (perm) => (req, res, next) => next(),
}));

jest.mock("../../middleware/incident/create.js", () =>
  jest.fn((req, res) => res.send("create incident executed"))
);

jest.mock("../../middleware/incident/getAll.js", () =>
  jest.fn((req, res) => res.send("get all incidents executed"))
);

jest.mock("../../middleware/incident/update.js", () =>
  jest.fn((req, res) => res.send("update incident executed"))
);

jest.mock("../../middleware/incident/addMessage.js", () =>
  jest.fn((req, res) => res.send("create incident message executed"))
);

jest.mock("../../middleware/incident/updateMessage.js", () =>
  jest.fn((req, res) => res.send("update incident message executed"))
);

jest.mock("../../middleware/incident/delete.js", () =>
  jest.fn((req, res) => res.send("delete incident executed"))
);

jest.mock("../../middleware/incident/deleteMessage.js", () =>
  jest.fn((req, res) => res.send("delete incident message executed"))
);

// 🔹 Setup Express app
const app = express();
app.use(express.json());
app.use("/", router);

// ✅ Tests
describe("Incident Router Tests", () => {
  test("GET /all", async () => {
    const res = await request(app).get("/all");
    expect(res.text).toBe("get all incidents executed");
  });

  test("POST /create", async () => {
    const res = await request(app).post("/create");
    expect(res.text).toBe("create incident executed");
  });

  test("POST /update", async () => {
    const res = await request(app).post("/update");
    expect(res.text).toBe("update incident executed");
  });

  test("POST /messages/create", async () => {
    const res = await request(app).post("/messages/create");
    expect(res.text).toBe("create incident message executed");
  });

  test("POST /messages/update", async () => {
    const res = await request(app).post("/messages/update");
    expect(res.text).toBe("update incident message executed");
  });

  test("POST /messages/delete", async () => {
    const res = await request(app).post("/messages/delete");
    expect(res.text).toBe("delete incident message executed");
  });

  test("POST /delete", async () => {
    const res = await request(app).post("/delete");
    expect(res.text).toBe("delete incident executed");
  });
});
