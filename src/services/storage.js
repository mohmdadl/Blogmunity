export async function uploadImageToImgBB(imageFile) {
  if (!imageFile) return "";

  const formData = new FormData();
  formData.append("image", imageFile);

  const API_KEY = "5708d1b89a823acd41e8913fa44f24cc"; 

  const response = await fetch(`https://api.imgbb.com/1/upload?key=${API_KEY}` , {
    method: "POST",
    body: formData,
  });
  const data = await response.json();
  if (data.success) return data.data.url;
  throw new Error("Failed to upload image to ImgBB");
}
