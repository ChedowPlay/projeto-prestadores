/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import "react-toastify/dist/ReactToastify.css";

import {
  CurrencyCircleDollar,
  MapPin,
  Phone,
  Warning,
  WhatsappLogo,
  XCircle,
} from "@phosphor-icons/react";
import { ToastContainer, toast } from "react-toastify";
import { useParams, useRouter } from "next/navigation";

import Button from "@/app/components/Button";
import COLORS from "@/app/stylesheets/colors";
import Image from "next/image";
import Loading from "@/app/components/Loading";
import styles from "@/app/stylesheets/prestador.module.css";
import { useProvider } from "./utils/getProviderById";
import { useState } from "react";

const PerfilPrestador: React.FC = () => {
  const { id } = useParams();
  const router = useRouter();
  const { provider, loading, error } = useProvider(id as string);
  const [contratou, setContratou] = useState(false);

  if (loading) return <Loading />;
  if (error) return <p>Error: {error}</p>;

  const showToast = () => {
    toast.warn("Denunciar este perfil", {
      position: "bottom-center",
      autoClose: 2000,
      pauseOnHover: true,
      theme: "dark",
    });
  };

  return (
    <>
      <div className={styles.navbar}>
        <div className={styles.separatorNav}></div>
      </div>
      <div className={styles.main}>
        <div className={styles.mainContainer}>
          <div className={styles.topBar}>
            <p className={styles.category}>
              {provider.works.data.map((work: any) => work.category).join(", ")}
            </p>
            <div className={styles.closeIcons}>
              <div className={styles.separator}></div>
              <XCircle
                size={32}
                className={styles.xIcon}
                onClick={() => {
                  router.back();
                }}
              />
            </div>
          </div>

          <div className={styles.infoContainer}>
            <Image
              src={provider.picture}
              alt="Imagem do Prestador"
              className={styles.profileImage}
              width={160}
              height={160}
            />
            <div className={styles.nameContainer}>
              <p className={styles.name}>{provider.name}</p>
            </div>
            {!contratou && (
              <Button
                text="Solicitar Orçamento"
                color={COLORS.secondary}
                className={styles.contractButton}
                onClick={() => {
                  setContratou(true);
                }}
              />
            )}
          </div>
          {contratou && (
            <div className={styles.contactContainer}>
              <h4>Entre em contato agora!</h4>
              <div className={styles.contactContent}>
                <p>
                  <Phone size={20} color="#008fbb" weight="fill" /> Telefone:{" "}
                  {provider.phone}
                </p>
                <a
                  className={styles.contactButton}
                  target="_blank"
                  href={`https://wa.me/${provider.phone}`}
                >
                  <p>
                    <WhatsappLogo size={20} color="#008fbb" /> WhatsApp:{" "}
                    {provider.phone}
                  </p>
                </a>
                <p>
                  <MapPin size={18} color="#008fbb" weight="fill" />
                  Endereço:
                  {provider.address.street
                    ? provider.address.street
                    : ""}
                  {provider.address.city}, {provider.address.state}
                </p>
              </div>
            </div>
          )}
          <div className={styles.descriptionContainer}>
            <h4>Quem é {provider.name}:</h4>
            <p>{provider.bio}</p>
          </div>

          <div className={styles.jobDescription}>
            <h4>Serviços prestados:</h4>
            {provider.works.data.map((job: any, index: number) => (
              <div key={index}>
                <div className={styles.categoryContainer}>
                  <div className={styles.categoryInfo}>
                    <p>{job.category}</p>
                  </div>
                </div>
                <p>{job.description}</p>
                <p className={styles.priceTag}>
                  <CurrencyCircleDollar
                    className={styles.dollarSign}
                    size={32}
                    color="#fff"
                  />{" "}
                  A partir de: R$ {job.price}
                </p>
                <div className={styles.separador}> </div>
              </div>
            ))}
          </div>

          <h5>Galeria: {provider.album.data.length}</h5>
          <div className={styles.gallery}>
            {provider.album.data.map((imagem: any, index: number) => (
              <Image
                key={index}
                src={imagem.url}
                alt={`Imagem ${index + 1} do Prestador`}
                width={500}
                height={500}
                className={styles.galleryImage}
              />
            ))}
          </div>

          <Button
            text="Solicitar Orçamento"
            color={COLORS.secondary}
            className={styles.contractButton}
            onClick={() => {
              setTimeout(() => {
                setContratou(true);
              }, 300);
              window.scrollTo({
                top: 150,
                behavior: "smooth",
              });
            }}
          />
          <a className={styles.reportButton} onMouseEnter={showToast}>
            <Warning
              size={30}
              color="#ff6666"
              weight="fill"
              onClick={() => {
                router.push(`/Pages/denuncia/${provider.provider_id}`);
              }}
            />
          </a>
          <ToastContainer />
        </div>
      </div>
      <div className={styles.navbar}>
        <div className={styles.separatorNav}></div>
      </div>
    </>
  );
};

export default PerfilPrestador;
