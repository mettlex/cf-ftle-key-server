import {
  handleKeyStoreRequest,
  handleKeyDeleteRequest,
  handleKeyReadRequest,
  handleKeyRecoverRequest,
} from "./api/key";

export const handleRequest = async (request: Request): Promise<Response> => {
  const url = new URL(request.url);
  const path = url.pathname.toLowerCase();

  let response = new Response(null);

  try {
    if (path.startsWith("/key/store")) {
      response = await handleKeyStoreRequest(request);
    } else if (path.startsWith("/key/read")) {
      response = await handleKeyReadRequest(request);
    } else if (path.startsWith("/key/recover")) {
      response = await handleKeyRecoverRequest(request);
    } else if (path.startsWith("/key/delete")) {
      response = await handleKeyDeleteRequest(request);
    }
  } catch (error) {
    console.error((error as { message: string }).message);
  }

  // Set CORS headers
  response.headers.set("Access-Control-Allow-Origin", url.origin);

  // Append to/Add Vary header so browser will cache response correctly
  response.headers.append("Vary", "Origin");

  response.headers.set("Content-Type", "application/json");

  return response;
};
