import {h, render} from "preact";

const HelloReact = <div>
  <span>Hello, World!</span>
  <span>I get transformed to Preact!</span>
</div>;

render(HelloReact, document.body);
