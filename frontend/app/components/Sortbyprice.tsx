import { Accordion, Col, Form, Row } from "react-bootstrap";
import React, { useEffect, useState } from "react";

import Button from "./Button";
import axios from "axios";
import styles from "../stylesheets/Sortbyprice.module.css";

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

// Definição das props do componente
interface SortByPriceProps {
  setFilteredCards: React.Dispatch<React.SetStateAction<Card[]>>;
}

const Sortbyprice: React.FC<SortByPriceProps> = ({ setFilteredCards }) => {
  const [selectedAll, setSelectedAll] = useState<boolean>(true);
  const [rangeMin, setRangeMin] = useState<number>(10);
  const [rangeMax, setRangeMax] = useState<number>(1000);
  const [inputMin, setInputMin] = useState<string>("");
  const [inputMax, setInputMax] = useState<string>("");
  const API_URL = process.env.NEXT_PUBLIC_API_URL;


  const handleCheckboxChange = (): void => {
    setSelectedAll(!selectedAll);
  };

  // Função para atualizar os valores do range
  const handleRangeMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.min(Number(e.target.value), rangeMax - 10);
    setRangeMin(value);
  };
  

  const handleRangeMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(Number(e.target.value), rangeMin + 10);
    setRangeMax(value);
  }; 

  // Função para buscar os dados filtrados
  const fetchFilteredCards = async (min: number, max: number) => {
    try {
      const response = await axios.get(
        `${API_URL}/search?page=1&limit=10&minprice=${min}&maxprice=${max}`
      );

      // Filtra os resultados para garantir que pelo menos um valor esteja no intervalo
      const filteredData = response.data.data.filter((card: Card) =>
        (card.price.min >= min && card.price.min <= max) ||
        (card.price.max >= min && card.price.max <= max) ||
        (card.price.avg >= min && card.price.avg <= max)
      );

      setFilteredCards(filteredData);
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
    }
  };
  
  useEffect(() => {
    fetchFilteredCards(10, 1000);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  const handleApplyFilter = () => {
    const min = inputMin ? Number(inputMin.replace(/\D/g, "")) : rangeMin;
    const max = inputMax ? Number(inputMax.replace(/\D/g, "")) : rangeMax;
  
    setRangeMin(min); 
    setRangeMax(max); 
  
    setSelectedAll(false); 
    fetchFilteredCards(min, max);
  };
  
  const handleClearFilter = () => {
    setInputMin("");
    setInputMax("");
    setRangeMin(10);
    setRangeMax(1000); 
    setSelectedAll(true); 
    fetchFilteredCards(10, 1000);
  };
  

  return (
    <div className={styles.sizePrice}>
      <Accordion className={styles.border}>
        <Accordion.Item eventKey="0">
          <Accordion.Header>
            Preço
            {selectedAll && <span className="ms-3 text-muted">(Todos)</span>}
          </Accordion.Header>
          <Accordion.Body>
            <Form>
              <Col xs={12}>
                <Form.Check
                  type="checkbox"
                  label="Todos"
                  checked={selectedAll}
                  onChange={handleCheckboxChange}
                />
              </Col>
              <hr />
              {!selectedAll && (
                <div className="mt-3">
                  <div className={styles.rangeContainer}>
                    <div className={styles.rangeWrapper}>
                      <input
                        type="range"
                        min="10"
                        max="1000"
                        step="10"
                        value={rangeMin}
                        onChange={handleRangeMinChange}
                        className={styles.rangeSlider}
                      />
                      <input
                        type="range"
                        min="10"
                        max="1000"
                        step="10"
                        value={rangeMax}
                        onChange={handleRangeMaxChange}
                        className={styles.rangeSlider}
                      />
                    </div>
                    <div className={styles.rangeTrack} style={{
                      left: `${(rangeMin / 1000) * 100}%`,
                      width: `${((rangeMax - rangeMin) / 1000) * 100}%`,
                    }}></div>
                    <div className={styles.rangeValues}>
                      <span style={{ left: `${(rangeMin / 1000) * 100}%` }}>R${rangeMin},00</span>
                      <span style={{ left: `${(rangeMax / 1000) * 100}%` }}>R${rangeMax},00</span>
                    </div>
                  </div>
                  <div className={styles.priceInputs}>
                    <Row className="mb-2">
                      <Col xs={4}><Form.Label>Mínimo</Form.Label></Col>
                      <Col xs={8}>
                        <Form.Control type="text" value={inputMin} onChange={(e) => setInputMin(e.target.value)} placeholder="R$ 0,00" />
                      </Col>
                    </Row>
                    <Row>
                      <Col xs={4}><Form.Label>Máximo</Form.Label></Col>
                      <Col xs={8}>
                        <Form.Control type="text" value={inputMax} onChange={(e) => setInputMax(e.target.value)} placeholder="R$ 0,00" />
                      </Col>
                    </Row>
                  </div>
                </div>
              )}
            </Form>
            <div className="mt-3">
              <Button text="Aplicar" color="c2 w-100" onClick={handleApplyFilter} />
              <div className="mt-2">
                <Button text="Limpar" color="btn-outline-dark w-100" onClick={handleClearFilter} />
              </div>
            </div>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </div>
  );
};

export default Sortbyprice;
