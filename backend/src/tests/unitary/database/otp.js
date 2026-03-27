import { createOTP, validateOTP, deleteOTP, removeExpiredOTPs } from "../../../database/auth/otp/dao.js";
import { readUser } from "../../../database/account/user/dao.js";


export const testOTP = async () => {
    try {
        const dataUser = (await readUser({ email: 'teste1@exemplo.com' })).user;
        // console.log(JSON.stringify(dataUser, null, 2));
        const userId = dataUser?.user_id;


        // CREATE OTP
        const dataTest1 = await createOTP({ user_id: userId, objective: "validate email" });
        if (!dataTest1.success) throw "> [Test OTP]: Erro na criação do OTP";
        if (!dataTest1.code) throw "> [Test OTP]: Código OTP não retornado após criação";
        // console.log(dataTest1.code, dataTest1.otp.code);


        // VALIDATE OTP (teste com código incorreto)
        const dataTest3_1 = await validateOTP({ user_id: userId, code: "123456" });
        const dataTest3_2 = await validateOTP({ user_id: userId, code: "123456" });
        const dataTest3_3 = await validateOTP({ user_id: userId, code: "123456" });
        if (dataTest3_1.success) throw "> [Test OTP]: Validação falhou ao aceitar um código incorreto";
        if (dataTest3_2.success) throw "> [Test OTP]: Validação falhou ao aceitar um código incorreto";
        if (dataTest3_3.success) throw "> [Test OTP]: Validação falhou ao aceitar um código incorreto";


        // VALIDATE OTP (teste com código correto)
        const dataTest2 = await createOTP({ user_id: userId, objective: "validate email" });
        const dataTest2_1 = await validateOTP({ user_id: userId, code: dataTest2.code });
        // console.log(JSON.stringify(dataTest2_1, null, 2));
        if (!dataTest2_1.success) throw "> [Test OTP]: OTP inválido após criação";


        // DELETE OTP
        await createOTP({ user_id: userId, objective: "validate email" });
        const dataTest4 = await deleteOTP({ user_id: userId });
        if (!dataTest4.success) throw "> [Test OTP]: Falha ao deletar o OTP";


        // REMOVE EXPIRED OTPS (Simulação)
        const expiredOTPsRemoved = await removeExpiredOTPs();

        console.log(`   OTP\t\t\t✅`);
        return true;
    } catch (error) {
        console.error(`   OTP ❌ ${error}`);
        return false;
    }
};
