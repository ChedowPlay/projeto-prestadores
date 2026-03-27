/**
 * Desenvolvido por: LucasATS
 * 250220V
 */


/**
 * Converte uma lista binária para decimal
*/
const binToDec = (listaBinaria) => {
    const dec = listaBinaria.reduce((decimal, bit, index) => {
        return decimal + bit * Math.pow(2, listaBinaria.length - 1 - index);
    }, 0);

    // console.log("dec:", dec);
    return dec;
};


/**
 * Converte um número decimal para uma lista binária
*/
const decToBin = (decimal) => {
    let listaBinaria = [];
    while (decimal > 0) {
        listaBinaria.unshift(decimal % 2);
        decimal = Math.floor(decimal / 2);
    }

    const bin = listaBinaria.length > 0 ? listaBinaria : [0];
    // console.log("bin:", bin);
    return bin;
};


/**
 *  Formata a lista de IDs para um array binário invertido
*/
const formatarListaBin = (listaIds, length) => {
    const ordenada = listaIds.sort((a, b) => a - b);
    // console.log("ordenada:", ordenada);

    // Cria um array de tamanho 'length' com todos os valores iniciados em 0
    const resultado = Array(length).fill(0);

    // Preenche as posições corretas com 1 (com base no índice do ID)
    ordenada.forEach(id => {
        if (id <= length) {
            resultado[length - id] = 1;  // Mapeia o ID para a posição correta (invertida)
        }
    });

    // console.log("bin:", resultado);
    return resultado;
};


/** 
Converte uma lista binária para IDs originais
*/
const binToIds = (listaBinaria, length) => {
    const ids = [];
    // Vamos percorrer o array binário e buscar os índices que têm valor 1
    for (let i = 0; i < listaBinaria.length; i++) {
        if (listaBinaria[i] === 1) {
            ids.push(length - i);  // Reverte a posição para obter a ID original
        }
    }
    return ids;
};


/**
Converte valor decimal para IDs originais
*/
const decToIds = (decimal, length) => {
    const binary = [];
    while (decimal > 0) {
        binary.unshift(decimal % 2);
        decimal = Math.floor(decimal / 2);
    }

    // Preenche com zeros à esquerda para atingir o comprimento necessário
    while (binary.length < length) {
        binary.unshift(0);
    }

    // Mapeia os bits "1" para os índices correspondentes (em ordem crescente)
    const ids = binary
        .map((bit, index) => (bit === 1 ? length - index : null))
        .filter((id) => id !== null);

    return ids;
};


export { decToBin, decToIds, binToDec, binToIds, formatarListaBin };
