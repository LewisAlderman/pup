import {useState} from 'react';

export const useList = (items: unknown[], initialIndex = 0) => {
	const [index, set] = useState(initialIndex);

	const next = () => {
		set(prev => (prev + 1) % items.length);
	};

	const prev = () => {
		set(prev => (prev - 1 + items.length) % items.length);
	};

	return {index, next, prev};
};
