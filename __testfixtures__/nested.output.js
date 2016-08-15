import {h, Component, render} from "preact";

const data = {
  items: [
    'Buy milk',
    'Do laundry',
  ],
};

const TodoItem = function(props) {
  return (
    <div>{props.item}</div>
  );
};

const App = function(props) {
  return (
    <div>
      {props.data.items.map(item => <TodoItem item={item} />)}
    </div>
  );
};

render(
  <App data={data} />,
  document.body
);
