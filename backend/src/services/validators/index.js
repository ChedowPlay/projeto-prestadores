// VERSÃO: 230719
// 250203

const validarCEP = cep => {
    // Remove caracteres não-numéricos
    cep = cep.replace(/[^\d]/g, "");

    // Verifica se o CEP tem 8 dígitos
    if (cep.length !== 8) {
        return false;
    }

    // Verifica se todos os dígitos são iguais
    if (/^(\d)\1+$/.test(cep)) {
        return false;
    }

    // Se chegou aqui, o CEP é válido
    return true;
}

const validarCPF = cpf => {
    // Remove caracteres não-numéricos
    cpf = cpf.replace(/[^\d]/g, "");

    // Verifica se o CPF tem 11 dígitos
    if (cpf.length !== 11) {
        return false;
    }

    // Verifica se todos os dígitos são iguais
    if (/^(\d)\1+$/.test(cpf)) {
        return false;
    }

    // Verifica o primeiro dígito verificador
    let soma = 0;
    for (let i = 0; i < 9; i++) {
        soma += parseInt(cpf.charAt(i)) * (10 - i);
    }
    let resto = 11 - (soma % 11);
    let digito1 = resto === 10 || resto === 11 ? 0 : resto;
    if (digito1 !== parseInt(cpf.charAt(9))) {
        return false;
    }

    // Verifica o segundo dígito verificador
    soma = 0;
    for (let i = 0; i < 10; i++) {
        soma += parseInt(cpf.charAt(i)) * (11 - i);
    }
    resto = 11 - (soma % 11);
    let digito2 = resto === 10 || resto === 11 ? 0 : resto;
    if (digito2 !== parseInt(cpf.charAt(10))) {
        return false;
    }

    // Se chegou aqui, o CPF é válido
    return true;
}

const validarEmail = email => {
    try {
        if (/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email))
            return { result: true, msg: 'ok' };
        return { result: false, msg: 'email inválido' };
    } catch (error) {
        console.log(error);
    }
}



/* 
A senha deve conter pelo menos 8 caracteres. 
Pelo menos uma letra minúscula e uma MAIÚSCULA,
e pelo menos um caracter especial: !@#$%¨:;^&*()[]{}/*-+|\\=<>
*/
const wordlistPass = [
    '123456', '123', 'teste123*',
    'senha', 'password', 'qwerty',
    'abc123', 'admin', 'iloveyou',
    'letmein', 'monkey', 'sunshine',
    'superman', 'welcome', 'senha'];
const caractereEspeciais = '!@#$%¨:;^&*()[]{}/*-+|\\=<>'.split('');
function validadePassword(senha) {
    if (senha.length < 8) return { success: false, error: 'A senha deve conter pelo menos 8 caracteres.', status: 422 };

    const letrasMinusculas = /[a-zà-ÿ]/.test(senha);
    if (!letrasMinusculas) return { success: false, error: 'A senha deve conter pelo menos uma letra minúscula.', status: 422 };

    const letrasMaiusculas = /[A-ZÀ-Ÿ]/.test(senha);
    if (!letrasMaiusculas) return { success: false, error: 'A senha deve conter pelo menos uma letra MAIÚSCULA.', status: 422 };

    const existeNumero = /\d/.test(senha);
    if (!existeNumero) return { success: false, error: 'A senha deve conter pelo menos um número de 0 a 9.', status: 422 };

    const existeCaracteresEspeciais = caractereEspeciais.some(caracter => RegExp(`\\${caracter}`).test(senha));
    if (!existeCaracteresEspeciais) return { success: false, error: 'A senha deve conter pelo menos um caractere especial !@#$%¨:;^&*()[]{}/*-+|\\=<>', status: 422 };

    const existePlavrasChaves = wordlistPass.some(palavra => RegExp(`\\${palavra}`).test(senha));
    if (existePlavrasChaves) return { success: false, error: 'A senha é facilmente adivinhável.', status: 422 };

    return { success: true, message: 'A senha é segura.', status: 200 };
}

export { validarCPF, validarCEP, validadePassword, validarEmail };