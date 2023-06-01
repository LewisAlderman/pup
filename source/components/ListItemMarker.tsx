import React from 'react';

export const ListItemMarker = ({
	isSelected,
	marker = '>',
}: {
	isSelected?: boolean;
	marker?: string;
}) => <>{isSelected ? marker : ' '}</>;
