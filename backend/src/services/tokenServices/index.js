// import { createTokenDB, buscarToken } from '../../database/auth/token/dao';
// import JWT from 'jsonwebtoken';
// import { env } from '../env';


// export const gerarAcessoToken = async (userID) => {
//     const expiresIn = Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60); // Timestamp 7 dias
//     const expiresInGMT = new Date(expiresIn * 1000);

//     const token = JWT.sign({ id: userID, exp: expiresIn }, env.SECRETKEY);

//     const result = await createTokenDB({ token, expiresin: expiresInGMT });
//     if (result === null) console.error('> Gerate Token Error: Não foi possível gerar o token. Erro interno.');

//     return token;
// }


// export const validarToken = async (token) => {
//     try {
//         const tokenPuro = token.replace('Bearer ', '');

//         const result = await buscarToken({ token: tokenPuro });
//         if (result === null) return { result: false, msg: 'Usuário não autenticado' };

        
//         let decode = {};
//         let isValid = false;
//         try {
//             decode = JWT.verify(tokenPuro, env.SECRETKEY);
//             isValid = true;
//         } catch (error) { }


//         return { result: isValid, msg: decode };
//     } catch (err) {
//         console.log(`  Erro ao validar Token ${err}`);
//         return null;
//     }
// }