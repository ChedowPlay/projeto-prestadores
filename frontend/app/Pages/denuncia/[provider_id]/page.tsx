"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import Loading from "../../../components/Loading";
import styles from "../../../stylesheets/Denuncia.module.css";

const API_URL = process.env.API_URL;
const TOKEN = "JWT.EXAMPLE.TOKEN";

interface Complaint {
  provider_id: string;
  description: string;
}

const DenunciaPage = () => {
  const router = useRouter();
  const { provider_id } = useParams<{ provider_id: string }>(); 

  const [motivo, setMotivo] = useState<string>("");
  const [descricao, setDescricao] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [redirecting, setRedirecting] = useState<boolean>(false);
  const [message, setMessage] = useState<string | null>(null);
  const [id, setId] = useState<string | null>(null);

  useEffect(() => {
    if (provider_id) {
      setId(provider_id);
    }
  }, [provider_id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    if (!id) {
      setMessage("❌ ID do provedor não encontrado.");
      setLoading(false);
      return;
    }

    const data: Complaint = {
      provider_id: id,
      description: descricao || motivo,
    };

    try {
      const response = await fetch(`${API_URL}/api/interactions/complaint`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${TOKEN}`,
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        setMessage("Denúncia enviada com sucesso!");
        setTimeout(() => {
          setRedirecting(true);
          router.push(`/Pages/denunciaSucess/${id}?motivo=${encodeURIComponent(motivo)}&descricao=${encodeURIComponent(descricao)}`);
        }, 2000);
      } else {
        setMessage("Erro ao enviar denúncia.");
      }
    } catch (error) {
      setMessage("⚠️ Erro ao conectar com o servidor. " + error);
    }

    setLoading(false);
  };

  return (
    <div className={styles.container}>
      <h1>Denunciar este perfil</h1>
      <p>
        Conte-nos o motivo da denúncia. Todas as denúncias são analisadas
        cuidadosamente para garantir a segurança da nossa comunidade.
      </p>

      {loading || redirecting ? (
        <Loading />
      ) : id ? (
        <form onSubmit={handleSubmit} className={styles.form}>
          <label className={styles.label}>Motivo da Denúncia:</label>
          <div className={styles.checkboxGroup}>
            {["Serviço ruim", "Golpe ou comportamento fraudulento", "Conteúdo inadequado ou falso", "Outro"].map((item) => (
              <label key={item}>
                <input
                  type="checkbox"
                  checked={motivo === item}
                  onChange={() => setMotivo(item)}
                />
                {item}
              </label>
            ))}
          </div>

          {motivo === "Outro" && (
            <input
              type="text"
              placeholder="Descreva (Opcional)"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              className={styles.input}
            />
          )}

          <label className={styles.label}>Descreva o problema (Opcional)</label>
          <input
            type="text"
            placeholder="Descreva o problema (Opcional)"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            className={styles.input}
          />

          <div className={styles.buttonGroup}>
            <button type="submit" className={`${styles.button} ${styles.submit}`} disabled={loading || redirecting}>
              {loading ? "Enviando..." : "Enviar Denúncia"}
            </button>
            <button type="button" className={`${styles.button} ${styles.cancel}`} onClick={() => router.back()} disabled={redirecting}>
              Cancelar
            </button>
          </div>

          {redirecting && <p className={styles.redirectMessage}>Redirecionando para a página de sucesso...</p>}
        </form>
      ) : (
        <p>Carregando informações...</p>
      )}
      {message && <p>{message}</p>}
    </div>
  );
};

export default DenunciaPage;
