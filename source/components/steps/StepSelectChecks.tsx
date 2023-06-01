import {useApp, useInput, Newline, Text} from 'ink';
import React, {Fragment} from 'react';
import {usePRTypesContext} from '../../context/pr-types.js';
import {useSelectedChecksContext} from '../../context/selected-checks.js';
import {useStepContext} from '../../context/step.js';
import {useList} from '../../hooks/useList.js';
import {useSelect} from '../../hooks/useSelect.js';
import {ListItemMarker} from '../ListItemMarker.js';
import {useConfigContext} from '../../context/config.js';

export const StepSelectChecks = () => {
	const {exit} = useApp();
	const {
		state: {alwaysShownOptions},
	} = useConfigContext();
	const {nextStep: _nextStep} = useStepContext();
	const {items: selectedPRTypes} = usePRTypesContext();
	const {setItems: setSelectedChecks} = useSelectedChecksContext();

	const selectedAndApplicableChecks = selectedPRTypes
		.map(({options}) => options)
		.flat()
		.concat(alwaysShownOptions ?? []);

	let count = selectedAndApplicableChecks.length;
	let indexes = new Array(count).fill(0).map((_, i) => i);

	const {
		index: focusedIdx,
		next: nextFocusIdx,
		prev: prevFocusIdx,
	} = useList(selectedAndApplicableChecks);

	const {
		toggle: toggleSelectedCheck,
		getIsSelected: getIsSelectedCheck,
		selected,
	} = useSelect();

	const nextStep = () => {
		setSelectedChecks(
			selectedAndApplicableChecks.filter(item => getIsSelectedCheck(item)),
		);
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
			if (selectedAndApplicableChecks[focusedIdx]) {
				// @ts-ignore
				toggleSelectedCheck(selectedAndApplicableChecks[focusedIdx]);
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
				Select where applicable:
				<Text dimColor> (Press space to select)</Text>
			</Text>
			<Text>&nbsp;</Text>

			{selectedPRTypes.map((item, _index) => {
				return (
					<Fragment key={item.label}>
						<Text dimColor>({item.label})</Text>
						{item.options.map((option, __index) => {
							const index = indexes.shift();
							return (
								<Text
									key={index}
									color={focusedIdx == index ? 'greenBright' : undefined}
									wrap={focusedIdx == index ? 'wrap' : 'truncate'}
								>
									<ListItemMarker isSelected={focusedIdx == index} />{' '}
									<ListItemMarker
										isSelected={getIsSelectedCheck(option)}
										marker="*"
									/>{' '}
									{option.match(/\(.+\)$/)?.[0] ? (
										<>
											{option.substring(0, option.indexOf('('))}
											<Text dimColor>
												{option.substring(
													option.indexOf('('),
													option.indexOf(')') + 1,
												)}
											</Text>
										</>
									) : (
										option
									)}
								</Text>
							);
						})}
					</Fragment>
				);
			})}

			{alwaysShownOptions?.length && (
				<>
					<Text dimColor>(Applicable to all)</Text>

					{alwaysShownOptions.map((check, _index) => {
						const index = indexes.shift();
						return (
							<Text
								key={index}
								color={focusedIdx == index ? 'greenBright' : undefined}
								wrap={focusedIdx == index ? 'wrap' : 'truncate'}
							>
								<ListItemMarker isSelected={focusedIdx == index} />{' '}
								<ListItemMarker
									isSelected={getIsSelectedCheck(check)}
									marker="*"
								/>{' '}
								{check.match(/\(.+\)$/)?.[0] ? (
									<>
										{check.substring(0, check.indexOf('('))}
										<Text dimColor>
											{check.substring(
												check.indexOf('('),
												check.indexOf(')') + 1,
											)}
										</Text>
									</>
								) : (
									check
								)}
							</Text>
						);
					})}
				</>
			)}

			<Newline />
			<Text dimColor>Press Enter to continue</Text>
			<Text dimColor>Press Esc / q to quit</Text>
		</>
	);
};
