import { Button, Form, InputGroup } from "react-bootstrap";
import React, { useState } from "react";

import { HiOutlineSearch } from "react-icons/hi";

export interface Service {
  service_id: string;
  label: string;
  value: number;
}

interface SearchBarProps {
  services: Service[];
  onSearchResults: (filteredServices: Service[]) => void;
}

const formatarListaBin = (listaIds: number[], length: number) => {
  const resultado = Array(length).fill(0);
  listaIds.forEach(id => {
    if (id <= length) resultado[length - id] = 1;
  });
  return resultado;
};

const binToDec = (listaBinaria: number[]) => {
  const decimal = listaBinaria.reduce((acc, bit, index) => {
    return acc + bit * Math.pow(2, listaBinaria.length - 1 - index);
  }, 0);
  return decimal;
};

const SearchBar: React.FC<SearchBarProps> = ({ services, onSearchResults }) => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    const filteredServices = services.filter(service =>
      service.label.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (filteredServices.length === 0) {

      return;
    }
    const serviceIds = filteredServices.map(service => service.value);

    const listaBinaria = formatarListaBin(serviceIds, 40);
    const servicesDecimal = binToDec(listaBinaria);
    const API_URL = process.env.API_URL;

    const searchUrl = `${API_URL}/search?page=1&services=${servicesDecimal}`;

    try {
      const response = await fetch(searchUrl);
      const data = await response.json();

      if (data.success) {
        onSearchResults(data.data);
      } else {
        console.error("Erro na busca de serviços:", data);
      }
    } catch (error) {
      console.error("Erro ao buscar provedores:", error);
    }
  };

  return (
    <Form className="d-flex justify-content-center">
      <InputGroup className="search">
        <Form.Control
          type="text"
          placeholder="O que você está procurando?"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border-dark rounded-start border-3"
        />
        <Button
          variant="border border-black border-3 bg-black"
          size="lg"
          className="rounded-end"
          onClick={handleSearch}
        >
          <HiOutlineSearch color="white" size={24} />
        </Button>
      </InputGroup>
    </Form>
  );
};

export default SearchBar;
