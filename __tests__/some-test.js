'use strict';

jest.unmock('../public/js/app');
jest.dontMock('react')

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
    var message = TestUtils.renderIntoDocument( <Message />);
    var messageNode = ReactDOM.findDOMNode(message);
    expect(textUtils.isCompositeComponent(message)).toBeTruthy();
  })
})
