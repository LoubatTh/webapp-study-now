export async function fetchApi<T>(
  method: "GET" | "POST" | "PUT" | "DELETE",
  endpoint: string,
  body?: T,
  token?: string | null
): Promise<{ data?: unknown; status: number; error?: string }> {

  const headers = new Headers({
    "Content-Type": "application/json",
    "Accept": "application/json"
  });

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const config: RequestInit = {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined
  };

  if (method === "GET" || method == "DELETE") {
    delete config.body;
  }

  try {
    const response = await fetch(`/api/${endpoint}`, config);
    const data = await response.json();
    if (!response.ok) {
      return {
        data,
        status: response.status,
        error: data.error || "Error occurred",
      };
    }
    return { data, status: response.status };
  } catch (error: any) {
    return {
      status: error.status || 500,
      error: error.message || "Unknown error occurred",
    };
  }
}
