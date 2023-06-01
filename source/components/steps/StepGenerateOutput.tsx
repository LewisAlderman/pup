import {useApp, Box, Text} from 'ink';
import Spinner from 'ink-spinner';
import React, {useEffect} from 'react';
import {useSelectedChecksContext} from '../../context/selected-checks.js';
import {exec} from 'child_process';

export const StepGenerateOutput = () => {
	const {exit} = useApp();
	const {items} = useSelectedChecksContext();

	// print all check as empty markdown checkboxes
	const formattedChecks = items.map(item => `- [ ] ${item}`).join('\n');

	useEffect(() => {
		const finalOutput = (ghURL?: string) =>
			exec(`echo '${formattedChecks}' | pbcopy`, (error, _stdout, stderr) => {
				if (error) {
					console.error(`error: ${error.message}`);
					return;
				}

				if (stderr) {
					console.error(`stderr: ${stderr}`);
					return;
				}

				console.log(formattedChecks);
				console.log('\n');
				console.log('✅ Copied to clipboard!');
				console.log('\n');
				console.log(`—but if that didn't work, simply copy from up there 👆`);

				if (ghURL) {
					console.log('\n');
					console.log(`—alternatively open it up as a pre-filled PR here 👇`);
					console.log(ghURL);
				}
			});

		let ghURL: string;

		exec(
			"GIT_DEFAULT_BRANCH=$(LC_ALL=C git remote show origin | sed -n '/HEAD branch/s/.*: //p') && git diff --quiet $GIT_DEFAULT_BRANCH; echo $?",
			(diffErr, diffStdOut, _diffStdErr) => {
				if (!diffErr && diffStdOut?.length) {
					exec(
						`gh_url=$(git config --get remote.origin.url | sed 's/.git$//');gh_url+=/compare/;gh_url+=$(git branch --show-current);gh_url+='?expand=1&body=${encodeURIComponent(
							formattedChecks,
						)}'` + ';echo ${gh_url}',
						(error, stdout, stderr) => {
							if (error) {
								console.error(`error: ${error.message}`);
								return;
							}

							if (stderr) {
								console.error(`stderr: ${stderr}`);
								return;
							}

							if (stdout?.length && stdout.includes('https://github.com')) {
								ghURL = stdout;
							}

							finalOutput(ghURL);
						},
					);
				} else {
					finalOutput();
				}
			},
		);

		exit();
	}, []);

	return (
		<>
			<Box>
				<Spinner type="dots" />
				<Text> 🔧🐒</Text>
			</Box>
			<Text>&nbsp;</Text>
		</>
	);
};
