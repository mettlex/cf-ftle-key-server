import { handleRequest } from "../src/handlers";
import makeServiceWorkerEnv from "service-worker-mock";

declare var global: any;

describe("handle", () => {
  beforeEach(() => {
    Object.assign(global, makeServiceWorkerEnv());
    jest.resetModules();
  });

  test("send 405 error for GET", async () => {
    const result = await handleRequest(new Request("/", { method: "GET" }));
    expect(result.status).toEqual(405);
  });
});
