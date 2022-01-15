import { handleRequest } from "../src/handlers";
import makeServiceWorkerEnv from "service-worker-mock";

declare var global: any;

describe("handle", () => {
  beforeEach(() => {
    Object.assign(global, makeServiceWorkerEnv());
    jest.resetModules();
  });

  test("/key/store - handle key store", async () => {
    const result = await handleRequest(
      new Request("/key/store", { method: "POST" }),
    );

    expect(result.status).toEqual(500);
  });
});
