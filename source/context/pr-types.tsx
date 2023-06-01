import {createContext, useContext} from 'react';
import {PR_TYPE_ITEMS} from '../data.js';

export const PRTypesContext = createContext<{
	items: typeof PR_TYPE_ITEMS;
	setItems: (items: typeof PR_TYPE_ITEMS) => void;
}>({items: [], setItems: () => {}});

export const usePRTypesContext = () => useContext(PRTypesContext);
