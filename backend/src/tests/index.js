// 250204V


import { testComplaint } from "./unitary/database/complaint";
import { testFavorite } from "./unitary/database/favorite";
import { testCategory } from "./unitary/database/category";
import { testProvider } from "./unitary/database/provider";
import { testService } from "./unitary/database/service";
import testEmail from "./unitary/email/validationCode";
import { testToken } from "./unitary/database/token";
import { testFile } from "./unitary/database/file";
import { testUser } from "./unitary/database/user";
import { testWork } from "./unitary/database/work";
import { testPlan } from "./unitary/database/plan";
import { testOTP } from "./unitary/database/otp";


export const testes = async () => {
    try {
        let test = 0;
        let totalTests = 0;

        // A ordem importa, cuidado!
        const testFunctions = [
            // DATABASE
            // ACCOUNT
            testUser,
            
            // AUTH
            testToken,
            testOTP,

            // BUSINESS
            testCategory,
            testService,
            testPlan,

            // PROVIDER
            testProvider,
            testWork,
            testFile,
            
            // INTERACTIONS
            testFavorite,
            testComplaint,
            
            // EMAIL
            testEmail,
        ];

        for (const testFunc of testFunctions) {
            test += await testFunc();
            totalTests++;
        }

        console.log(' ');
        if (test !== totalTests) throw 'Um ou mais testes não passaram';
        return true;
    } catch (error) {
        return false;
    }
};
