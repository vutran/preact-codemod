import {h, Component, render} from "preact";

const data = {
  items: [
    { name: 'Buy milk', done: false },
    { name: 'Do laundry', done: false },
  ],
};

const TodoItem = function(props, state) {
  return (
    <div>
      <input type="checkbox" value={state.done} />
      {props.item.name}
    </div>
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
