import React, { useState } from "react";

/* eslint-disable @typescript-eslint/no-unused-vars */
interface SearchedProps {
  categories: string[];
}

const ALL_CATEGORIES = [
  "Assistência técnica",
  "Beleza e bem-estar",
  "Educação",
  "Eventos e festas",
  "Reparos e manutenção",
  "Serviços domésticos",
  "Tecnologia",
  "Transporte e logística",
];

function Searched({ categories }: SearchedProps) {
  const [selectedFilters, setSelectedFilters] = useState<{ [key: number]: boolean }>({});
  const toggleFilter = (index: number) => {
    setSelectedFilters((prevSelected) => ({
      ...prevSelected,
      [index]: !prevSelected[index],
    }));
  };

  return (
    <div className="container-fluid py-3">
      <p className="fs-5 pt-3 mostSearched">Mais buscados</p>
      <div className="d-flex overflow-auto hide-scrollbar gap-2 flex-nowrap">
        {ALL_CATEGORIES.map((category, index) => (
          <div key={index} className="flex-shrink-0">
            <button
              className={`filters d-flex justify-content-center ${selectedFilters[index] ? "selected" : ""}`}
              onClick={() => toggleFilter(index)}
              style={{ minWidth: "180px" }}
            >
              <span className="py-2 px-3">{category}</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Searched;
