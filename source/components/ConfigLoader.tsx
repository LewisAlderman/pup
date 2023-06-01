import {Text} from 'ink';
import React, {useEffect} from 'react';
import z from 'zod';
import fs from 'fs';
import {useConfigContext} from '../context/config.js';

let promise: Promise<void> | undefined;
let state: string | undefined;
let value: string | undefined;

export const ConfigSchema = z.object({
	items: z
		.array(
			z.object({
				label: z.string(),
				value: z.string(),
				options: z
					.array(z.string().trim().min(1))
					.nonempty({message: 'Items have at least one option'}),
			}),
		)
		.nonempty({message: 'Config have at least one item'}),
	alwaysShownOptions: z.array(z.string().trim().min(1)).min(1).optional(),
});

export type Config = z.infer<typeof ConfigSchema>;
export type ConfigItems = Config['items'];
export type ConfigItem = ConfigItems[number];

// @ts-ignore
const loadConfigJson = () => {
	if (!promise) {
		let json: string | undefined;

		promise = Promise.all([
			new Promise(resolve =>
				fs.readFile('./test.json', (err, _json) => {
					if (err) {
						throw err;
					}

					json = _json.toString();
					resolve('done');
				}),
			),
			// make this take AT LEAST X amount of time
			new Promise(resolve => setTimeout(resolve, 2000)),
		]).then(() => void {});

		state = 'pending';

		void promise.then(() => {
			state = 'done';
			value = json;
		});
	}

	if (state === 'pending') {
		// eslint-disable-next-line @typescript-eslint/no-throw-literal
		throw promise;
	}

	if (state === 'done') {
		return value;
	}
};

export const ConfigLoader = () => {
	const json = loadConfigJson();
	const parsed = JSON.parse(json ?? JSON.stringify({}));

	const {setState} = useConfigContext();

	useEffect(() => {
		(async () => {
			if (parsed) {
				const validated = await ConfigSchema.parseAsync(parsed);
				if (validated) {
					setState(parsed);
				}
			}
		})();
	}, [parsed]);

	return <Text>Loading configuration &hellip;</Text>;
};
