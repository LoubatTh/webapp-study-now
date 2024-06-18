export async function fetchApi<T>(
  method: "GET" | "POST" | "PUT" | "DELETE",
  endpoint: string,
  body?: T
): Promise<{ data?: unknown; status: number; error?: string }> {
  const headers = new Headers({
    "Content-Type": "application/json",
  });

  const config: RequestInit = {
    method,
    headers,
    body: body ? JSON.stringify(body) : null,
  };

  if (method === "GET") {
    delete config.body;
  }

  try {
    const response = await fetch(`/api/${endpoint}`, config);
    const data = await response.json();
    if (!response.ok) {
      return data;
    }
    return { data, status: response.status };
  } catch (error: any) {
    return {
      status: error.status || 500,
      error: error.message || "Unknown error occurred",
    };
  }
}
