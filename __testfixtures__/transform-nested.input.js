const React = require('react');
const ReactDOM = require('react-dom');

const data = {
  items: [
    { name: 'Buy milk', done: false },
    { name: 'Do laundry', done: false },
  ],
};

const TodoItem = React.createClass({
  render: function() {
    return (
      <div>
        <input type="checkbox" value={this.state.done} />
        {this.props.item.name}
      </div>
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
