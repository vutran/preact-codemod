/**
 * Transforms React.createClass to a pure function
 */
module.exports = (file, api) => {
  const j = api.jscodeshift;
  const root = j(file.source);

  root
    .find(j.Identifier, n => n.name === 'createClass')
    .closest(j.CallExpression)
    .find(j.JSXElement)
    .filter(n => n.parentPath.value.type === 'ReturnStatement')
    .closest(j.CallExpression)
    .replaceWith(
      n =>
        n.value.arguments[0].properties.filter(p => p.key.name === 'render')[0]
          .value
    );

  return root.toSource({ quote: 'single' });
};
