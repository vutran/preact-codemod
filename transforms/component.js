const sfc = require('./component-sfc');
const es6Class = require('./es6-class');

/**
 * Conditionally transforms a component:
 * - class component
 * - stateless functional component
 */
module.exports = (file, api) => {
  const j = api.jscodeshift;
  const root = j(file.source);

  const pureProps = ['render', 'defaultProps', 'displayName'];

  root
    .find(j.Identifier, n => n.name === 'createClass')
    .closest(j.VariableDeclaration)
    .replaceWith(v => {
      return v.value.declarations.map(n => {
        const props = n.init.arguments[0].properties;
        const propKeys = props.map(p => p.key.name);
        if (propKeys.filter(p => pureProps.indexOf(p) === -1).length) {
          // transform to es6 classes
          const nv = {
            type: v.value.type,
            kind: v.value.kind,
            declarations: [j(n).toSource()],
          };
          return es6Class({ source: j(nv).toSource() }, api);
        } else {
          // transform to pure function
          const nv = {
            type: v.value.type,
            kind: v.value.kind,
            declarations: [j(n).toSource()],
          };
          return sfc({ source: j(nv).toSource() }, api);
        }
      });
    });

  return root.toSource({ quote: 'single' });
};
