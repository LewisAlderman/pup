import {Box, Text, useApp, useFocus, useFocusManager} from 'ink';
import React, {ContextType, Suspense, useEffect} from 'react';
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
import {Confirm} from './components/Confirm.js';
import {exec} from 'child_process';

type Props = {
	confirm?: boolean;
	c?: boolean;
	print?: boolean;
};

const STEP_COUNT = new Array(999).fill(null);

export default function App({confirm, c, print}: Props) {
	const {exit} = useApp();
	const {} = useFocusManager();
	const {} = useFocus();
	const [showConfirm, setShowConfirm] = useState(confirm || c);
	const [config, setConfig] = useState<
		ContextType<typeof ConfigContext>['state']
	>({items: [] as any});
	const {index: step, next: nextStep, prev: prevStep} = useList(STEP_COUNT, 1);
	const [PRTypes, setPRTypes] = useState<(typeof config)['items']>([] as any);
	const [selectedChecks, setSelectedChecks] = useState<
		ContextType<typeof SelectedChecksContext>['items']
	>([]);

	useEffect(() => {
		if (print) exit();
	}, [print]);

	if (print) {
		exec('node dist/scripts/schema-to-stdout', (_err, stdout) => {
			console.log(stdout);
		});

		return null;
	}

	if ((confirm || c) && showConfirm) {
		return <Confirm onConfirm={() => setShowConfirm(false)} />;
	}

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
		<Text> 🐶</Text>
	</Box>
);
