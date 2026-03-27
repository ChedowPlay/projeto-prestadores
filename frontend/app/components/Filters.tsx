/* eslint-disable react-hooks/exhaustive-deps */

import { Accordion, Form } from "react-bootstrap";
import React, { useEffect, useState } from "react";

import Button from "./Button";
import axios from "axios";

interface Service {
  label: string;
  value: number;
}

interface ServicesData {
  [category: string]: Service[];
}

interface FiltersProps {
  setFilteredCards: React.Dispatch<React.SetStateAction<Card[]>>;
}
// Definição do tipo para os cards
interface Card {
  provider_id: string;
  user_id: string;
  bio: string;
  name: string;
  picture: string;
  created_at: string;
  coordinates: null | { lat: number; lng: number };
  price: {
    min: number;
    max: number;
    avg: number;
  };
  business: {
    service: string;
    category: string;
  }[];
}

const Filters: React.FC<FiltersProps> = ({ setFilteredCards }) => {
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [services, setServices] = useState<ServicesData>({});
  const [selectedServices, setSelectedServices] = useState<number[]>([]);
  // const [filteredCards] = useState<Card[]>([]);
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 1024);
    };
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/service`);
        setServices(response.data);
      } catch (error) {
        console.error("Erro ao buscar os serviços:", error);
      }
    };
    fetchServices();
  }, []);

  const handleServiceChange = (value: number) => {
    setSelectedServices((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };
  const formatarListaBin = (listaIds: number[], length: number): number[] => {
    const resultado = Array(length).fill(0);
  
    listaIds.forEach(id => {
        if (id >= 0 && id < length) {
            resultado[length - id] = 1;  
        }
    });
  
    return resultado;
  };
  
  const binToDec = (listaBinaria: number[]): number => {
    const dec = listaBinaria.reduce((decimal, bit, index) => {
      return decimal + bit * Math.pow(2, listaBinaria.length - 1 - index);
    }, 0);
    return dec;
  };

const fetchFilteredCards = async () => {
  try {
    if (selectedServices.length === 0) {
      setFilteredCards([]);
      return;
    }

    const totalServices = Object.values(services).flat().length;

    if (totalServices === 0) {
      console.warn("Nenhum serviço disponível para calcular a lista binária.");
      return;
    }

    const lista = formatarListaBin(selectedServices, totalServices);

    const servicesValue = binToDec(lista);
    const url = `${API_URL}/search?page=1&limit=10&services=${servicesValue}`;

    const response = await axios.get(url);

    if (response.data && Array.isArray(response.data.data)) {
      setFilteredCards(response.data.data);
    } else {
      setFilteredCards([]);
    }
  } catch (error) {
    console.error("Erro ao buscar os cards filtrados:", error);
  }
};

  return (
    <div className="p-3 responsive-accordion">
      <Accordion alwaysOpen className="accordion filters-background">
        <Accordion.Item eventKey="0">
          <Accordion.Header>Tipos de serviço</Accordion.Header>
          <Accordion.Body>
            <Form.Check
              type="checkbox"
              label="Todos"
              checked={selectedServices.length === 0}
              onChange={() => setSelectedServices([])}
            />

            {isMobile && (
              <Accordion>
                {Object.entries(services).map(([category, items], index) => (
                  <Accordion.Item key={index} eventKey={index.toString()}>
                    <Accordion.Header>{category}</Accordion.Header>
                    <Accordion.Body>
                      {items.map((service) => (
                        <Form.Check
                          key={service.value}
                          type="checkbox"
                          label={service.label}
                          checked={selectedServices.includes(service.value)}
                          onChange={() => handleServiceChange(service.value)}
                        />
                      ))}
                    </Accordion.Body>
                  </Accordion.Item>
                ))}
              </Accordion>
            )}

            {isMobile && (
              <div className="pt-2">
                <Button text="Aplicar" color="c2" className="w-100" onClick={fetchFilteredCards} />
                <div className="pt-2">
                  <Button text="Limpar" color="white" className="w-100" onClick={() => setSelectedServices([])} />
                </div>
              </div>
            )}
          </Accordion.Body>
        </Accordion.Item>

        {!isMobile &&
          Object.entries(services).map(([category, items], index) => (
            <Accordion.Item key={index} eventKey={(index + 1).toString()}>
              <Accordion.Header>{category}</Accordion.Header>
              <Accordion.Body>
                {items.map((service) => (
                  <Form.Check
                    key={service.value}
                    type="checkbox"
                    label={service.label}
                    checked={selectedServices.includes(service.value)}
                    onChange={() => handleServiceChange(service.value)}
                  />
                ))}
              </Accordion.Body>
            </Accordion.Item>
          ))}

        {!isMobile && (
          <>
            <div className="pt-2">
              <Button text="Aplicar" color="c2" className="w-100" onClick={fetchFilteredCards} />
            </div>
            <div className="pt-2">
              <Button text="Limpar" color="white" className="w-100" onClick={() => setSelectedServices([])} />
            </div>
          </>
        )}
      </Accordion>
    </div>
  );
};

export default Filters;
