import fs from 'fs';

const firstMatch = 'export const ConfigSchema = ';
const lastMatch = '});';

const file = fs.readFileSync('source/schema.ts', {encoding: 'utf-8'});

console.log(
	file
		.slice(
			file.indexOf(firstMatch) + firstMatch.length,
			file.indexOf(lastMatch) + lastMatch.length,
		)
		.replace(/\t/g, '  '),
);
