export const API_BASE = import.meta.env.VITE_BASE_URL ?? "http://localhost:8000";

export async function checkBackend() {
  const endpoints = [
    "/health",
    "/api/categories",
    "/api/products",
    "/api/products?categoryId=<REPLACE_WITH_VALID_ID>",
  ];
  for (const path of endpoints) {
    try {
      const res = await fetch(`${API_BASE}${path}`, { credentials: "include" });
      const text = await res.text();
      // eslint-disable-next-line no-console
      console.log(path, res.status, text);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error("Failed:", path, e);
    }
  }
}

export async function fetchJSON(path, init) {
  const headers = new Headers({ "Content-Type": "application/json" });
  if (init && init.headers) {
    const provided = new Headers(init.headers);
    provided.forEach((value, key) => headers.set(key, value));
  }

  try {
    const clerk = typeof window !== "undefined" ? window.Clerk : undefined;
    if (clerk && clerk.session && typeof clerk.session.getToken === "function") {
      const token = await clerk.session.getToken();
      if (token) headers.set("Authorization", `Bearer ${token}`);
    }
  } catch (_) {
    // ignore auth header if Clerk is unavailable
  }

  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers,
  });

  const bodyText = await res.text();
  const data = bodyText ? JSON.parse(bodyText) : null;
  if (!res.ok) {
    const message = data && data.message ? data.message : `Request failed: ${res.status} ${res.statusText}`;
    throw new Error(message);
  }
  return data;
}

export function validateImageFile(file) {
  const allowed = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
  if (!allowed.includes(file.type)) {
    return "Only PNG, JPG, JPEG, WEBP files are allowed";
  }
  if (file.size > 5 * 1024 * 1024) {
    return "File size must be <= 5MB";
  }
  return null;
}


