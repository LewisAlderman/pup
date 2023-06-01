import {Box, Text, useApp, useFocus, useFocusManager} from 'ink';
import React, {ContextType, Suspense} from 'react';
import {useState} from 'react';
import {StepContext} from './context/step.js';
import {StepGenerateOutput} from './components/steps/StepGenerateOutput.js';
import {StepSelectChecks} from './components/steps/StepSelectChecks.js';
import {StepSelectPRType} from './components/steps/StepSelectPRType.js';
import {PRTypesContext} from './context/pr-types.js';
import {SelectedChecksContext} from './context/selected-checks.js';
import {useList} from './hooks/useList.js';
import Spinner from 'ink-spinner';
import {ConfigLoader} from './components/ConfigLoader.js';
import {ConfigContext} from './context/config.js';

type Props = {
	name?: string;
};

const STEP_COUNT = new Array(999).fill(null);

export default function App({}: Props) {
	const {exit} = useApp();
	const {} = useFocusManager();
	const {} = useFocus();
	const [config, setConfig] = useState<
		ContextType<typeof ConfigContext>['state']
	>({items: [] as any});
	const {index: step, next: nextStep, prev: prevStep} = useList(STEP_COUNT, 1);
	const [PRTypes, setPRTypes] = useState<(typeof config)['items']>([] as any);
	const [selectedChecks, setSelectedChecks] = useState<
		ContextType<typeof SelectedChecksContext>['items']
	>([]);

	// console.log('**************');
	// console.log(
	// 	'!',
	// 	JSON.stringify(
	// 		ConfigSchema.parseAsync({
	// 			items: [
	// 				{
	// 					label: 'Native app',
	// 					value: 'native-app',
	// 					options: ['Requires a new release/build of the app'],
	// 				},
	// 				{
	// 					label: 'Web frontend',
	// 					value: 'web-frontend',
	// 					options: [
	// 						'Responsive design done',
	// 						'Works on mobile (check Safari)',
	// 						'Works on desktop (check Firefox & Safari)',
	// 						'Builds without errors',
	// 					],
	// 				},
	// 				{
	// 					label: 'Backend',
	// 					value: 'backend',
	// 					options: [
	// 						'Requires migrations to run',
	// 						'ERD still correct',
	// 						'Seeders updated and working',
	// 					],
	// 				},
	// 				{
	// 					label: 'Project management',
	// 					value: 'pm',
	// 					options: [''],
	// 				},
	// 			],
	// 			alwaysShownOptions: [
	// 				'Requires new environment variables',
	// 				'Updates the README (if possible, think: onboarding new devs)',
	// 				'Project/Tasks board is up to date (Monday, etc.)',
	// 			],
	// 		}),
	// 		null,
	// 		2,
	// 	),
	// );
	// console.log('**************');

	return (
		<Suspense fallback={<AppLoader />}>
			<ConfigContext.Provider value={{state: config, setState: setConfig}}>
				<StepContext.Provider value={{step, nextStep, prevStep}}>
					<PRTypesContext.Provider
						value={{items: PRTypes, setItems: setPRTypes}}
					>
						<SelectedChecksContext.Provider
							value={{items: selectedChecks, setItems: setSelectedChecks}}
						>
							{!!config.items.length ? (
								// @ts-ignore
								(() => {
									switch (step) {
										case 1:
											return <StepSelectPRType items={config.items} />;
										case 2:
											return <StepSelectChecks />;
										case 3:
											return <StepGenerateOutput />;
										default:
											<>{exit()}</>;
									}
								})()
							) : (
								<ConfigLoader />
							)}
						</SelectedChecksContext.Provider>
					</PRTypesContext.Provider>
				</StepContext.Provider>
			</ConfigContext.Provider>
		</Suspense>
	);
}

const AppLoader = () => (
	<Box>
		<Spinner type="dots" />
		<Text> 🐒</Text>
	</Box>
);
