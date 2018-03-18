import React from 'react';
import ReactDOM from 'react-dom';
import Child from './Child';

class App extends React.PureComponent {
  state = {
    toggle: false,
  }

  handleChangeParent = () => {
    this.setState((pre) => ({ toggle: !pre.toggle }));
  }

  componentDidMount() {
    console.log('RootContainer componentDidMount');
  }

  componentWillUnmount() {
      console.log('RootContainer componentWillUnmount');
  }

  componentWillReceiveProps(nextProps) {
      console.log('RootContainer componentWillReceiveProps(nextProps)');
  }

  componentWillUpdate(nextProps, nextState) {
      console.log('RootContainer componentWillUpdate(nextProps, nextState)');
  }

  shouldComponentUpdate(nextProps, nextState) {
      console.log('RootContainer shouldComponentUpdate(nextProps, nextState)');
      return true;
  }

  componentDidUpdate(prevProps, prevState) {
      console.log('RootContainer componentDidUpdate(prevProps, prevState)');
}

  render() {
    return (
      <React.Fragment>
        <div style={{ height: '50px', background: 'lightblue' }}>
          {!toggle ? 'This is a message from parent' : 'This is another message from parent'}
        </div>
        <Child />
        <button onChange={this.hanleChangeParent}>Change</button>
      </React.Fragment>
    )
  }
}

ReactDOM.render(document.getElementById('app'), <App />);
