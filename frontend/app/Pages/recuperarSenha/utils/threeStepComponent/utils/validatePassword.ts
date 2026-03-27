const wordlistPass = [
  '123456', '123', 'teste123*',
  'senha', 'password', 'qwerty',
  'abc123', 'admin', 'iloveyou',
  'letmein', 'monkey', 'sunshine',
  'superman', 'welcome', 'senha'];
const caractereEspeciais = '!@#$%¨:;^&*()[]{}/*-+|\\=<>'.split('');
interface ValidationResult {
  success: boolean;
  error: string;
  message?: string;
  status: number;
}

export function validadePassword(senha: string): ValidationResult {


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

  return { success: true, message: 'A senha é segura.', status: 200, error:'' };
}
