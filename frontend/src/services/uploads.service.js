import api from "./api";

export async function uploadPhoto(file) {
  const formData = new FormData();
  formData.append("photo", file);
  const { data } = await api.post("/uploads", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data.photoUrl;
}
