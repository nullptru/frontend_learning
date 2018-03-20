import React from 'react';
import Child from './Child.js';

export default class App extends React.PureComponent {
  state = {
    toggle: false,
  }

  constructor(props) {
    super(props);
    console.log('Parent Constructor');
  }

  handleChangeParent = () => {
    this.setState((pre) => ({ toggle: !pre.toggle }));
  }

  componentWillMount() {
    console.log('Parent componentWillMount');
  }

  componentDidMount() {
    console.log('Parent componentDidMount');
  }

  componentWillUnmount() {
    console.log('Parent componentWillUnmount');
  }

  componentWillReceiveProps(nextProps) {
    console.log('Parent componentWillReceiveProps(nextProps)');
  }

  componentWillUpdate(nextProps, nextState) {
    console.log('Parent componentWillUpdate(nextProps, nextState)');
  }

  shouldComponentUpdate(nextProps, nextState) {
    console.log('Parent shouldComponentUpdate(nextProps, nextState)');
    return true;
  }

  componentDidUpdate(prevProps, prevState) {
    console.log('Parent componentDidUpdate(prevProps, prevState)');
  }

  render() {
    const { toggle } = this.state;
    console.log('Parent render');
    return (
      <React.Fragment>
        <div style={{ height: '50px', background: 'lightblue' }}>
          {!toggle ? 'This is a message from parent' : 'This is another message from parent'}
        </div>
        <Child />
        <button onClick={this.handleChangeParent.bind(this)}>Change</button>
      </React.Fragment>
    )
  }
}
