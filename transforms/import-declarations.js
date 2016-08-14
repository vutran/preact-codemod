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
 * Transforms React imports to Preact imports
 */
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

  return root.toSource();
};
