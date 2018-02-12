/**
 * Removes the named import: PropTypes
 */
const removeNamedImportPropTypes = (file, api) => {
  const j = api.jscodeshift;
  const root = j(file.source);
  root
    .find(j.ImportSpecifier)
    .filter(n => n.value.imported.name === 'PropTypes')
    .remove();

  return root.toSource({ quote: 'single' });
};

/**
 * Removes unnecessary empty import declarations
 */
const removeEmptyImports = (file, api) => {
  const j = api.jscodeshift;
  const root = j(file.source);
  root
    .find(j.ImportDeclaration)
    .filter(n => !n.value.specifiers.length)
    .remove();

  return root.toSource({ quote: 'single' });
};

/**
 * Removes all propTypes assignments
 */
const removePropTypesAssignments = (file, api) => {
  const j = api.jscodeshift;
  const root = j(file.source);
  root
    .find(j.AssignmentExpression)
    .filter(n => n.value.left.property.name === 'propTypes')
    .remove();

  return root.toSource({ quote: 'single' });
};

module.exports = (file, api) => {
  let source = file.source;

  source = removeNamedImportPropTypes({ source }, api);
  source = removeEmptyImports({ source }, api);
  source = removePropTypesAssignments({ source }, api);

  return source;
};
