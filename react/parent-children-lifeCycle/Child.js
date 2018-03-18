import React from 'react';

class Child extends React.PureComponent {
  render () {
    return (
      <div style={{ height: '50px', background: 'pink' }}>
       'This is a message from child'
      </div>
    )
  }
}