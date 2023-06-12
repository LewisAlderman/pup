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
		--c  Should program get confirmation before running
		--print  Prints out zod config schema for reference
		--init	Initializes an empty pup config in current directory

	Examples
	  $ pup -c
`,
	{
		importMeta: import.meta,
		flags: {
			confirm: {
				type: 'boolean',
			},
			c: {
				type: 'boolean',
			},
			print: {
				type: 'boolean',
			},
			init: {
				type: 'boolean',
			},
		},
	},
);

render(
	<App
		confirm={cli.flags.confirm}
		c={cli.flags.c}
		print={cli.flags.print}
		init={cli.flags.init}
	/>,
);
