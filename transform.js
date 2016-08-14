const importDeclarations = require('./transforms/import-declarations');
const createClass = require('./transforms/create-class');
const render = require('./transforms/render');

/**
 * Magic
 */
module.exports = (file, api) => {
  let source = file.source;

  // transform: import-declarations
  source = importDeclarations({ source }, api);
  source = createClass({ source }, api);
  source = render({ source }, api);

  return source;
};
