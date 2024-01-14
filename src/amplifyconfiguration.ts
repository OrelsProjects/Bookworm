import { Amplify } from "aws-amplify";
import dotenv from "dotenv";
dotenv.config();

const environment = process.env.NODE_ENV;
console.log("environment", environment);
const config = {
  aws_project_region: "us-east-1",
  aws_cognito_identity_pool_id:
    process.env.NEXT_PUBLIC_AWS_COGNITO_IDENTITY_POOL_ID,
  aws_user_pools_id: process.env.NEXT_PUBLIC_AWS_USER_POOLS_ID,
  aws_user_pools_web_client_id:
    process.env.NEXT_PUBLIC_AWS_USER_POOLS_WEB_CLIENT_ID,
  aws_cognito_region: "us-east-1",
  oauth: {
    domain: "bookwormapp7ee6ffe0-7ee6ffe0-dev.auth.us-east-1.amazoncognito.com",
    scope: [
      "phone",
      "email",
      "openid",
      "profile",
      "aws.cognito.signin.user.admin",
    ],
    redirectSignIn:
      environment === "production"
        ? "https://bookworm-beige.vercel.app/home/"
        : "http://localhost:3001/home",
    redirectSignOut:
      environment === "production"
        ? "https://bookworm-beige.vercel.app/"
        : "http://localhost:3001/",
    responseType: "code",
  },
  federationTarget: "COGNITO_USER_POOLS",
  aws_cognito_username_attributes: [],
  aws_cognito_social_providers: [],
  aws_cognito_signup_attributes: ["EMAIL"],
  aws_cognito_mfa_configuration: "OFF",
  aws_cognito_mfa_types: ["SMS"],
  aws_cognito_password_protection_settings: {
    passwordPolicyMinLength: 8,
    passwordPolicyCharacters: [],
  },
  aws_cognito_verification_mechanisms: ["EMAIL"],
};

Amplify.configure(config);
