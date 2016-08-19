class App extends Component {
  constructor() {
    super();
    this.foo = "bar";
  }

  shouldComponentUpdate() {
    return true;
  }

  render() {
    return (
      <div>Test</div>
    );
  }
}

class App1 extends Component {
  constructor() {
    super();
    this.id = 1;
  }
}

class App2 extends Component {
  constructor() {
    super();
    this.id = 2;
  }
}
