'use strict';

jest.unmock('../public/js/app');

// import React from 'react';
// import ReactDOM from 'react-dom';
// import TestUtils from 'react-addons-test-utils';
// import componentName from '../public/js/app'

var React = require('react');
var ReactDOM = require('react-dom');
var TestUtils = require('react-addons-test-utils');
var MessageComponent = require('../public/js/app');

describe('some test on some component', () => {
  it('does something or other', () => {
    const container = ReactDOM.findDOMNode(container);
    var message = TestUtils.renderIntoDocument( <Message />);
    expect(textUtils.isCompositeComponent(message)).toBeTruthy();
  })
})
