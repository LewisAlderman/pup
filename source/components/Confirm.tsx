import {useFocus, useApp, useInput, Box, Text} from 'ink';
import React, {useState} from 'react';

export const Confirm = ({onConfirm}: {onConfirm: () => void}) => {
	const [highlightedIdx, set] = useState(0);
	const {} = useFocus();
	const {exit} = useApp();

	useInput((input, key) => {
		if (input === 'y' || (highlightedIdx === 1 && key.return)) {
			onConfirm();
		} else if (
			input === 'n' ||
			key.escape ||
			(highlightedIdx === 0 && key.return)
		) {
			exit();
		} else if (key.rightArrow) {
			if (highlightedIdx === 0) {
				set(1);
			} else {
				set(0);
			}
		} else if (key.leftArrow) {
			if (highlightedIdx === 0) {
				set(1);
			} else {
				set(0);
			}
		}
	});

	return (
		<>
			<Box gap={0.5}>
				<Text>Would you like to generate a PR template?</Text>
				<Box>
					<Text
						underline={highlightedIdx === 0}
						bold={highlightedIdx === 0}
						color={highlightedIdx === 0 ? 'red' : undefined}
					>
						n
					</Text>
					<Text> / </Text>
					<Text
						underline={highlightedIdx === 1}
						bold={highlightedIdx === 1}
						color={highlightedIdx === 1 ? 'green' : undefined}
					>
						y
					</Text>
				</Box>
			</Box>

			<Text dimColor> — or press n / y</Text>
		</>
	);
};
