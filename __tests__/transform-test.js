jest.autoMockOff();

const path = require('path');
const defineTest = require('jscodeshift/dist/testUtils').defineTest;

defineTest(__dirname, 'transforms/component', null, 'component');
defineTest(__dirname, 'transforms/create-class', null, 'create-class');
defineTest(__dirname, 'transforms/es6-class', null, 'es6-class');
defineTest(__dirname, 'transforms/import-declarations', null, 'import-declarations-component');
defineTest(__dirname, 'transforms/import-declarations', null, 'import-declarations-render');
defineTest(__dirname, 'transforms/import-declarations', null, 'import-declarations');
defineTest(__dirname, 'transforms/props', null, 'props');
defineTest(__dirname, 'transforms/removePropTypes', null, 'removePropTypes');
defineTest(__dirname, 'transforms/render', null, 'render');
defineTest(__dirname, 'transforms/state', null, 'state');

// global tests
defineTest(__dirname, 'transform', null, 'transform-nested');
