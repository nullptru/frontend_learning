import React from 'react';

export default class Child extends React.PureComponent {
  constructor(props) {
    super(props);
    console.log('Child Constructor');
  }

  componentWillMount() {
    console.log('Child componentWillMount');
  }

  componentDidMount() {
    console.log('Child componentDidMount');
  }

  componentWillUnmount() {
    console.log('Child componentWillUnmount');
  }

  componentWillReceiveProps(nextProps) {
    console.log('Child componentWillReceiveProps(nextProps)');
  }

  componentWillUpdate(nextProps, nextState) {
    console.log('Child componentWillUpdate(nextProps, nextState)');
  }

  shouldComponentUpdate(nextProps, nextState) {
    console.log('Child shouldComponentUpdate(nextProps, nextState)');
    return true;
  }

  componentDidUpdate(prevProps, prevState) {
    console.log('Child componentDidUpdate(prevProps, prevState)');
  }

  render () {
    console.log('Child render');
    return (
      <div style={{ height: '50px', background: 'pink' }}>
       'This is a message from child'
      </div>
    )
  }
}