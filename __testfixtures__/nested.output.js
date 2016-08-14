import {h, Component, render} from "preact";

const TodoItem = function() {
  return (
    <div>Buy milk</div>
  );
};

const App = function() {
  return (
    <div>
      <TodoItem />
    </div>
  );
};

render(
  <App />,
  document.body
);
