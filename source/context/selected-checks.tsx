import {createContext, useContext} from 'react';

export const SelectedChecksContext = createContext<{
	items: string[];
	setItems: (items: string[]) => void;
}>({
	items: [],
	setItems: () => {},
});

export const useSelectedChecksContext = () => useContext(SelectedChecksContext);
