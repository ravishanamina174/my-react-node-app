import { fetchJSON } from "./http";

export const putImage = async ({ file }) => {
  const { url, publicURL } = await fetchJSON(`/api/products/images`, {
    method: "POST",
    body: JSON.stringify({ fileType: file.type }),
  });

  const upload = await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": file.type,
    },
    body: file,
  });

  if (!upload.ok) {
    const text = await upload.text();
    throw new Error(`Image upload failed: ${upload.status} ${text}`);
  }

  return publicURL;
};