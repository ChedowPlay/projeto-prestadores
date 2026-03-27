export const time = {
    getFormatedTime() {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        return `${hours}:${minutes}:${seconds}`;
    },


    /**
     * Verifica se uma data fornecida está fora do período especificado.
     * 
     * Exemplos de conversão de tempo para milissegundos:
     * 2 * 60 * 1000 = 120000ms (2 minutos)
     * 30 * 24 * 60 * 60 * 1000 = 2.592e+9ms (30 dias)
     *
     * @param {string} dateString - A data a ser verificada, no formato de string aceito pelo construtor Date.
     * @param {number} [periodMS=2 * 60 * 1000] - O período de tempo em milissegundos. O padrão são 2 minutos.
     * @returns {object} - Retorna um objeto com duas propriedades:
     *   - `test` (boolean): `true` se a data fornecida for anterior ao momento calculado como `now - periodMS`, indicando que está fora do período especificado. Retorna `false` caso contrário.
     *   - `timeRemaining` (number): O tempo restante em milissegundos até o fim do período especificado.
     *   - `timeRemainingDays` (string): O tempo restante em dias, com duas casas decimais.
     */
    isOutOfPeriod(dateString = '', periodMS = 2 * 60 * 1000) {
        const date = new Date(dateString);
        const now = new Date();
        const ago = new Date(now.getTime() - periodMS);
        const timeRemaining = date.getTime() - ago.getTime();
        // console.log(`Tempo restante: ${timeRemaining}ms, ${timeRemaining / 1000}s, ${timeRemaining / (1000 * 60)}min`, formatTime(timeRemaining / 1000));
        return {
            test: date < ago,
            timeRemaining: timeRemaining,
            timeRemainingFormated: formatTime(timeRemaining / 1000)
        };
    },


    /**
     * Verifica se esta dentro de um periodo inicial e final
     * @param {string} startDate - data inicial formato de ano-mês-dia
     * @param {string} finalDate - data inicial formato de ano-mês-dia
     * @returns {boolean} true - Esta dentro do periodo, false - esta fora do periodo
    */
    isWithinPeriod({ startDate = '2024-10-01', finalDate = '2024-10-01' }) {
        const dataAtual = new Date(new Date().toLocaleString("en-US", { timeZone: "America/Campo_Grande" }));
        const dataInicial = new Date(new Date(startDate).toLocaleString("en-US", { timeZone: "America/Campo_Grande" }));
        const dataFinal = new Date(new Date(finalDate).toLocaleString("en-US", { timeZone: "America/Campo_Grande" }));

        // console.log('> isWithinPeriod test:');
        // console.log(' dataInicial:', dataInicial);
        // console.log(' dataFinal:', dataFinal);
        // console.log(' dataAtual:', dataAtual);

        return dataAtual >= dataInicial && dataAtual <= dataFinal;
    },
}


const formatTime = (seconds) => {
    const days = Math.floor(seconds / (3600 * 24));
    const hours = Math.floor((seconds % (3600 * 24)) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    if (days > 0) {
        return `${days} dia${days !== 1 ? 's' : ''}`;
    } else if (hours > 0) {
        return `${hours} hora${hours !== 1 ? 's' : ''}`;
    } else if (minutes > 0) {
        return `${minutes} minuto${minutes !== 1 ? 's' : ''}`;
    } else {
        return `${remainingSeconds} segundo${remainingSeconds !== 1 ? 's' : ''}`;
    }
}
