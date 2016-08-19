const importDeclarations = require('./transforms/import-declarations');
const createClass = require('./transforms/create-class');
const render = require('./transforms/render');
const props = require('./transforms/props');
const state = require('./transforms/state');

/**
 * Magic
 */
module.exports = (file, api) => {
  let source = file.source;

  source = importDeclarations({ source }, api);
  source = createClass({ source }, api);
  source = render({ source }, api);
  source = props({ source }, api);
  source = state({ source }, api);

  return source;
};
