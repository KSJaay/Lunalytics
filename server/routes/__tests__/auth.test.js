import request from "supertest";
import express from "express";
import router from "../auth.js"; // correct relative path to router

// 🔹 Inline mocks directly inside this test file

jest.mock("../../middleware/auth/index.js", () => ({
  __esModule: true,
  register: (req, res) => res.send("register executed"),
  login: (req, res) => res.send("login executed"),
  logout: (req, res) => res.send("logout executed"),
  setup: (req, res) => res.send("setup executed"),
}));


jest.mock("../../middleware/auth/emailExists.js", () =>
  jest.fn((req, res) => res.send("email exists checked"))
);

jest.mock("../../middleware/auth/callback/custom.js", () =>
  jest.fn((req, res) => res.send("custom callback"))
);

jest.mock("../../middleware/auth/callback/discord.js", () =>
  jest.fn((req, res) => res.send("discord callback"))
);

jest.mock("../../middleware/auth/callback/github.js", () =>
  jest.fn((req, res) => res.send("github callback"))
);

jest.mock("../../middleware/auth/callback/google.js", () =>
  jest.fn((req, res) => res.send("google callback"))
);

jest.mock("../../middleware/auth/callback/slack.js", () =>
  jest.fn((req, res) => res.send("slack callback"))
);

jest.mock("../../middleware/auth/callback/twitch.js", () =>
  jest.fn((req, res) => res.send("twitch callback"))
);

jest.mock("../../middleware/auth/signInOrRegisterUsingAuth.js", () =>
  jest.fn((req, res) => res.send("sign in/register executed"))
);

jest.mock("../../middleware/auth/config/getConfig.js", () =>
  jest.fn((req, res) => res.send("config fetched"))
);

jest.mock("../../middleware/auth/config/update.js", () =>
  jest.fn((req, res) => res.send("config updated"))
);

jest.mock("../../middleware/authorization.js", () =>
  jest.fn((req, res, next) => next())
);

jest.mock("../../middleware/user/hasPermission.js", () => ({
  hasRequiredPermission: () => (req, res, next) => next(),
}));

jest.mock("../../middleware/auth/platform.js", () =>
  jest.fn((req, res) => res.send("redirect using provider"))
);

const app = express();
app.use(express.json());
app.use("/", router);

// ✅ All route tests
describe("Auth Router Tests", () => {
  test("POST /user/exists", async () => {
    const res = await request(app).post("/user/exists");
    expect(res.text).toBe("email exists checked");
  });

  test("POST /register", async () => {
    const res = await request(app).post("/register");
    expect(res.text).toBe("register executed");
  });

  test("POST /setup", async () => {
    const res = await request(app).post("/setup");
    expect(res.text).toBe("setup executed");
  });

  test("POST /login", async () => {
    const res = await request(app).post("/login");
    expect(res.text).toBe("login executed");
  });

  test("GET /logout", async () => {
    const res = await request(app).get("/logout");
    expect(res.text).toBe("logout executed");
  });

  test("GET /platform/:provider", async () => {
    const res = await request(app).get("/platform/google");
    expect(res.text).toBe("redirect using provider");
  });

  // 🔎 Callback routes
  test("GET /callback/custom", async () => {
    const res = await request(app).get("/callback/custom");
    expect(res.text).toBe("custom callback");
  });

  test("GET /callback/discord", async () => {
    const res = await request(app).get("/callback/discord");
    expect(res.text).toBe("discord callback");
  });

  test("GET /callback/github", async () => {
    const res = await request(app).get("/callback/github");
    expect(res.text).toBe("github callback");
  });

  test("GET /callback/google", async () => {
    const res = await request(app).get("/callback/google");
    expect(res.text).toBe("google callback");
  });

  test("GET /callback/slack", async () => {
    const res = await request(app).get("/callback/slack");
    expect(res.text).toBe("slack callback");
  });

  test("GET /callback/twitch", async () => {
    const res = await request(app).get("/callback/twitch");
    expect(res.text).toBe("twitch callback");
  });

  // 🛠 Config routes
  test("GET /config", async () => {
    const res = await request(app).get("/config");
    expect(res.text).toBe("config fetched");
  });

  test("POST /config/update", async () => {
    const res = await request(app).post("/config/update");
    expect(res.text).toBe("config updated");
  });
});
