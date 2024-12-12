import { API_LINK } from "./Constants";
export const uploadFile = async (selectedFile, folderName, filePrefix) => {
  const formData = new FormData();
  formData.append("files", selectedFile);

  try {
    const uploadResponse = await fetch(
      `${API_LINK}/Upload/UploadFiles?folderName=${encodeURIComponent(
        folderName
      )}&filePrefix=${encodeURIComponent(filePrefix)}`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!uploadResponse.ok) {
      throw new Error("Gagal mengunggah file");
    }

    return await uploadResponse.json(); // Assuming the server returns JSON response
  } catch (error) {
    console.error("Error during file upload:", error);
    throw error; // Re-throw the error to be handled by the caller
  }
};
