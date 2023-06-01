#!/usr/bin/env node
import React from 'react';
import {render} from 'ink';
import meow from 'meow';
import App from './app.js';

const cli = meow(
	`
	Usage
	  $ my-ink-cli

	Options
		--confirm  Should program confirm before beginning

	Examples
	  $ my-ink-cli --name=Jane
	  Hello, Jane
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
