#!/usr/bin/env node
import React from 'react';
import {render} from 'ink';
import meow from 'meow';
import App from './app.js';

const cli = meow(
	`
	Usage
	  $ pup

	Options
		--confirm  Should program get confirmation before running

	Examples
	  $ pup
`,
	{
		importMeta: import.meta,
		flags: {
			confirm: {
				type: 'boolean',
			},
		},
	},
);

render(<App confirm={cli.flags.confirm} />);
