import React, { Component } from 'react';
import { useLottie } from "lottie-react";
import { ReactComponent as MySVG } from "../../assets/images/scroll-to.svg";
import rocketAnim from "../../assets/rocket-anim.json";

const RocketAnim = () => {
  const options = {
    animationData: rocketAnim,
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

export default class ScrollToTop extends Component {

  constructor(props) {
    super(props);
    this.state = {
      is_visible: false
    };
  }

  componentDidMount() {
    var scrollComponent = this;
    document.addEventListener("scroll", function(e) {
      scrollComponent.toggleVisibility();
    });
  }

  toggleVisibility() {
    if (window.pageYOffset > 600) {
      this.setState({
        is_visible: true
      });
    } else { this.setState({
        is_visible: false
      });
    }
  }

  scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }

  render() {
    const { is_visible } = this.state;
    return (
      <div id='scroll-to-top' className='init'>
        {is_visible && (
          <div onClick={() => this.scrollToTop()}>
            <RocketAnim />
          </div>
        )}
      </div>
    );
  }
}
