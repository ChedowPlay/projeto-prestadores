// app/lib/client/userState.client.ts
'use client';

import { ProviderData } from "../Pages/loggedArea/actions";

let clientUserData: ProviderData | null = null;

export const setClientUserData = (data: ProviderData) => {
  clientUserData = data;
  
  // Armazena no sessionStorage (persiste durante a sessão do navegador)
  if (typeof window !== 'undefined') {
    sessionStorage.setItem('userData', JSON.stringify(data));
  }
};

export const getClientUserData = (): ProviderData => {
  // Tenta pegar da memória primeiro
  if (clientUserData) return clientUserData;
  
  // Se não tiver, pega do sessionStorage
  if (typeof window !== 'undefined') {
    const stored = sessionStorage.getItem('userData');
    if (stored) {
      clientUserData = JSON.parse(stored);
      if (!clientUserData) {
        throw new Error("User data is null");
      }
      return clientUserData;
    }
  }

  throw new Error("User data not found in client");
};
