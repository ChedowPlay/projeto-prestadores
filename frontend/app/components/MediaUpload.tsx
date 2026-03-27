/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { Card, Form, Row } from "react-bootstrap";
import React, { useEffect, useState } from "react";

import Button from "./Button";
import COLORS from "../stylesheets/colors";
import { Trash } from "react-bootstrap-icons";
import { useAuthUser } from "@/app/context/UserDataContext";

interface MediaUploaderProps {
  onUpload: (files: FileList | null) => void;
  providerId?: string; 
}

interface UploadedMedia {
  file_id: string;
  type: string;
  url: string;
}

const MediaUploader: React.FC<MediaUploaderProps> = ({ onUpload, providerId }) => {
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const [uploadedMedia, setUploadedMedia] = useState<UploadedMedia[]>([]);
  const { user } = useAuthUser();
  const token = user?.token || "";
  const PROVIDER_ID = providerId || user?.provider_id || "";
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const API = "/api/provider/file";

  useEffect(() => {
    const fetchUploadedMedia = async () => {
      try {
        const res = await fetch(`${API_URL}/api/provider/${PROVIDER_ID}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        const files = data.album?.data || [];
        setUploadedMedia(files);
      } catch (err) {
        console.error("Erro ao buscar mídias existentes:", err);
      }
    };

    if (token && PROVIDER_ID) {
      fetchUploadedMedia();
    }
  }, [token, PROVIDER_ID]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    setMediaFiles((prev) => [...prev, ...selectedFiles]);
    onUpload(e.target.files);
  };

  const handleRemoveLocal = (index: number) => {
    setMediaFiles((prev) => prev.filter((_, i) => i !== index));
  };


  const handleDeleteUploaded = async (file_id: string) => {
    if (!confirm("Tem certeza que deseja deletar este arquivo?")) return;
  
    try {
      const res = await fetch(`${API_URL}${API}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ file_id }), 
      });
      if (!res.ok) {
        const text = await res.text();
        console.error("Erro ao deletar:", text);
        throw new Error("Erro ao deletar arquivo");
      }
  
      setUploadedMedia((prev) => prev.filter((file) => file.file_id !== file_id));
    } catch (err) {
      console.error("Erro ao deletar mídia:", err);
      alert("Erro ao deletar o arquivo.");
    }
  };
  

  const uploadFile = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file, file.name);

    try {
      const response = await fetch(API_URL + API, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Erro no upload");

      setUploadedMedia((prev) => [...prev, result]); // adiciona no preview
    } catch (error) {
      console.error("❌ Erro no upload:", error);
      alert(`Erro ao enviar ${file.name}`);
    }
  };

  const [isUploading, setIsUploading] = useState(false);

const handleUploadClick = async () => {
  if (mediaFiles.length === 0) return;
  setIsUploading(true);

  try {
    await Promise.all(mediaFiles.map(uploadFile));
    setMediaFiles([]);
  } catch (error) {
    console.error("Erro ao enviar arquivos:", error);
  } finally {
    setIsUploading(false);
  }
};

  

  const renderPreview = (file: File, index: number) => {
    const url = URL.createObjectURL(file);
    const isImage = file.type.startsWith("image/");
    const isVideo = file.type.startsWith("video/");

    return (
      <Card
        className="m-2 shadow-sm"
        style={{ width: "150px", position: "relative" }}
        key={`local-${index}`}
      >
        {isImage && <Card.Img variant="top" src={url} style={{ height: "100px", objectFit: "cover" }} />}
        {isVideo && (
          <video width="100%" height="100" controls>
            <source src={url} type={file.type} />
            Seu navegador não suporta vídeo.
          </video>
        )}
        <Button
          text={<Trash />}
          color="#dc3545"
          className="position-absolute top-0 end-0 p-1 rounded-circle"
          onClick={() => handleRemoveLocal(index)}
        />
      </Card>
    );
  };

  const renderUploadedMedia = (media: UploadedMedia) => {
    const isImage = media.type === "image";
    const isVideo = media.type === "video";

    return (
      <Card
        className="m-2 shadow-sm"
        style={{ width: "150px", position: "relative" }}
        key={media.file_id}
      >
        {isImage && (
          <Card.Img
            variant="top"
            src={media.url}
            style={{ height: "100px", objectFit: "cover" }}
          />
        )}
        {isVideo && (
          <video width="100%" height="100" controls>
            <source src={media.url} type="video/mp4" />
            Seu navegador não suporta vídeo.
          </video>
        )}
        <Button
          text={<Trash />}
          color="#dc3545"
          className="position-absolute top-0 end-0 p-1 rounded-circle"
          onClick={() => handleDeleteUploaded(media.file_id)}
        />
      </Card>
    );
  };

  return (
    <div>
      <Form.Group controlId="formMediaUpload" className="mb-3">
        <Form.Label className="fw-bold">Adicione fotos ou vídeos</Form.Label>
        <Form.Control
          type="file"
          multiple
          accept="image/*,video/*"
          onChange={handleChange}
        />
      </Form.Group>

      {(uploadedMedia.length > 0 || mediaFiles.length > 0) && (
        <>
          <Row className="flex-nowrap overflow-auto" style={{ paddingBottom: "10px" }}>
            {uploadedMedia.map((media) => renderUploadedMedia(media))}
            {mediaFiles.map((file, index) => renderPreview(file, index))}
          </Row>

          {mediaFiles.length > 0 && (
           <Button
           text={isUploading ? "Enviando..." : "Enviar Arquivos"}
           color={COLORS.primary}
           onClick={handleUploadClick}
           disabled={isUploading}
         />
         
          )}
        </>
      )}
    </div>
  );
};

export default MediaUploader;
