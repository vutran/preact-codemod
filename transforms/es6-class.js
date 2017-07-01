/**
 * Transforms React.createClass to an ES6 class
 */
module.exports = (file, api) => {
  const j = api.jscodeshift;
  const root = j(file.source);

  root
    .find(j.Identifier, n => n.name === "createClass")
    .closest(j.VariableDeclaration)
    .replaceWith(v => {
      return v.value.declarations.map(n => {
        const className = n.id.name;
        const props = n.init.arguments[0].properties;
        const literals = [];
        const methods = [];
        const body = [];
        const constructorBody = [
          {
            type: "ExpressionStatement",
            expression: {
              type: "CallExpression",
              callee: {
                type: "Super"
              },
              arguments: [
                {
                  type: "Identifier",
                  name: "props"
                },
                {
                  type: "Identifier",
                  name: "context"
                }
              ]
            }
          }
        ];
        // iterate through each props
        // and build a definition for all class
        // properties and methods
        props.forEach(prop => {
          switch (prop.value.type) {
            case "FunctionExpression":
              methods.push({
                type: "MethodDefinition",
                key: prop.key,
                value: prop.value
              });
              break;
            case "Literal":
              literals.push({
                type: "ExpressionStatement",
                expression: {
                  type: "AssignmentExpression",
                  operator: "=",
                  left: {
                    type: "MemberExpression",
                    object: {
                      type: "ThisExpression"
                    },
                    property: {
                      type: "Identifier",
                      name: prop.key.name
                    }
                  },
                  right: {
                    type: "Literal",
                    value: prop.value.value
                  }
                }
              });
              break;
          }
        });
        // build the body
        if (literals.length) {
          body.unshift({
            type: "MethodDefinition",
            key: {
              type: "Identifier",
              name: "constructor"
            },
            static: false,
            kind: "constructor",
            value: {
              type: "FunctionExpression",
              params: [
                {
                  type: "Identifier",
                  name: "props"
                },
                {
                  type: "Identifier",
                  name: "context"
                }
              ],
              body: {
                type: "BlockStatement",
                body: constructorBody.concat(literals)
              }
            }
          });
        }
        // create the class
        return {
          type: "ClassDeclaration",
          id: {
            type: "Identifier",
            name: n.id.name
          },
          superClass: {
            type: "Identifier",
            name: "Component"
          },
          body: {
            type: "ClassBody",
            body: body.concat(methods)
          }
        };
      });
    });

  return root.toSource();
};
