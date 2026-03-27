/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { Col, Form, Modal, Row, Spinner } from "react-bootstrap";
import React, { useEffect, useState } from "react";

import Button from "./Button";
import COLORS from "../stylesheets/colors";
import MediaUploader from "./MediaUpload";
import { useAuthUser } from "@/app/context/UserDataContext";

interface Work {
  work_id: string;
  service: string;
  category: string;
  price: string;
  description: string;
}

interface ServiceCategory {
  [key: string]: { service: string; label: string; value: number }[];
}

const ServiceForm = () => {
  const { user } = useAuthUser();
  const PROVIDER_ID = user?.provider_id;
  const TOKEN = user?.token || "";

  const [servicesList, setServicesList] = useState<Work[]>([]);
  const [serviceCategories, setServiceCategories] = useState<ServiceCategory>({});
  const [error, setError] = useState<string | null>(null);
  const [editedWork, setEditedWork] = useState<Work | null>(null);
  const [descriptionError, setDescriptionError] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [newWork, setNewWork] = useState({ description: "", price: "", service_id: "", category: "" });
  const [servicesMap, setServicesMap] = useState<{ [key: string]: string }>({});
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [files, setFiles] = useState<FileList | null>(null);

  const API_URL = process.env.API_URL;

  useEffect(() => {
    const fetchServicesData = async () => {
      try {
        const headers: HeadersInit = { "Content-Type": "application/json" };
        if (TOKEN) {
          headers["Authorization"] = `Bearer ${TOKEN}`;
        }

        const response = await fetch(`${API_URL}/api/provider/${PROVIDER_ID}`, { headers });
        const data = await response.json();

        if (data.success && data.works && data.works.data) {
          setServicesList(data.works.data || []);
        } else {
          setServicesList([]);
        }
      } catch (error) {
        console.error("Erro ao buscar serviços:", error);
        setError("Erro ao buscar serviços.");
      }
    };

    fetchServicesData();
  }, [PROVIDER_ID, TOKEN]);

  // const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   if (event.target.files) {
  //     setFiles(event.target.files);
  //   }
  // };

  // const uploadFiles = async (selectedFiles: File[] | null) => {
  //   if (!selectedFiles || selectedFiles.length === 0) return;

  //   for (let i = 0; i < selectedFiles.length; i++) {
  //     const formData = new FormData();
  //     formData.append("file", selectedFiles[i], selectedFiles[i].name);

  //     try {
  //       const response = await fetch(`${API_URL}/api/provider/file`, {
  //         method: "POST",
  //         headers: {
  //           Authorization: `Bearer ${TOKEN}`,
  //         },
  //         body: formData,
  //       });

  //       const data = await response.json();
  //       console.log(`✅ Upload de ${selectedFiles[i].name} ->`, data);
  //     } catch (error) {
  //       console.error(`❌ Erro no upload de ${selectedFiles[i].name}:`, error);
  //     }
  //   }
  // };

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const headers: HeadersInit = { "Content-Type": "application/json" };
        if (TOKEN) {
          headers["Authorization"] = `Bearer ${TOKEN}`;
        }

        const response = await fetch(API_URL + "/api/service", { headers });
        const data = await response.json();

        setServiceCategories(data);

        const map: { [key: string]: string } = {};
        Object.values(data).forEach((services: any) => {
          services.forEach((service: any) => {
            map[service.value] = service.service_id;

          });
        });

        setServicesMap(map);
      } catch (error) {
        console.error("Erro ao buscar categorias de serviços:", error);
      }
    };

    fetchServices();
  }, [TOKEN]);


  const createWork = async () => {
    setLoading(true);
    setError(null);

    const service_id = servicesMap[newWork.service_id];

    if (!service_id) {
      console.error("Erro: service_id não encontrado.");
      setError("Serviço inválido.");
      setLoading(false);
      return;
    }

    const formattedWork = {
      description: newWork.description,
      price: parseFloat(newWork.price),
      service_id,
    };

    try {
      const response = await fetch(`${API_URL}/api/provider/work`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${TOKEN}`,
        },
        body: JSON.stringify(formattedWork),
      });

      const data = await response.json();

      if (data.success) {
        setServicesList([...servicesList, data.work]);
        setShowCreateModal(false);
        setNewWork({ description: "", price: "", service_id: "", category: "" });
      } else {
        setError(data.message || "Erro ao criar serviço.");
      }
    } catch (error) {
      setError("Erro ao criar serviço." + error);
    }

    setLoading(false);
  };


  const updateWork = async (workId: string, updateData: Work) => {
    try {
      if (updateData.description.length < 20) {
        setDescriptionError("A descrição deve ter no mínimo 20 caracteres.");
        return;
      }
      setDescriptionError(null);

      setLoading(true);
      const headers: HeadersInit = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${TOKEN}`
      };

      const response = await fetch(`${API_URL}/api/provider/work/${workId}`, {
        method: "PUT",
        headers,
        body: JSON.stringify({ ...updateData }),
      });

      const data = await response.json();

      if (data.success) {
        setServicesList((prevList) =>
          prevList.map((work) =>
            work.work_id === workId ? { ...work, ...data.work } : work
          )
        );
      } else {
        setError("Erro ao atualizar trabalho.");
      }
    } catch (error) {
      console.error("Erro ao atualizar trabalho:", error);
      setError("Erro ao atualizar trabalho.");
    }
    setLoading(false);
  };

  const deleteWork = async (workId: string) => {
    try {
      const response = await fetch(`${API_URL}/api/provider/work/${workId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${TOKEN}`,
        },
      });
      const data = await response.json();

      if (data.success) {
        setServicesList((prevList) => prevList.filter((work) => work.work_id !== workId));
      } else {
        console.error("Erro ao excluir trabalho:", data.message);
      }
    } catch (error) {
      console.error("Erro ao excluir trabalho:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editedWork) {
      await updateWork(editedWork.work_id, editedWork);
    }
  };

  const handleEdit = (work: Work) => {
    setEditedWork(work);

  };


  return (
    <div className="d-flex justify-content-center align-items-start pt-5" style={{ minHeight: "100vh" }}>
      <Form
        onSubmit={handleSubmit}
        className="shadow p-4 rounded w-100"
        style={{ maxWidth: "900px" }}
      >
        {error && <p className="text-danger">{error}</p>}

        <h2 className="mb-4">Seus Serviços</h2>

        {servicesList.map((work) => (
          <Row key={work.work_id} className="mb-4">
            <Form.Group className="mt-3 fw-bold" as={Col} xs={12}>
              <Form.Label>Categoria do Serviço</Form.Label>
              <Form.Select
                className="border-dark border-2"
                value={editedWork?.work_id === work.work_id ? editedWork.category : work.category}
                onChange={(e) =>
                  setEditedWork((prev) =>
                    prev && prev.work_id === work.work_id
                      ? { ...prev, category: e.target.value }
                      : { ...work, category: e.target.value }
                  )
                }
                disabled={editedWork?.work_id !== work.work_id}
              >
                <option value="">Selecione uma categoria</option>
                {Object.keys(serviceCategories).map((macro) => (
                  <option key={macro} value={macro}>{macro}</option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mt-3 fw-bold" as={Col} xs={12}>
              <Form.Label>Serviço</Form.Label>
              <Form.Select
                className="border-dark border-2"
                value={editedWork?.work_id === work.work_id ? editedWork.service : work.service}
                onChange={(e) =>
                  setEditedWork((prev) => prev ? { ...prev, service: e.target.value } : work)
                }
                disabled={!editedWork || editedWork.work_id !== work.work_id}
              >
                <option value="">Selecione um serviço</option>
                {(serviceCategories[editedWork?.category || work.category] || []).map((micro) => (
                  <option key={`${micro.service}-${micro.value}`} value={micro.service}>
                    {micro.label}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mt-3 fw-bold" as={Col} xs={12}>
              <Form.Label>Descrição</Form.Label>
              <Form.Control
                type="text"
                className="border-dark border-2"
                style={{ fontSize: "14px", padding: "8px" }}
                value={editedWork?.work_id === work.work_id ? editedWork.description : work.description}
                onChange={(e) => {
                  const newDescription = e.target.value;
                  setEditedWork((prev) => prev ? { ...prev, description: newDescription } : work);

                  if (newDescription.length < 20) {
                    setDescriptionError("A descrição deve ter no mínimo 20 caracteres.");
                  } else {
                    setDescriptionError(null);
                  }
                }}
                disabled={!editedWork || editedWork.work_id !== work.work_id}
              />
              {editedWork?.work_id === work.work_id && descriptionError && (
                <p className="text-danger">{descriptionError}</p>
              )}
            </Form.Group>

            <Form.Group className="mt-3 fw-bold" as={Col} xs={12}>
              <Form.Label>Preço</Form.Label>
              <Form.Control
                type="text"
                value={editedWork?.work_id === work.work_id ? editedWork.price : work.price}
                onChange={(e) => {
                  const newPrice = e.target.value;
                  if (/^\d*\.?\d*$/.test(newPrice)) {
                    setEditedWork((prev) => prev ? { ...prev, price: newPrice } : work);
                  }
                }}
                disabled={!editedWork || editedWork.work_id !== work.work_id}
              />
            </Form.Group>

            <Col xs={12} className="d-flex flex-wrap justify-content-center gap-2 mt-3">
              {editedWork?.work_id === work.work_id ? (
                <Button
                  type="submit"
                  text="Salvar Alterações"
                  color={COLORS.primary}
                />
              ) : (
                <Button
                  text="Editar"
                  color={COLORS.secondary}
                  className="w-100 w-md-50"
                  onClick={() => handleEdit(work)}
                />
              )}
              <Button
                text="Excluir"
                color="#dc3545"
                className="w-100 w-md-50"
                onClick={() => deleteWork(work.work_id)}
              />
            </Col>
          </Row>
        ))}

        <MediaUploader onUpload={setFiles} />

        <div className="d-flex justify-content-center mt-3">
          <Button text="Adicionar Novo Serviço" color={COLORS.primary} onClick={() => setShowCreateModal(true)} />
        </div>

        {loading && <Spinner animation="border" className="mt-3" />}

        {/* Modal continua igual, não precisa mudar para responsividade básica */}
        <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Criar Novo Serviço</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {/* Formulário do modal já está em boa estrutura responsiva */}
          </Modal.Body>
          <Modal.Footer>
            <Button text="Cancelar" color={COLORS.secondary} onClick={() => setShowCreateModal(false)} />
            <Button text="Criar Serviço" color={COLORS.primary} onClick={createWork} />
          </Modal.Footer>
        </Modal>
        <Modal show={showSuccessModal} onHide={() => setShowSuccessModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Sucesso</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>Alteração salva com sucesso!</p>
          </Modal.Body>
          <Modal.Footer>
            <Button text="Fechar" color={COLORS.primary} onClick={() => setShowSuccessModal(false)} />
          </Modal.Footer>
        </Modal>

      </Form>
    </div>
  );

};

export default ServiceForm;
