module.exports = (file, api) => {
  const j = api.jscodeshift;
  const root = j(file.source);

  // remove react
  root
    .findVariableDeclarators('React')
    .closest(j.VariableDeclaration)
    .remove();

  // replace render
  root
    .findVariableDeclarators('ReactDOM')
    .closest(j.VariableDeclaration)
    .replaceWith(importDeclaration('preact', ['h', 'Component', 'render']));

  // replace createClass
  root
    .find(j.Identifier, n => n.name === 'createClass')
    .closest(j.CallExpression)
    .find(j.JSXElement)
    .filter(n => n.parentPath.value.type === 'ReturnStatement')
    .closest(j.CallExpression)
    .replaceWith(n => n.value.arguments[0].properties.filter(p => p.key.name === 'render')[0].value)

  // replace ReactDOM.render() call
  root
    .find(j.MemberExpression)
    .filter(n => n.value.object.name === 'ReactDOM' && n.value.property.name === 'render')
    .replaceWith({ type: 'Identifier', name: 'render' });

  return root.toSource();
};

/**
 * Creates and returns an import declaration
 *
 * @param {String} source - The source module
 * @param {String[]} values - The named values to import
 * @return {Node}
 */
const importDeclaration = (source, values) => {
  const node = {
    type: 'ImportDeclaration',
    importKind: 'value',
    source: { type: 'Literal', value: source },
    specifiers: [],
  };
  values.forEach(v => {
    node.specifiers.push({
      type: 'ImportSpecifier',
      imported: { type: 'Identifier', name: v },
      local: { type: 'Identifier', name: v },
    })
  });
  return node;
};

/**
 * Creates and returns a new JSXElement node
 *
 * @param {Node} node
 * @return {Node}
 */
const getJSXElement = node => {
  const render = node.value.arguments[0].properties.filter(p => p.key.name === 'render')[0];
  const jsxElement = render.value.body.body[0].argument;
  console.log(jsxElement);

  return {
    type: jsxElement.type,
    openingElement: {
      type: jsxElement.openingElement.type,
      name: {
        type: jsxElement.openingElement.name.type,
        name: jsxElement.openingElement.name.name,
      },
      attributes: jsxElement.openingElement.attributes,
    },
    closingElement: {
      type: jsxElement.closingElement.type,
      name: {
        type: jsxElement.closingElement.name.type,
        name: jsxElement.closingElement.name.name,
      },
      attributes: [],
    },
    parenthesizedExpression: jsxElement.parenthesizedExpression,
    children: jsxElement.children.slice(),
  };
};
