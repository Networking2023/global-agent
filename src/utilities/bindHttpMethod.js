// @flow

import http from 'http';
import https from 'https';

type AgentType = http.Agent | https.Agent;

// eslint-disable-next-line flowtype/no-weak-types
export default (originalMethod: Function, agent: AgentType) => {
  // eslint-disable-next-line unicorn/prevent-abbreviations
  return (...args: *) => {
    let url;
    let options;
    let callback;

    if (typeof args[0] === 'string') {
      url = args[0];

      if (typeof args[1] === 'function') {
        options = {};
        callback = args[1];
      } else {
        options = {
          ...args[1]
        };
        callback = args[2];
      }
    } else {
      options = {
        ...args[0]
      };
      callback = args[1];
    }

    if (!options.agent) {
      options.agent = agent;
    }

    // `request` module sets `agent` property to `http.globalAgent`/ `https.globalAgent` by default.
    if (options.agent === http.globalAgent || options.agent === https.globalAgent) {
      options.agent = agent;
    }

    if (url) {
      // $FlowFixMe
      return originalMethod(url, options, callback);
    } else {
      return originalMethod(options, callback);
    }
  };
};