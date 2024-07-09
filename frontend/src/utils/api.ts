export async function fetchApi<T>(
  method: "GET" | "POST" | "PUT" | "DELETE",
  endpoint: string,
  body?: T,
  token?: string | null
): Promise<{ data?: unknown; status: number; error?: string }> {
  const headers = new Headers({
    "Content-Type": "application/json",
    Accept: "application/json",
  });

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const config: RequestInit = {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  };

  if (method === "GET" || method === "DELETE") {
    delete config.body;
  }

  try {
    const response = await fetch(`/api/${endpoint}`, config);
    const contentType = response.headers.get("content-type");
    let data;

    if (contentType && contentType.indexOf("application/json") !== -1) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    if (!response.ok) {
      return { status: response.status, error: data || response.statusText };
    }

    return { data, status: response.status };
  } catch (error: any) {
    return {
      status: error.status || 500,
      error: error.message || "Unknown error occurred",
    };
  }
}
