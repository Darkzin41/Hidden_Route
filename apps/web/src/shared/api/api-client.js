export class ApiError extends Error {
  constructor({ status, code, message, fields }) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.fields = fields;
  }
}

export function createApiClient(fetchImplementation = fetch) {
  async function request(path, options = {}) {
    const isFormData = options.body instanceof FormData;
    const response = await fetchImplementation(path, {
      credentials: "include",
      ...options,
      headers: {
        ...(isFormData
          ? {}
          : options.body
            ? { "Content-Type": "application/json" }
            : {}),
        ...options.headers,
      },
      body:
        options.body && !isFormData
          ? JSON.stringify(options.body)
          : options.body,
    });
    const isJson = response.headers
      .get("content-type")
      ?.includes("application/json");
    const payload = isJson ? await response.json() : null;

    if (!response.ok) {
      throw new ApiError({
        status: response.status,
        code: payload?.error?.code || "REQUEST_FAILED",
        message:
          payload?.error?.message || "Não foi possível concluir a solicitação.",
        fields: payload?.error?.fields,
      });
    }
    return payload?.data;
  }

  return {
    get: (path) => request(path),
    post: (path, body) => request(path, { method: "POST", body }),
    patch: (path, body) => request(path, { method: "PATCH", body }),
    delete: (path) => request(path, { method: "DELETE" }),
    upload: (path, formData) =>
      request(path, { method: "POST", body: formData }),
  };
}

export const api = createApiClient();
