export const PR_TYPE_ITEMS: {label: string; value: string; checks: string[]}[] =
	[
		{
			label: 'Native app',
			value: 'native-app',
			checks: ['Requires a new release/build of the app'],
		},
		{
			label: 'Web frontend',
			value: 'web-frontend',
			checks: [
				'Responsive design done',
				'Works on mobile (check Safari)',
				'Works on desktop (check Firefox & Safari)',
				'Builds without errors',
			],
		},
		{
			label: 'Backend',
			value: 'backend',
			checks: [
				'Requires migrations to run',
				'ERD still correct',
				'Seeders updated and working',
			],
		},
	];

export const APPLICABLE_TO_ALL_PR_TYPES = [
	'Requires new environment variables',
	'Updates the README (if possible, think: onboarding new devs)',
];
