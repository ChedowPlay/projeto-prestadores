/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useEffect, useState } from "react";

import AboutSection from "@/app/components/Section/AboutSection";
import Cards from "@/app/components/Cards/Cards";
import FAQ from "@/app/components/Section/FaqSection";
import Filters from "@/app/components/Filters";
import Footer from "@/app/components/Section/Footer";
import { HiAdjustmentsHorizontal } from "react-icons/hi2";
import HomeSection from "@/app/components/Section/HomeSection";
import Location from "../../components/Location";
import NavbarComponent from "@/app/components/Navbar";
import OrderPrice from "@/app/components/OrderPrice";
import PlansSection from "@/app/components/Section/PlansSection";
import SearchBar from "@/app/components/SearchBar";
import Searched from "@/app/components/Searched";
import Sortbyprice from "@/app/components/Sortbyprice";
import loggedStyles from "../../stylesheets/LoggedArea.module.css";
import styles from "../../page.module.css";
import { useAuthUser } from "@/app/context/UserDataContext";
import useWindowSize from "../../hooks/WindowSize";

// import Searched from "@/app/components/Searched";
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
  business: Business[];
}
interface Business {
  service: string;
  category: string;
}
interface ApiResponse {
  success: boolean;
  data: Card[];
}
interface Service {
  service_id: string;
  label: string;
  value: number;
}

const Welcome: React.FC = () => {
  const { width } = useWindowSize();
  const [isTablet, setIsTablet] = useState(width < 1024);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredCards, setFilteredCards] = useState<Card[]>([]);
  const [priceFilter, setPriceFilter] = useState({ min: 10, max: 1000 });
  const [order, setOrder] = useState<"asc" | "desc">("desc");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [results, setResults] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [services, setServices] = useState<
    { service_id: string; label: string; value: number }[]
  >([]);
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsTablet(window.innerWidth < 1024);
    };
    // Verifica se a tela é menor que 1024px (tablet ou celular)
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    fetch(`${API_URL}/search?page=1`)
      .then((res) => res.json())
      .then((data: ApiResponse) => {
        if (data.success && Array.isArray(data.data)) {
          const allCategories = data.data
            .flatMap((item) =>
              Array.isArray(item.business)
                ? item.business.map((b) => b.category)
                : []
            )
            .filter(
              (category): category is string => typeof category === "string"
            );

          const uniqueCategories = [...new Set(allCategories)];
          setCategories(uniqueCategories);
        }
      })
      .catch((err) => console.error("Erro ao buscar categorias:", err));
  }, []);

  useEffect(() => {
    fetch(`${API_URL}/api/service`)
      .then((res) => res.json())
      .then((data: Record<string, Service[]>) => {
        const servicesArray = Object.values(data).flat();
        setServices(servicesArray);
      })
      .catch((err) => console.error("Erro ao buscar serviços:", err));
  }, []);

  // Função para retornar o texto responsivo
  const getResponsiveText = () => {
    if (width < 768) {
      return (
        <span className="container-fluid d-flex text-center justify-content-center pt-5 pb-2 fs-5 mb-4">
          Ache o serviço certo e conecte-se com os melhores profissionais
        </span>
      );
    } else if (width < 1024) {
      return (
        <div className="container-fluid text-center justify-content-center pt-5 fs-5">
          <p>Encontre o serviço ideal!</p>
          <p>Digite o que precisa e conecte-se aos melhores profissionais.</p>
        </div>
      );
    }
    return (
      <p>
        Pesquise facilmente entre nossos serviços! Digite o que precisa na barra
        de busca abaixo e deixe-nos conectar você aos melhores profissionais.
      </p>
    );
  };

  return (
    <div className="page">
      <NavbarComponent isLogin={false} isLogged={true} isRegister={false}/>
      <main className={styles.main}>
        <section
          id="explorar"
          className={styles.explorar}
        >

          <div className=" align-items-center text-center ">
            <div className="fs-2 fw-semibold">{getResponsiveText()}</div>
          </div>
          <SearchBar
            services={services}
            onSearchResults={(filtered) => {
              const mappedCards = filtered.map((service) => ({
                provider_id: "",
                user_id: "",
                bio: "",
                name: service.label,
                picture: "",
                created_at: "",
                coordinates: null,
                price: { min: service.value, max: service.value, avg: service.value },
                business: [],
              }));
              setFilteredCards(mappedCards);
            }} />
          <Searched categories={categories} />
        </section>

        {/* Filtros responsivos */}
        {isTablet && (
          <section>
            <div className="d-flex align-items-center gap-2 ms-2">
              <p className="text-dark mb-1 fs-5">Filtros</p>
              <HiAdjustmentsHorizontal color="black" size={20} />
            </div>
            <div className={styles.responsive}>
              <Filters setFilteredCards={(filtered) => {
                setFilteredCards(filtered);
              }} />
              <Sortbyprice setFilteredCards={(sorted) => {
                setFilteredCards(sorted);
              }} />
              <Location onResultsUpdate={(newResults) => {
                setFilteredCards(newResults);
              }}
                onClearFilters={() => {
                  setFilteredCards([]);
                }}
              />
            </div>
          </section>
        )}
        <section
          className=" text-white d-flex flex-nowrap"
          style={{ minHeight: "90vh", background: "#008FBB" }}
        >
          <div className="d-flex mx-5 mt-5" style={{ gap: "40px" }}>
            {/* Filtros no desktop */}
            {!isTablet && (
              <div
                className="d-flex flex-column gap-3"
                style={{ width: "350px" }}
              >
                <div className="d-flex align-items-center gap-2">
                  <p className="mb-0 fs-5">Filtros</p>
                  <HiAdjustmentsHorizontal color="white" size={22} />
                </div>

                <Filters setFilteredCards={(filtered) => {
                  setFilteredCards(filtered);
                }} />
                <Sortbyprice setFilteredCards={(sorted) => {
                  setFilteredCards(sorted);
                }} />
                <Location onResultsUpdate={(newResults) => {
                  setFilteredCards(newResults);
                }}

                  onClearFilters={() => {
                    setFilteredCards([]);
                  }}
                />
              </div>

            )}
            <div className="flex-grow-1">
              <OrderPrice
                onOrderChange={(cardsData) => setFilteredCards(cardsData)}
              />
              <div className="d-flex">
                <Cards
                  searchQuery={searchQuery}
                  priceFilter={priceFilter}
                  cardsData={filteredCards}
                />
              </div>
            </div>
          </div>
        </section>
        <section id="precos">
          <PlansSection />
        </section>
        <section id="sobre">
          <AboutSection />
        </section>
        <section id="faq">
          <FAQ />
        </section>
        <Footer />
      </main>
    </div>
  );
}
export default Welcome;

