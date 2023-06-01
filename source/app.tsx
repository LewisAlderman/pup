import {Text, useApp, useFocus, useFocusManager} from 'ink';
import React, {ContextType, Suspense} from 'react';
import {useState} from 'react';
import {StepContext} from './context/step.js';
import {StepGenerateOutput} from './components/steps/StepGenerateOutput.js';
import {StepSelectChecks} from './components/steps/StepSelectChecks.js';
import {StepSelectPRType} from './components/steps/StepSelectPRType.js';
import {PRTypesContext} from './context/pr-types.js';
import {SelectedChecksContext} from './context/selected-checks.js';
import {PR_TYPE_ITEMS} from './data.js';
import {useList} from './hooks/useList.js';

type Props = {
	name?: string;
};

const STEP_COUNT = new Array(999).fill(null);

export default function App({}: Props) {
	const {exit} = useApp();
	const {} = useFocusManager();
	const {} = useFocus();
	const {index: step, next: nextStep, prev: prevStep} = useList(STEP_COUNT, 1);
	const [PRTypes, setPRTypes] = useState<typeof PR_TYPE_ITEMS>([]);
	const [selectedChecks, setSelectedChecks] = useState<
		ContextType<typeof SelectedChecksContext>['items']
	>([]);

	return (
		<Suspense fallback={<Text>Loading...</Text>}>
			<StepContext.Provider value={{step, nextStep, prevStep}}>
				<PRTypesContext.Provider value={{items: PRTypes, setItems: setPRTypes}}>
					<SelectedChecksContext.Provider
						value={{items: selectedChecks, setItems: setSelectedChecks}}
					>
						{/* @ts-ignore */}
						{(() => {
							switch (step) {
								case 1:
									return <StepSelectPRType />;

								case 2:
									return <StepSelectChecks />;

								case 3:
									return <StepGenerateOutput />;

								default:
									<>{exit()}</>;
							}
						})()}
					</SelectedChecksContext.Provider>
				</PRTypesContext.Provider>
			</StepContext.Provider>
		</Suspense>
	);
}
