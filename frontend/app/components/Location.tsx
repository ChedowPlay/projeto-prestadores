/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { Accordion, Form } from "react-bootstrap";
import React, { useEffect, useState } from "react";

import Button from "./Button";
import axios from "axios";
import styles from "../stylesheets/Location.module.css";

interface City {
  label: string;
  value: number;
}

interface LocationsData {
  [state: string]: City[];
}

interface LocationProps {
  onResultsUpdate: (results: any[]) => void;
  onClearFilters?: () => void; 
}


const Location: React.FC<LocationProps> = ({ onResultsUpdate }) => {
  const [isMobile, setIsMobile] = useState(false);
  const [locations, setLocations] = useState<LocationsData>({});
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [selectedCities, setSelectedCities] = useState<number[]>([]);
  const [selectedDistance, setSelectedDistance] = useState<number | null>(null);
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
    const fetchLocations = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/location`);
        setLocations(response.data);
      } catch (error) {
        console.error("Erro ao buscar localidades:", error);
      }
    };
    fetchLocations();
  }, []);

  const handleStateSelection = (state: string) => {
    setSelectedState(state);
    setSelectedCities([]);
  };

  const handleCitySelection = (cityValue: number) => {
    setSelectedCities((prev) =>
      prev.includes(cityValue) ? prev.filter((v) => v !== cityValue) : [...prev, cityValue]
    );
  };

  const handleDistanceSelection = (distance: number | null) => {
    setSelectedDistance(distance);
  };

  const applyFilters = async () => {
    try {
      const params = new URLSearchParams();
      params.append("page", "1"); 
      params.append("minprice", "50");
      params.append("maxprice", "200");
      params.append("sortprice", "asc");
  
      if (selectedState) params.append("state", selectedState);
      if (selectedCities.length) params.append("cities", selectedCities.join(","));
      
      if (selectedDistance !== null) {
        params.append("maxdistance", selectedDistance.toString());
        params.append("sortdistance", "asc");
      }

      params.append("lat", "-20.524801");
      params.append("lon", "-54.657841");
  
      const response = await axios.get(`${API_URL}/search?${params.toString()}`);
      onResultsUpdate(response.data.data);
    } catch (error) {
      console.error("Erro ao buscar resultados:", error);
    }
  };
  
  const clearFilters = async () => {
    setSelectedState(null);
    setSelectedCities([]);
    setSelectedDistance(null);
    
    try {
      const response = await axios.get(`${API_URL}/search?page=1`);
      onResultsUpdate(response.data.data);
    } catch (error) {
      console.error("Erro ao buscar resultados originais:", error);
    }
  };
  

  return (
    <div className={styles.sizeAcordion}>
      <Accordion alwaysOpen className={styles.locationBackground}>
        <Accordion.Item eventKey="0" className={styles.border}>
          <Accordion.Header>Localidade</Accordion.Header>
          <Accordion.Body className={styles.border}>
            <Form.Check
              type="checkbox"
              label="Todos"
              checked={!selectedState && selectedCities.length === 0 && selectedDistance === null}
              onChange={clearFilters}
            />
            <hr />
            <Accordion>
              <Accordion.Item eventKey="1">
                <Accordion.Header>Estado</Accordion.Header>
                <Accordion.Body>
                  {Object.keys(locations).map((state) => (
                    <Form.Check
                      key={state}
                      type="radio"
                      label={state}
                      checked={selectedState === state}
                      onChange={() => handleStateSelection(state)}
                    />
                  ))}
                </Accordion.Body>
              </Accordion.Item>

              {selectedState && locations[selectedState] && (
                <Accordion.Item eventKey="2">
                  <Accordion.Header>Cidade</Accordion.Header>
                  <Accordion.Body>
                    {locations[selectedState].map((city) => (
                      <Form.Check
                        key={city.value}
                        type="checkbox"
                        label={city.label}
                        checked={selectedCities.includes(city.value)}
                        onChange={() => handleCitySelection(city.value)}
                      />
                    ))}
                  </Accordion.Body>
                </Accordion.Item>
              )}

              <Accordion.Item eventKey="3">
                <Accordion.Header>Proximidade</Accordion.Header>
                <Accordion.Body>
                  {[5, 10, 20, 50, 100].map((distance) => (
                    <Form.Check
                      key={distance}
                      type="radio"
                      label={`Até ${distance}km`}
                      checked={selectedDistance === distance}
                      onChange={() => handleDistanceSelection(distance)}
                    />
                  ))}
                  <Form.Check
                    type="radio"
                    label="Sem limite de distância"
                    checked={selectedDistance === null}
                    onChange={() => handleDistanceSelection(null)}
                  />
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>

            <div className="pt-2">
              <Button text="Aplicar" color="c2" className="w-100" onClick={applyFilters} />
              <div className="pt-2">
                <Button text="Limpar" color="white" className="w-100" onClick={clearFilters} />
              </div>
            </div>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </div>
  );
};

export default Location;
