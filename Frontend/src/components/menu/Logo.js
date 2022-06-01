import React from 'react';
import { useLottie } from "lottie-react";
import logoAnim from "../../assets/logo-anim.json";

const LogoAnim = () => {
  const options = {
    animationData: logoAnim,
    loop: true,
    autoplay: true
  };

  const { View } = useLottie(options);

  return (
    <div style={{ width: '60px' }}>
      {View}
    </div>
  );
}

export default LogoAnim;