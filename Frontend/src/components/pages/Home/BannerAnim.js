import React from "react";
import { useLottie } from "lottie-react";

import homeBannerAnimation from "../../../assets/banner-anim.json";

export default function BannerAnim() {
  const options = {
    animationData: homeBannerAnimation,
    loop: true,
    autoplay: true
  };

  const { View } = useLottie(options);

  return (
    <>
      {View}
    </>
  );
}
