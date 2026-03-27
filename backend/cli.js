const { envTest } = require('./src/services/env');
const { Command, option } = require('commander');
const readline = require('readline');
require('dotenv/config');


const program = new Command();


program
    .name('cli')
    .description('Comando de linhas ATP')
    .version('1.3');

program.command('test')
    .description('Verificar o arquivo .env do servidor')
    .option('-v, --verbose', 'Imprimir arquivo env formatado')
    .action((options) => { testEnv(options); });

// program.command('geratePassword')
//     .description('Gerar criptgrafia de senha')
//     .action(async () => { await geratePassword(); });

program.parse(process.argv);


// Prograns
// function gerateToken(options) {
//     console.clear();
//     console.log(`-- GERANDO TOKEN DEV v1`);
//     const expiresIn = options.time;
//     const token = JWT.sign({ id: 'DEV' }, process.env.SECRETKEY, { expiresIn: expiresIn })
//     console.log(`> Token: ${token}`);
// }


function testEnv(options) {
    console.clear();
    console.log(`-- TESTANDO ARQUIVO ENV 📄 v1`);
    try {
        const values = envTest({ callback: () => { throw new Error(''); } });
        options.verbose
            ? console.log(values)
            : console.log('Testes passaram ✅');
    } catch (error) { console.error(error); }
}


// async function geratePassword() {
//     console.clear();
//     console.log(`-- CRIAR SENHA`);
//     const rl = readline.createInterface({
//         input: process.stdin,
//         output: process.stdout
//     });
//     const question = (query) => new Promise(resolve => rl.question(query, resolve));
//     try {
//         const password = await question('Nova senha: ');
//         console.log(`Criptografando: ${password}`);
//         const senhaCriptografada = await gerarHashComplexo(password); 
//         console.log('>', senhaCriptografada?.msg);
//         console.log('Execute o comando a seguir para alterar a senha');
//         console.log(`UPDATE users SET password = '${senhaCriptografada?.msg}' WHERE id = '<ID-DO-USUÁRIO>';`);
//     } catch (error) {
//         console.error(error);
//     } finally {
//         rl.close();
//     }
// }