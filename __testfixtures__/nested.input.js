const React = require('react');
const ReactDOM = require('react-dom');

const TodoItem = React.createClass({
  render: function() {
    return (
      <div>Buy milk</div>
    );
  },
});

const App = React.createClass({
  render: function() {
    return (
      <div>
      	<TodoItem />
      </div>
    );
  }
});

ReactDOM.render(
  <App />,
  document.body
);
