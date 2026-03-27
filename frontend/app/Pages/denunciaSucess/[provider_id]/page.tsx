"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";

import Image from "next/image";
import styles from "../../../stylesheets/DenunciaSucesso.module.css";

const API_URL = process.env.API_URL;

interface ProviderData {
  name: string;
  picture: string;
  works: {
    count: number;
    data: { category: string }[];
  };
}

const DenunciaSucesso = () => {
  const router = useRouter();
  const { provider_id } = useParams<{ provider_id: string }>();
  const searchParams = useSearchParams();

  const [provider, setProvider] = useState<ProviderData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Recuperando os parâmetros passados na URL
  const motivo = searchParams.get("motivo") || "Motivo não informado";
  const descricao = searchParams.get("descricao") || "Nenhuma descrição fornecida.";

  useEffect(() => {
    if (!provider_id) return;

    const fetchProviderData = async () => {
      try {
        const response = await fetch(`${API_URL}/${provider_id}`);
        const data = await response.json();

        if (data.success) {
          setProvider({
            name: data.name,
            picture: data.picture,
            works: data.works,
          });
        }
      } catch (error) {
        console.error("Erro ao buscar provedor:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProviderData();
  }, [provider_id]);

  return (
    <div className={styles.container}>
      <h1>Obrigado por sua denúncia.</h1>
      <p>Iremos analisá-la o mais rápido possível.</p>

      {loading ? (
        <p>Carregando informações...</p>
      ) : provider ? (
        <div className={styles.resumo}>
          <h2>Resumo da Denúncia:</h2>

          <div className={styles.categoria}>
            Categoria: {provider.works.count > 0 ? provider.works.data[0].category : "Não informado"}
          </div>

          <div className={styles.perfil}>
            <Image src={provider.picture} alt={`Foto de ${provider.name}`} className={styles.avatar} />
            <span>{provider.name}</span>
          </div>

          <ul className={styles.motivos}>
            <li>✅ {motivo}</li>
          </ul>

          <div className={styles.descricao}>
            <h1>Descrição do problema</h1>
            <p>{descricao}</p>
          </div>
        </div>
      ) : (
        <p> Erro ao carregar os dados do provedor.</p>
      )}

      <button className={styles.button} onClick={() => router.push("/")}>
        Voltar para a Home
      </button>
    </div>
  );
};

export default DenunciaSucesso;
