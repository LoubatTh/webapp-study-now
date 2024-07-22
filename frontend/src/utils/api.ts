import { DataType } from "@/types/Api.type";

export async function fetchApi<T, D>(
  method: "GET" | "POST" | "PUT" | "DELETE",
  endpoint: string,
  body?: T,
  token?: string | null,
): Promise<{ data?: D | string | DataType; status: number; error?: string }> {
  
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
    let data: D | string | DataType;

    if (contentType && contentType.indexOf("application/json") !== -1) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    if (!response.ok) {
      const error = isDataType(data) ? data.error || "Error occurred" : "Error occurred";
      return {
        data,
        status: response.status,
        error: error,
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

function isDataType(data: any): data is DataType {
  return data && typeof data === 'object' && 'error' in data;
}