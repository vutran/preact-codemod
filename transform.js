export default function transformer(file, api) {
  const j = api.jscodeshift;
  const {expression, statement, statements} = j.template;
  const root = j(file.source);

  const getPreact = node => {
    return {
      type: 'MemberExpression',
      object: {
        type: 'CallExpression',
        callee: {
          type: 'Identifier',
          name: 'require',
        },
        arguments: [
          {
            type: 'Literal',
            value: 'preact',
          },
        ],
      },
      property: {
        type: 'Identifier',
        name: 'h',
      },
    };
  };

  const preactRender = {
    type: 'MemberExpression',
    object: {
      type: 'CallExpression',
      callee: {
        type: 'Identifier',
        name: 'require',
      },
      arguments: [
        {
          type: 'Literal',
          value: 'preact',
        },
      ],
    },
    property: {
      type: 'Identifier',
      name: 'render',
    },
  };

  // replace preact
  const r = root
  	.findVariableDeclarators('React')
    .filter(n => n.value.init.callee)
    // rename var
  	.renameTo('preact')
	// update call
  	.find(j.CallExpression)
  	.closest(j.VariableDeclaration)
	.remove();
  	//.replaceWith(getPreact);


  // replace render
  const rD = root
    .findVariableDeclarators('ReactDOM')
    // rename var
    .forEach(n => {
      n.value.id.name = 'render';
    })
    // replace call
    .find(j.CallExpression)
  	.closest(j.VariableDeclaration)
	//.replaceWith(preactRender);
	.replaceWith(importPreact);

  // replace createClass
  let jsxElement = null;
  const rCC = root
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
  	.replaceWith(n => getNewCallee(n.parentPath))
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

  return root
    .toSource();
};

const importPreact = () => ({
  type: 'ImportDeclaration',
  importKind: 'value',
  specifiers: [
    {
      type: 'ImportSpecifier',
      imported: {
        type: 'Identifier',
        name: 'h',
      },
      local: {
        type: 'Identifier',
        name: 'h',
      },
    },
    {
      type: 'ImportSpecifier',
      imported: {
        type: 'Identifier',
        name: 'render',
      },
      local: {
        type: 'Identifier',
        name: 'render',
      },
    },
  ],
  source: {
    type: 'Literal',
    value: 'preact',
  },
});

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
    parenthesizedExpression: true,
    children: node.value.children.slice(),
  };
};

const getNewCallee = node => ({ type: 'Identifier', name: 'render' });
