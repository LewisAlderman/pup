import {Newline, useApp, useInput, Text} from 'ink';
import React from 'react';
import {usePRTypesContext} from '../../context/pr-types.js';
import {useStepContext} from '../../context/step.js';
import {useList} from '../../hooks/useList.js';
import {useSelect} from '../../hooks/useSelect.js';
import {ListItemMarker} from '../ListItemMarker.js';
import {ConfigItems} from '../../schema.js';

export const StepSelectPRType = ({items}: {items: ConfigItems}) => {
	const {exit} = useApp();
	const {nextStep: _nextStep} = useStepContext();
	const {setItems} = usePRTypesContext();

	const {
		index: focusedIdx,
		next: nextFocusIdx,
		prev: prevFocusIdx,
	} = useList(items);

	const {
		toggle: toggledSelectedPRType,
		getIsSelected: getIsSelectedPRType,
		selected,
	} = useSelect();

	const nextStep = () => {
		setItems(items.filter(item => getIsSelectedPRType(item.value)) as any);
		_nextStep();
	};

	useInput((input, key) => {
		if (input === 'q' || key.escape) {
			exit();
		}

		if (key.downArrow) {
			nextFocusIdx();
		}

		if (key.upArrow) {
			prevFocusIdx();
		}

		if (input === ' ') {
			if (items[focusedIdx]?.value) {
				// @ts-ignore
				toggledSelectedPRType(items[focusedIdx]?.value);
			} else {
				exit(new Error('Unknown index'));
			}
		}

		if (key.return) {
			if (selected.length === 0) return;
			nextStep();
		}
	});

	return (
		<>
			<Text>&nbsp;</Text>
			<Text>
				What type of work does this PR contain?
				<Text dimColor> (Press space to select)</Text>
			</Text>
			<Text>&nbsp;</Text>

			{items.map((item, index) => {
				return (
					<Text
						key={item.value}
						color={focusedIdx == index ? 'greenBright' : undefined}
					>
						<ListItemMarker isSelected={focusedIdx == index} />{' '}
						<ListItemMarker
							isSelected={getIsSelectedPRType(item.value)}
							marker="*"
						/>{' '}
						{item.label}
					</Text>
				);
			})}

			<Newline />
			<Text dimColor>Press Enter to continue</Text>
			<Text dimColor>Press Esc / q to quit</Text>
		</>
	);
};
