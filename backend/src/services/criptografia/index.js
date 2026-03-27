import crypto from 'crypto';

export const gerarHashSimples = (str) => {
    return crypto.createHash('sha256').update(str + Date.now().toString()).digest('hex')
}