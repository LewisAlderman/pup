import {exec} from 'child_process';
import fs from 'fs';

exec('node dist/scripts/schema-to-stdout', _err => {
	console.log('Running with --init flag\n');

	if (fs.existsSync('./pup.json')) {
		console.log(
			'(!) Config file already exists. If you want to overwrite it - delete it manually and run the command again',
		);

		process.exit(1);
	}

	if (_err) throw _err;
	fs.writeFileSync(
		'./pup.json',
		`{
"items": []
}`,
	);

	console.log('Created empty config file at ./pup.json\n');
	console.log(
		`You'll need to add items to it manually. If you need a reminder of the schema - simply run 'pup --print'`,
	);
});
