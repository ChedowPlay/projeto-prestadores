// 250129V


import { sendEmailCode } from "../../../email/otp";


const testEmail = async () => {
    try {
        const emailLog = await sendEmailCode({
            target: 'lucas.almida.da.silva@gmail.com',
            code: '123 456',
            test: true,
            title: `Redefinição de senha: ${'123 456'}`,
        });

        if (emailLog.success) {
            console.log("   Email\t\t✅");
            return true;
        }
        else {
            console.error("   Email ❌", JSON.stringify(emailLog, null, 2));
            return false;
        }
    } catch (error) {
        console.error("   Email ❌", error);
        return false;
    }
}


export default testEmail;
