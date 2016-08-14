/**
 * Transforms ReactDOM.render to preact.render
 */
module.exports = (file, api) => {
  const j = api.jscodeshift;
  const root = j(file.source);

  root
    .find(j.MemberExpression)
    .filter(n => n.value.object.name === 'ReactDOM' && n.value.property.name === 'render')
    .replaceWith({ type: 'Identifier', name: 'render' });

  return root.toSource();
};
