jest.autoMockOff();

const path = require('path');
const defineTest = require('jscodeshift/dist/testUtils').defineTest;

defineTest(__dirname, 'transform', null, 'transform');
