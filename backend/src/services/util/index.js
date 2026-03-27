// 250217V


import { env } from '../env';


/**
 * Truncate String
 * Se o comprimento da string for maior que max (padrão: 1500 caracteres), ela será cortada (slice(0, max)).
 * Se a string for menor ou igual ao limite, ela será retornada inalterada.
 * 
 * Garante que o parâmetro input seja uma string:
 * 
 * Se input não for uma string, lança um erro (throw new Error(...)).
 * Limita o tamanho da string:
 */
const truncateString = (input = "", max = 1500) => {
    if (typeof input !== "string") throw new Error("O input deve ser uma string.");
    return input.length > max ? input.slice(0, max) : input;
}


const API_LINK_PICTURE = env.PROFILE_PIC_API;


const formatPublicLink = (link) => {
    if (link.startsWith('http://') || 
        link.startsWith('https://') || 
        link.startsWith('data:image')) {
        return link;
    }

    if (link.includes(API_LINK_PICTURE)) return link;

    let host = env.URL;
    if (!host) host = `${env.PORT === 443 ? 'https' : 'http'}://${env.HOST}:${env.PORT}`;
    let url = `${host}/${link}`;
    url = url.replace(/([^:]\/)\/+/g, '$1');
    return url;
}


export { truncateString, formatPublicLink, API_LINK_PICTURE }
