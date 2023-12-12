import { ResourcesConfig } from "aws-amplify";

const awsConfig: ResourcesConfig = {
  Auth: {
    Cognito: {
      identityPoolId: process.env.NEXT_PUBLIC_COGNITO_IDENTITY_POOL_ID || "",
      userPoolId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID || "",
      userPoolClientId: process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID || "",
      loginWith: {
        oauth: {
          domain: process.env.NEXT_PUBLIC_COGNITO_DOMAIN || "",
          scopes: ["profile", "email", "openid"],
          redirectSignIn: ["http://localhost:3001"],
          redirectSignOut: ["http://localhost:3001"],
          responseType: "code",
        },
      },
    },
  },
};

export default awsConfig;
