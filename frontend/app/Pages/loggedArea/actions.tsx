/* eslint-disable @typescript-eslint/no-explicit-any */
export interface ProviderData {
  token: string; // Adicione o token aqui
  success: boolean;
  provider_id: string;
  bio: string;
  name: string;
  phone: string;
  whatsapp: string | null;
  picture: string;
  created_at: string;
  price: { min: number; max: number; avg: number };
  works: { count: number; data: any[] };
  album: { count: number; data: any[] };
  address: {
    cep: string | null;
    city: string | null;
    state: string | null;
    street: string | null;
    number: string | null;
    latitude: number | null;
    longitude: number | null;
  };
  plan: {
    paid_at: string | null;
    has_paid: boolean;
    pay_at: string;
  };
  user_id: string;
  email: string;
}

export async function getProvider(token: string): Promise<ProviderData> {
   const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const headers = {
    "Content-Type": "application/json",
    authorization: token ? `Bearer ${token}` : "",
  };

  const endpoint = "/api/provider";

  try {
    const response = await fetch(API_URL + endpoint, {
      method: "GET",
      headers,
    });

    const providerData: ProviderData = await response.json();
    
    // Adiciona o token ao objeto de retorno
    providerData.token = token; 
    return providerData;
  } catch (error) {
    console.error("Erro em getProvider:", error);
    throw error;
  }
}
