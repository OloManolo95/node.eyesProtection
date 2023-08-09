import React from 'react';
import { render } from 'react-dom';

const { ipcRenderer } = window.require('electron');

class App extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      status: 'off', // Default status
      time: 0, // Time in seconds
      timer: null, // Timer interval reference
    };
  }

  formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60).toString().padStart(2, '0');
    const remainingSeconds = (seconds % 60).toString().padStart(2, '0');
    return `${minutes}:${remainingSeconds}`;
  };

  startTimer = () => {
    const { status, timer } = this.state;

    if (status === 'off' || status === 'reset') {
      clearInterval(timer);

      this.setState({
        status: 'work',
        time: 20 * 60, // Set the time to 20 minutes in seconds
      });

      const newTimer = setInterval(() => {
        this.setState((prevState) => ({
          time: prevState.time - 1,
        }), () => {
          if (this.state.time === 0) {
            this.setState((prevState) => ({
              status: prevState.status === 'work' ? 'rest' : 'work',
              time: prevState.status === 'work' ? 12 * 60 : 20,
            }));
          }
        });
      }, 1000);

      this.setState({ timer: newTimer });
    }
  };

  stopTimer = () => {
    clearInterval(this.state.timer);
    this.setState({
      status: 'off',
      time: 0,
      timer: null,
    });
  };

  closeApp() {
    window.close()
  }


  render() {

    const { status, time } = this.state;
    const showDescription = status === 'off';
    const showWorkImage = status === 'work';
    const showRestImage = status === 'rest';
    const showTimer = status !== 'off';
    const showStartButton = status === 'off';
    const showStopButton = status !== 'off';

    return (
      <div>
        <h1>Protect your eyes</h1>
        {showDescription && (
          <div className='description'>
            <p>According to optometrists in order to save your eyes, you should follow the 20/20/20. It means you should to rest your eyes every 20 minutes for 20 seconds by looking more than 20 feet away.</p>
            <p>This app will help you track your time and inform you when it's time to rest.</p>
          </div>
        )}
        {showWorkImage && <img src="./images/work.png" />}
        {showRestImage && <img src="./images/rest.png" />}
        {showTimer && (<div className="timer">
            {this.formatTime(time)}
          </div>
        )}
        {showStartButton && <button className="btn" onClick={this.startTimer}>Start</button>}
        {showStopButton && <button className="btn" onClick={this.stopTimer}>Stop</button>}
        <button className="btn btn-close" onClick={this.closeApp}>X</button>
      </div>
    )
  }
};

render(<App />, document.querySelector('#app'));
