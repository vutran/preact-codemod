jest.autoMockOff();

const path = require('path');
const defineTest = require('jscodeshift/dist/testUtils').defineTest;

defineTest(__dirname, 'transforms/props', null, 'props');
defineTest(__dirname, 'transform', null, 'transform');
defineTest(__dirname, 'transform', null, 'nested');
