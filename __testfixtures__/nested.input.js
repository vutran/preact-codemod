const React = require('react');
const ReactDOM = require('react-dom');

const data = {
  items: [
    'Buy milk',
    'Do laundry',
  ],
};

const TodoItem = React.createClass({
  render: function() {
    return (
      <div>{this.props.item}</div>
    );
  },
});

const App = React.createClass({
  render: function() {
    return (
      <div>
        {this.props.data.items.map(item => <TodoItem item={item} />)}
      </div>
    );
  }
});

ReactDOM.render(
  <App data={data} />,
  document.body
);
