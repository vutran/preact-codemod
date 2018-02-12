/**
 * Makes state available as the argument in its calling function.
 * Also strips the `this` context in the JSX expression.
 */
module.exports = (file, api) => {
  const j = api.jscodeshift;
  const root = j(file.source);

  // strip this context and add the props to the function params
  root
    .find(j.ThisExpression)
    .closest(j.MemberExpression)
    .filter(
      n =>
        n.value.object.type === 'ThisExpression' &&
        n.value.property.name === 'state'
    )
    .closest(j.MemberExpression)
    .replaceWith(n => {
      const prop = n.value.property.name;
      const newNode = {
        type: 'MemberExpression',
        object: {
          type: 'Identifier',
          name: 'state',
        },
        property: {
          type: 'Identifier',
          name: prop,
        },
      };
      if (prop) {
        j(n)
          .closest(j.FunctionExpression)
          .forEach(n1 => {
            if (!n1.value.params.length) {
              n1.value.params.push('props');
            }
            n1.value.params.push('state');
          });
      }
      return newNode;
    });

  return root.toSource({ quote: 'single' });
};
