import React, { ReactNode } from "react";
import SocialLogin from "react-social-login";

interface Props {
  children: ReactNode,
  triggerLogin: any
}

class SocialButton extends React.Component {
  render() {
    const { children, triggerLogin, ...props } = this.props as Props;
    return (
      <button onClick={triggerLogin} {...props}>
        {children}
      </button>
    );
  }
}

export default SocialLogin(SocialButton);