/**
 * Makes props available as the argument in its calling function.
 * Also strips the `this` context in the JSX expression.
 */
module.exports = ({ source }, { jscodeshift: j }) => {
  const root = j(source);

  // strip this context and add the props to the function params
  root
    .find(j.ThisExpression)
    .closest(j.MemberExpression)
    .filter(
      ({ value: { object: { type }, property: { name } } }) =>
        type === 'ThisExpression' && name === 'props'
    )
    .closest(j.MemberExpression)
    .filter(j.MemberExpression, { name: 'props' })
    .replaceWith(({ value: { property: { name: prop } } }) => {
      if (prop) {
        j(n).closest(j.FunctionExpression).forEach(({ value: { params: { length }, params } }) => {
          if (!length) {
            params.push('props');
          }
        });
      }
      return {
        type: 'MemberExpression',
        object: {
          type: 'Identifier',
          name: 'props'
        },
        property: {
          type: 'Identifier',
          name: prop
        }
      };
    });

  return root.toSource();
};
