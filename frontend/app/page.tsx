/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useEffect, useState } from "react";

import AboutSection from "./components/Section/AboutSection";
import Cards from "./components/Cards/Cards";
import FAQ from "./components/Section/FaqSection";
import Filters from "./components/Filters";
import Footer from "./components/Section/Footer";
import { HiAdjustmentsHorizontal } from "react-icons/hi2";
import HomeSection from "./components/Section/HomeSection";
import Location from "./components/Location";
import NavbarComponent from "./components/Navbar";
import OrderPrice from "./components/OrderPrice";
import PlansSection from "./components/Section/PlansSection";
import SearchBar from "./components/SearchBar";
import Searched from "./components/Searched";
import Sortbyprice from "./components/Sortbyprice";
import styles from "./page.module.css";
import useWindowSize from "./hooks/WindowSize";

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

export default function Home() {
  const { width } = useWindowSize();
  const [isTablet, setIsTablet] = useState(width < 1024);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredCards, setFilteredCards] = useState<Card[]>([]);
  const [priceFilter, setPriceFilter] = useState({ min: 10, max: 1000 });
  const [order, setOrder] = useState<"asc" | "desc">("desc");
  const [categories, setCategories] = useState<string[]>([]);
  const [services, setServices] = useState<{ service_id: string; label: string; value: number }[]>([]);
  const API_URL = process.env.API_URL;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsTablet(window.innerWidth < 1024);
    };
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
            .filter((category): category is string => typeof category === "string");

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

  const getResponsiveText = () => {
    if (width < 768) {
      return (
        <span className="container-fluid d-flex text-center justify-content-center pt-4 pb-2 fs-5 mb-3">
          Descubra profissionais e navegue por uma demo mais fluida.
        </span>
      );
    } else if (width < 1024) {
      return (
        <div className="container-fluid text-center justify-content-center pt-4 fs-5">
          <p>Explore a Marca Modelo.</p>
          <p>Busque serviços e visualize uma experiência mais moderna.</p>
        </div>
      );
    }
    return (
      <p>
        Experimente a demo da Marca Modelo e descubra como a plataforma conecta
        clientes e profissionais com uma navegação mais leve, clara e objetiva.
      </p>
    );
  };

  return (
    <div className="page">
      <NavbarComponent isLogin={false} isLogged={false} />
      <main className={styles.main}>
        <section id="home" className={`${styles.section} ${styles.sectionReveal}`}>
          <HomeSection />
        </section>
        <section
          id="explorar"
          className={`${styles.explorar} ${styles.sectionReveal}`}
          style={{
            minHeight: width < 768 ? "auto" : "30vh",
            marginTop: width < 768 ? "20px" : "0",
          }}
        >
          <div className="align-items-center text-center margin-top-50">
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
                price: {
                  min: service.value,
                  max: service.value,
                  avg: service.value,
                },
                business: [],
              }));
              setFilteredCards(mappedCards);
            }}
          />
          <Searched categories={categories} />
        </section>

        {isTablet && (
          <section className={styles.sectionReveal}>
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
              <Location
                onResultsUpdate={(newResults) => {
                  setFilteredCards(newResults);
                }}
                onClearFilters={() => {
                  setFilteredCards([]);
                }}
              />
            </div>
          </section>
        )}
        <section className={`${styles.resultsSection} ${styles.sectionReveal}`}>
          <div className={styles.resultsInner}>
            {!isTablet && (
              <div className={styles.filtersColumn}>
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
                <Location
                  onResultsUpdate={(newResults) => {
                    setFilteredCards(newResults);
                  }}
                  onClearFilters={() => {
                    setFilteredCards([]);
                  }}
                />
              </div>
            )}
            <div className="flex-grow-1">
              <OrderPrice onOrderChange={(cardsData) => setFilteredCards(cardsData)} />
              <div className="d-flex">
                <Cards searchQuery={searchQuery} priceFilter={priceFilter} cardsData={filteredCards} />
              </div>
            </div>
          </div>
        </section>
        <section id="precos" className={styles.sectionReveal}>
          <PlansSection />
        </section>
        <section id="sobre" className={styles.sectionReveal}>
          <AboutSection />
        </section>
        <section id="faq" className={styles.sectionReveal}>
          <FAQ />
        </section>
        <Footer />
      </main>
    </div>
  );
}
