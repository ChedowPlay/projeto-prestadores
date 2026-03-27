/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

'use client';

import { Container, Form, Image, Modal } from "react-bootstrap";
import { useEffect, useState } from "react";

import Button from "@/app/components/Button";
import COLORS from "../../stylesheets/colors";
import NavbarComponent from "@/app/components/Navbar";
import ServiceForm from "@/app/components/ServiceForm";
import { useAuthUser } from "@/app/context/UserDataContext";

const EditarPerfil = () => {
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [bio, setBio] = useState("");
  const [cep, setCep] = useState("");
  const [street, setStreet] = useState("");
  const [number, setNumber] = useState("");
  const [brazilianStates, setBrazilianStates] = useState<string[]>([]);
  const [citiesByState, setCitiesByState] = useState<{ [key: string]: string[] }>({});
  const { user } = useAuthUser();
  const [userData, setUserData] = useState<any>(null);
  const [servicesList, setServicesList] = useState<Service[]>([]);
  const [servicesData, setServicesData] = useState<any>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);


  const API_URL = process.env.API_URL;
  const PROVIDER_ID = user?.provider_id || '';
  const token = user?.token || '';

  const headers = { "Content-Type": "application/json" };
  const endpoint = `/api/provider/${PROVIDER_ID}`;

  type Service = {
    macroService: string;
    microService: string;
    about: string;
    price: string;
    workImages: File[];
    workVideos: File[];
  };
  type Work = {
    service: string;
    category: string;
    price: string;
  };

  type ResponseData = {
    works: {
      data: Work[];
    };
  };


  // Função para buscar os estados do Brasil
  useEffect(() => {
    const loadStates = async () => {
      try {
        const response = await fetch(
          "https://servicodados.ibge.gov.br/api/v1/localidades/estados"
        );
        const data = await response.json();
        const states = data.map((state: { sigla: string }) => state.sigla);
        setBrazilianStates(states.sort());
      } catch (error) {
        console.error("Erro ao carregar estados:", error);
      }
    };
    loadStates();
  }, []);

  // Função para buscar as cidades de um estado
  useEffect(() => {
    const loadCitiesByState = async (state: string) => {
      if (!state) return;

      try {
        const citiesResponse = await fetch(
          `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${state}/municipios`
        );
        const citiesData = await citiesResponse.json();
        const cities = citiesData.map((city: { nome: string }) => city.nome);
        setCitiesByState((prevState) => ({ ...prevState, [state]: cities }));
      } catch (error) {
        console.error(`Erro ao carregar cidades para o estado ${state}:`, error);
      }
    };

    if (state) {
      loadCitiesByState(state);
    }
  }, [state]);
  useEffect(() => {
     const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const TOKEN = user?.token || '';
    const PROVIDER_ID = user?.provider_id ? `/${user.provider_id}` : '';

    const headers: HeadersInit = { "Content-Type": "application/json" };

    if (TOKEN) {
      headers["Authorization"] = `Bearer ${TOKEN}`;
    }

    const endpoint = TOKEN ? '/api/provider' : `/api/provider${PROVIDER_ID}`;

    fetch(API_URL + endpoint, { method: 'GET', headers })
      .then(resp => resp.json())
      .then(data => {

        setFullName(data.name || "");
        setPhone(data.phone || "");
        setWhatsapp(data.whatsapp || "");
        setCep(data.address?.cep || "");
        setStreet(data.address?.street || "");
        setNumber(data.address?.number || "");
        setBio(data.bio || "");
        setProfileImage(data.picture || "");

        if (data.address?.state) {
          setState(data.address.state);
        }
        if (data.address?.city) {
          setCity(data.address.city);
        }

        if (data.works?.data) {
          const services = (data.works.data as Work[]).map((work) => ({
            service: work.service,
            category: work.category,
            price: work.price,
          }));
        }

      })
      .catch(error => {
        console.error("Erro ao buscar dados do provedor:", error);
      });
  }, [user]);

  const handleSave = async () => {
    if (!token) {
      console.error("Token de autenticação não encontrado.");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/account`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          "name": fullName,
          "phone": phone.replace(/\D/g, ""),
          "whatsapp": whatsapp.replace(/\D/g, ""),
          "provider": {
            "bio": bio,
          },
          "address": {
            "cep": cep.replace(/\D/g, ""),
            "street": street.trim(),
            "number": number.trim(),
            "city": city.trim(),
            "state": state.toUpperCase(),
          },
        }),
      });

      const result = await response.json();
      if (response.ok) {
        setShowSuccessModal(true);
      } else {
        console.error("Erro ao atualizar dados:", result);
      }
    } catch (error) {
      console.error("Erro de rede ou ao fazer a requisição:", error);
    }
  };

  // const fetchServicesData = async () => {
  //   try {
  //     const response = await fetch("https://dev-diboaclub.onrender.com/api/service");
  //     const data = await response.json();
  //     setServicesData(data);
  //   } catch (error) {
  //     console.error("Erro ao buscar dados dos serviços:", error);
  //   }
  // };
  const handleServiceChange = (index: number, field: keyof Service, value: string) => {
    const updatedServices = [...servicesList];
    if (field === "macroService") {
      updatedServices[index].microService = "";
    }
    updatedServices[index] = {
      ...updatedServices[index],
      [field]: value,
    };
    setServicesList(updatedServices);
  };

  // const handleAddService = (e?: React.FormEvent) => {
  //   e?.preventDefault();
  //   if (servicesList.length < userData?.plan?.advantages?.service) {
  //     setServicesList([
  //       ...servicesList,
  //       { macroService: "", microService: "", about: "", price: "", workImages: [], workVideos: [] },
  //     ]);
  //   } else {
  //     alert(`Limite de ${userData?.plan?.advantages?.service} serviços atingido!`);
  //   }
  // };
  const base64ToBlob = (base64: string, mimeType: string) => {
    const byteCharacters = atob(base64.split(',')[1]);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
      const slice = byteCharacters.slice(offset, offset + 512);
      const byteNumbers = new Array(slice.length).fill(0).map((_, i) => slice.charCodeAt(i));
      byteArrays.push(new Uint8Array(byteNumbers));
    }

    return new Blob(byteArrays, { type: mimeType });
  };

  const handleImageSave = async () => {
    if (!token) {
      console.error("Token de autenticação não encontrado.");
      return;
    }

    if (!profileImage) {
      console.error("Nenhuma imagem foi selecionada.");
      return;
    }

    let profileImageFile;

    if (profileImage.startsWith("data:image")) {
      const mimeType = profileImage.split(";")[0].split(":")[1];
      const profileImageBlob = base64ToBlob(profileImage, mimeType);
      profileImageFile = new File([profileImageBlob], "profile-image.jpg", { type: mimeType });
    } else {
      console.error("A imagem não está no formato base64 esperado.");
      return;
    }

    const formData = new FormData();
    formData.append("picture", profileImageFile);

    try {
      const response = await fetch(`${API_URL}/api/account/picture`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        setProfileImage(result.picture);
      } else {
        console.error("Erro ao atualizar a imagem de perfil:", await response.json());
      }
    } catch (error) {
      console.error("Erro de rede ou ao fazer a requisição:", error);
    }
  };

  const handleSaveAll = async () => {
    if (profileImage !== user?.picture) {
      handleImageSave();
    }
    handleSave(); 
    setShowSuccessModal(true);
  };



  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPhone(formatPhone(value));
  };

  const handleWhatsappChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setWhatsapp(formatPhone(value));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const formatPhone = (value: string) => {
    value = value.replace(/\D/g, "");
    if (value.length <= 2) {
      return `(${value}`;
    } else if (value.length <= 6) {
      return `(${value.slice(0, 2)}) ${value.slice(2)}`;
    } else if (value.length <= 10) {
      return `(${value.slice(0, 2)}) ${value.slice(2, 6)}-${value.slice(6)}`;
    } else {
      return `(${value.slice(0, 2)}) ${value.slice(2, 7)}-${value.slice(7, 11)}`;
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
    <Container className=" align-items-center mx-auto shadow p-4 rounded" style={{ minHeight: "100vh", maxWidth: '1800px' }}>
      <NavbarComponent isLogin={false} isLogged={true} isRegister={false}/>
      <h2 className="mt-5 py-5">Editar Perfil</h2>

      <div className="text-center mt-3">
        <label htmlFor="profile-upload" style={{ cursor: "pointer" }}>
          {profileImage ? (
            <Image
              src={profileImage}
              alt="Imagem de perfil"
              width={150}
              height={150}
              crossOrigin="anonymous"
              className="rounded-circle"
            />
          ) : (
            <div
              style={{
                width: 150,
                height: 150,
                borderRadius: "50%",
                backgroundColor: "#f0f0f0",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontSize: "1.5rem",
                color: "#aaa",
              }}
            >
              +
            </div>
          )}
        </label>
        <input
          type="file"
          id="profile-upload"
          style={{ display: "none" }}
          onChange={handleImageUpload}
        />
      </div>

      <Form  className="shadow p-4 rounded"
        style={{ maxWidth: "800px", width: "90%" }} >
        <Form.Group className="mt-3 fw-bold">
          <Form.Label>Nome Completo</Form.Label>
          <Form.Control
            type="text"
            className="border-dark border-2"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mt-3 fw-bold">
          <h2 className="mt-4">Informações de Contato</h2>
          <Form.Label>Telefone</Form.Label>
          <Form.Control
            type="text"
            className="border-dark border-2"
            value={phone}
            onChange={handlePhoneChange}
            placeholder="(XX) XXXX-XXXX"
          />
        </Form.Group>

        <Form.Group className="mt-3 fw-bold">
          <Form.Label>WhatsApp</Form.Label>
          <Form.Control
            type="text"
            className="border-dark border-2"
            value={whatsapp}
            onChange={handleWhatsappChange}
            placeholder="(XX) XXXXX-XXXX"
          />
        </Form.Group>

        <Form.Group className="mt-3 fw-bold">
          <h2 className="mt-4">Localidade</h2>
          <Form.Group className="mt-3 fw-bold">
            <Form.Control
              type="text"
              className="border-dark border-2"
              value={cep} onChange={(e) => setCep(e.target.value.replace(/\D/g, ""))}
              placeholder="Digite o CEP" />

            <Form.Label>Rua</Form.Label>
            <Form.Control type="text"
              className="border-dark border-2"
              value={street} onChange={(e) => setStreet(e.target.value)}
              placeholder="Digite a rua" />

            <Form.Label>Número</Form.Label>
            <Form.Control type="text"
              className="border-dark border-2"
              value={number} onChange={(e) => setNumber(e.target.value)}
              placeholder="Digite o número" />
          </Form.Group>

          <Form.Label>Estado</Form.Label>
          <Form.Select
            className="border-dark border-2"
            value={state}
            onChange={(e) => setState(e.target.value)}
          >
            <option value="">Selecione um estado</option>
            {brazilianStates.map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        <Form.Group className="mt-3 fw-bold">
          <Form.Label>Cidade</Form.Label>
          <Form.Select
            className="border-dark border-2"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          >
            <option value="">Selecione uma cidade</option>
            {citiesByState[state]?.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        <Form.Group className="mt-3 fw-bold">
          <Form.Label>Sobre</Form.Label>
          <Form.Control
            className="border-dark border-2"
            as="textarea"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          />
        </Form.Group>
        <Button
        text="Salvar"
        color={COLORS.secondary}
        className="mt-3 w-25 mb-5"
        onClick={handleSaveAll} 
      />

        {servicesList && servicesList.length > 0 && servicesList.map((service, index) => (
          <div key={index} className="service-item">
            <label htmlFor={`service-${index}`}>Serviço</label>
            <input
              type="text"
              id={`service-${index}`}
              value={service.macroService}
              onChange={(e) => handleServiceChange(index, "macroService", e.target.value)}
              readOnly
            />
            <label htmlFor={`category-${index}`}>Categoria</label>
            <input
              type="text"
              id={`category-${index}`}
              value={service.microService}
              readOnly
            />
            <label htmlFor={`price-${index}`}>Preço</label>
            <input
              type="text"
              id={`price-${index}`}
              value={service.price}
              readOnly
            />
          </div>
        ))}

      </Form>

      <ServiceForm />
  

      <Modal show={showSuccessModal} onHide={() => setShowSuccessModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Sucesso</Modal.Title>
        </Modal.Header>
        <Modal.Body>Perfil atualizado com sucesso!</Modal.Body>
      </Modal>


    </Container>
    </div>
  );
};

export default EditarPerfil;
