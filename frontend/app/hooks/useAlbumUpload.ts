import { useState } from "react";

const API_URL = process.env.API_URL;
const API = "/api/provider/file";

const useAlbumUpload = (token: string) => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  

  const uploadFile = async (file: File) => {
    if (!file) {
      return { success: false, message: "Nenhum arquivo selecionado" };
    }

    if (file.size > 100 * 1024 * 1024) {
      return { success: false, message: "Arquivo excede o limite de 100MB" };
    }

    const formData = new FormData();
    formData.append("file", file);

    setIsUploading(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}${API}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        return {
          success: true,
          url: result.url,
          file_id: result.file_id,
          type: result.type,
        };
      } else {
        return {
          success: false,
          message: result.message || "Erro ao enviar arquivo",
        };
      }
    } catch (err) {
      console.error("❌ Erro na conexão:", err);
      setError("Erro na conexão com o servidor");
      return { success: false, message: "Erro na conexão com o servidor" };
    } finally {
      setIsUploading(false);
    }
  };

  return { uploadFile, isUploading, error };
};

export default useAlbumUpload;
