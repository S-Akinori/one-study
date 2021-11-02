import React from "react";
import SocialButton from "../components/SocialButton";

const FacebookAuth = () => {
  
  const handleSocialLogin = (user: any) => {
    console.log(user);
  };

  const handleSocialLoginFailure = (err: any) => {
    console.error(err);
  };

  return (
    <div>
      <SocialButton
        provider="facebook"
        appId={process.env.FACEBOOK_LOGIN_APP_ID as string}
        onLoginSuccess={handleSocialLogin}
        onLoginFailure={handleSocialLoginFailure}
      >
        Googleログイン
      </SocialButton>
    </div>
  );
}

export default FacebookAuth;