import React, { Component } from "react";

class ExClock extends Component {
  constructor(props) {
    super(props);
    this.state = {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0
    };
  }
  componentDidMount() {
    console.log('[DeadLine]=', this.props.deadline);
    // this.getTimeUntil(this.props.deadline);
    // setInterval(() => this.getTimeUntil(this.props.deadline), 1000);
  }
  leading0(num) {
    return num < 10 ? "0" + num : num;
  }
  getTimeUntil(deadline) {
    const time = Date.parse(deadline) - Date.parse(new Date());
    if (time < 0) {
      this.setState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    } else {
      const seconds = Math.floor((time / 1000) % 60);
      const minutes = Math.floor((time / 1000 / 60) % 60);
      const hours = Math.floor((time / (1000 * 60 * 60)) % 24);
      const days = Math.floor(time / (1000 * 60 * 60 * 24));
      this.setState({ days, hours, minutes, seconds });
    }
  }
  componentWillUnmount() {
    // fix Warning: Can't perform a React state update on an unmounted component
    this.setState = (state, callback) => {
      return;
    };
  }
  render() {
    return (
      <>
        <div className="Clock-item">
          <div className="Clock-days">
            {this.leading0(this.state.days)}
          </div>
          <span>DAYS</span>
        </div>
        <div className="Clock-item">
          <div className="Clock-hours">
            {this.leading0(this.state.hours)}
          </div>
          <span>HRS</span>
        </div>
        <div className="Clock-item">
          <div className="Clock-minutes">
            {this.leading0(this.state.minutes)}
          </div>
          <span>MINS</span>
        </div>
        <div className="Clock-item">
          <div className="Clock-seconds">
            {this.leading0(this.state.seconds)}
          </div>
          <span>SECS</span>
        </div>
      </>
    );
  }
}
export default ExClock;
