const React = require('react');
const ReactDOM = require('react-dom');

const HelloReact = React.createClass({
  render: function() {
    return (
      <div>
        <span>Hello, World!</span>
        <span>I get transformed to Preact!</span>
      </div>
    );
  }
});

ReactDOM.render(
  <HelloReact />,
  document.body
);
