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
    .replaceWith(importDeclaration('preact', ['h', 'render']));

  // replace createClass
  let jsxElement = null;
  root
    .find(j.Identifier, n => n.name === 'createClass')
    .closest(j.CallExpression)
    .find(j.JSXElement)
    .forEach(n => {
      if (n.parentPath.value.type === 'ReturnStatement') {
        jsxElement = n;
      }
    })
    .closest(j.CallExpression)
    .replaceWith(n => getJSXElement(jsxElement));

  // replace ReactDOM.render() call
  const renderCall = root
    .find(j.MemberExpression)
    .filter(n => n.value.object.name === 'ReactDOM' && n.value.property.name === 'render')
    // replace render()
    .replaceWith({ type: 'Identifier', name: 'render' })
    // replace args
    .forEach(n => {
      const args = n.parentPath.value.arguments.map(a => {
        if (a.type === 'JSXElement') {
          return a.openingElement.name.name;
        }
        return a;
      });
      n.parentPath.value.arguments = args;
    });

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
  return {
    type: node.value.type,
    openingElement: {
      type: node.value.openingElement.type,
      name: {
        type: node.value.openingElement.name.type,
        name: node.value.openingElement.name.name,
      },
      attributes: [],
    },
    closingElement: {
      type: node.value.closingElement.type,
      name: {
        type: node.value.closingElement.name.type,
        name: node.value.closingElement.name.name,
      },
      attributes: [],
    },
    parenthesizedExpression: node.value.parenthesizedExpression,
    children: node.value.children.slice(),
  };
};
