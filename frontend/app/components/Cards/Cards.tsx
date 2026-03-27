import "bootstrap/dist/css/bootstrap.min.css";
import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

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

interface CardsProps {
  searchQuery: string;
  priceFilter: { min: number; max: number };
  cardsData?: Card[];
}

export default function Cards({ searchQuery, priceFilter, cardsData = [] }: CardsProps) {
  const [page, setPage] = useState<number>(1);
  const router = useRouter();


  const filteredCards = cardsData.filter((card) => {
    if (!card.price || typeof card.price.avg !== "number") {
      return false;
    }

    const avgPrice = card.price.avg;
    const matchesPrice = avgPrice >= priceFilter.min && avgPrice <= priceFilter.max;

    const matchesSearch = searchQuery
      ? card.name.toLowerCase().includes(searchQuery.toLowerCase())
      : true;

    return matchesPrice && matchesSearch;
  });

  const cardsPerPage = 6;
  const totalPages = Math.max(1, Math.ceil(filteredCards.length / cardsPerPage));

  const truncateText = (text: string, id: string) => (
    text.length > 60 ? (
      <>
        {text.substring(0, 60)}...{" "}
        <span
          className="text-primary fw-bold"
          style={{ cursor: "pointer" }}
          onClick={() => router.push(`/Pages/perfilPrestador/${id}`)}
        >
          mais
        </span>
      </>
    ) : text
  );

  const Pagination = () => (
    <div className="d-flex justify-content-between align-items-center my-3 pagination">
      <button className="btn text-white button-pagination" onClick={() => setPage((prev) => Math.max(prev - 1, 1))} disabled={page === 1}>
        «
      </button>
      <div className="d-flex mx-3">
        {[...Array(totalPages)].map((_, i) => (
          <button key={i} className={`btn ${page === i + 1 ? "fw-bold" : "btn-number"} mx-1 text-white`} onClick={() => setPage(i + 1)}>
            {i + 1}
          </button>
        ))}
      </div>
      <button className="btn text-white button-pagination" onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))} disabled={page === totalPages}>
        »
      </button>
    </div>
  );

  return (
    <div className="container d-flex justify-content-center align-items-start flex-column">
      {totalPages > 1 && <Pagination />}

      {filteredCards.length === 0 ? (
        <div className="no-results">
          <p className="fs-5 fw-semibold">Nenhum resultado encontrado.</p>
        </div>
      ) : (
        <div className="row row-cols-1 row-cols-md-1 g-4 w-100 mx-0">
          {filteredCards.slice((page - 1) * cardsPerPage, page * cardsPerPage).map((card) => (
            <div key={card.provider_id} className="col">
              <div className="card shadow-sm border-card cardRouter" onClick={() => router.push(`/Pages/perfilPrestador/${card.provider_id}`)}>
                <div className="card-header category fw-bold">
                  {card.business.map((b) => b.service).join(", ")}
                </div>
                <div className="card-body d-flex">
                  <Image src={card.picture} alt={card.name} className="rounded-circle me-2" width={40} height={40} />
                  <h5 className="card-title fw-bold pt-2 ps-2">{card.name}</h5>
                </div>
                <p className="card-text text-muted ps-3">{truncateText(card.bio, card.provider_id)}</p>
                <div className="border-price">
                  <div className="card-footer fw-bold price">A partir de R$ {card.price.min.toFixed(2)}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {totalPages > 1 && <Pagination />}
    </div>
  );
}
