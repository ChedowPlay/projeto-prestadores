/* eslint-disable react-hooks/exhaustive-deps */

import React, { useState } from "react";

import Button from "./Button";
import styles from "../stylesheets/OrderPrice.module.css";
import { useCallback } from "react";

interface OrderPriceProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onOrderChange: (cardsData: any[]) => void; 
}

const OrderPrice: React.FC<OrderPriceProps> = ({ onOrderChange }) => {
  const [selectedOrder, setSelectedOrder] = useState<"Menor Preço" | "Maior Preço" | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  // Função para buscar os dados ordenados
  const fetchData = useCallback(async (order: "asc" | "desc") => {
    try {
      const response = await fetch(`${API_URL}/search?page=1&sortprice=${order}`);
      const result = await response.json();
      onOrderChange(result.data);
    } catch (error) {
      console.error("Erro ao buscar os dados:", error);
    }
  }, []);

  const handleApply = async () => {
    if (selectedOrder) {
      const sortOrder = selectedOrder === "Menor Preço" ? "asc" : "desc";
      await fetchData(sortOrder);
    }
    setIsOpen(false); 
  };


  const handleClear = async () => {
    setSelectedOrder(null);
    try {
      const response = await fetch(`${API_URL}/search?page=1`);
      const result = await response.json();
      onOrderChange(result.data); 
    } catch (error) {
      console.error("Erro ao buscar os resultados originais:", error);
    }
    setIsOpen(false); 
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.customOrder} >
        <button className={styles.customPrice} onClick={() => setIsOpen(!isOpen)}>
          Ordenar por {selectedOrder && <span className={styles.orderOption}>({selectedOrder})</span>}
        </button>
        {isOpen && (
          <div className={styles.customDropdown}>
            <label>
              <input type="radio" checked={selectedOrder === "Menor Preço"} onChange={() => setSelectedOrder("Menor Preço")} />
              Menor Preço
            </label>
            <label>
              <input type="radio" checked={selectedOrder === "Maior Preço"} onChange={() => setSelectedOrder("Maior Preço")} />
              Maior Preço
            </label>
            <div className="d-flex gap-2 mt-2" >
              <Button text="Aplicar" color="c2" className="w-50" onClick={handleApply} disabled={!selectedOrder} />
              <Button text="Limpar" color="white" className="w-50" onClick={handleClear} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderPrice;
