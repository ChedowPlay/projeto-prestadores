// src/lib/auth/env.ts
export function getEnvVariable(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }
  return value;
}

export const authEnv = {
  google: {
    clientId: getEnvVariable('GOOGLE_CLIENT_ID'),
    clientSecret: getEnvVariable('GOOGLE_CLIENT_SECRET'),
  },
  facebook: {
    clientId: getEnvVariable('FACEBOOK_CLIENT_ID'),
    clientSecret: getEnvVariable('FACEBOOK_CLIENT_SECRET'),
  },
  authSecret: getEnvVariable('AUTH_SECRET'),
};
