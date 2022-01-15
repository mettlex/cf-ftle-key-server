export const handleKeyDeleteRequest = async (
  request: Request,
): Promise<Response> => {
  const response = new Response(request.body);

  return response;
};
