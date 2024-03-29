import {createContext, useContext} from 'react';
import {ConfigItems} from '../schema.js';

export const PRTypesContext = createContext<{
	items: ConfigItems;
	setItems: (items: ConfigItems) => void;
}>({items: [] as any, setItems: () => {}});

export const usePRTypesContext = () => useContext(PRTypesContext);
