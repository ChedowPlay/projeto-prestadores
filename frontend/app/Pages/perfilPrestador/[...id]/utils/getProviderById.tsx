/* eslint-disable react-hooks/exhaustive-deps */

import { useEffect, useState } from "react";

export const useProvider = (id: string) => {
   // eslint-disable-next-line @typescript-eslint/no-explicit-any
   const [provider, setProvider] = useState<any>(null);
   const [loading, setLoading] = useState<boolean>(true);
   const [error, setError] = useState<string | null>(null);
   const API_URL = process.env.API_URL;
 
   useEffect(() => {
     const fetchProvider = async () => {
       try {
         const response = await fetch(`${API_URL}/api/provider/${id}`, {
           method: "GET",
           headers: {
             "Content-Type": "application/json",
           },
         });
 
         if (!response.ok) {
           throw new Error("Network response was not ok");
         }
 
         const data = await response.json();
         setProvider(data);
       } catch (error) {
         if (error instanceof Error) {
           setError(error.message);
         } else {
           setError(String(error));
         }
       } finally {
         setLoading(false);
       }
     };
 
     fetchProvider();
   }, [id]);
 
   return { provider, loading, error };
 };
