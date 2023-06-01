import {createContext, useContext} from 'react';

export const StepContext = createContext<{
	step: number;
	nextStep: () => void;
	prevStep: () => void;
}>({
	step: 1,
	nextStep: () => {},
	prevStep: () => {},
});
export const useStepContext = () => useContext(StepContext);
