import {useState} from 'react';

export function useSelect<T extends string>(opts?: {
	initial: T[];
}): {
	selected: T[];
	toggle: (item: T) => void;
	getIsSelected: (item: T) => boolean;
};
export function useSelect<T extends {value: string}>(opts?: {
	initial: T[];
}): {
	selected: T[];
	toggle: (item: T) => void;
	getIsSelected: (item: T) => boolean;
} {
	const [selected, setSelected] = useState<T[]>(opts?.initial || []);

	const getIsSelected = (item: T) => {
		return typeof item === 'string'
			? selected.includes(item)
			: selected.some(s => s.value === item.value);
	};

	const toggle = (item: T) => {
		if (typeof item === 'string') {
			if (getIsSelected(item)) {
				setSelected(prev => prev.filter(s => s !== item));
			} else {
				setSelected(prev => [...prev, item]);
			}
		} else {
			if (getIsSelected(item)) {
				setSelected(prev => prev.filter(s => s.value !== item.value));
			} else {
				setSelected(prev => [...prev, item]);
			}
		}
	};

	return {selected, toggle, getIsSelected};
}
