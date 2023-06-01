import {Newline, Text, useApp, useFocus, useFocusManager, useInput} from 'ink';
import React, {
	ContextType,
	Fragment,
	createContext,
	useContext,
	useEffect,
} from 'react';
import {useState} from 'react';
import {exec} from 'child_process';

type Props = {
	name?: string;
};

const PR_TYPE_ITEMS: {label: string; value: string; checks: string[]}[] = [
	{
		label: 'Native app',
		value: 'native-app',
		checks: ['Requires a new release/build of the app'],
	},
	{
		label: 'Web frontend',
		value: 'web-frontend',
		checks: [
			'Responsive design done',
			'Works on mobile (check Safari)',
			'Works on desktop (check Firefox & Safari)',
			'Builds without errors',
		],
	},
	{
		label: 'Backend',
		value: 'backend',
		checks: [
			'Requires migrations to run',
			'ERD still correct',
			'Seeders updated and working',
		],
	},
];

const APPLICABLE_TO_ALL_PR_TYPES = [
	'Requires new environment variables',
	'Updates the README (if possible, think: onboarding new devs)',
];

const StepContext = createContext<{
	step: number;
	nextStep: () => void;
	prevStep: () => void;
}>({
	step: 1,
	nextStep: () => {},
	prevStep: () => {},
});
const useStepContext = () => useContext(StepContext);

const PRTypesContext = createContext<{
	items: typeof PR_TYPE_ITEMS;
	setItems: (items: typeof PR_TYPE_ITEMS) => void;
}>({items: [], setItems: () => {}});
const usePRTypesContext = () => useContext(PRTypesContext);

const SelectedChecksContext = createContext<{
	items: string[];
	setItems: (items: string[]) => void;
}>({
	items: [],
	setItems: () => {},
});
const useSelectedChecksContext = () => useContext(SelectedChecksContext);

const useList = (items: unknown[], initialIndex = 0) => {
	const [index, set] = useState(initialIndex);

	const next = () => {
		set(prev => (prev + 1) % items.length);
	};

	const prev = () => {
		set(prev => (prev - 1 + items.length) % items.length);
	};

	return {index, next, prev};
};

function useSelect<T extends string>(opts?: {
	initial: T[];
}): {
	selected: T[];
	toggle: (item: T) => void;
	getIsSelected: (item: T) => boolean;
};
function useSelect<T extends {value: string}>(opts?: {
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

const StepSelectPRType = () => {
	const {exit} = useApp();
	const {nextStep: _nextStep} = useStepContext();
	const {setItems} = usePRTypesContext();

	const {
		index: focusedIdx,
		next: nextFocusIdx,
		prev: prevFocusIdx,
	} = useList(PR_TYPE_ITEMS);

	const {
		toggle: toggledSelectedPRType,
		getIsSelected: getIsSelectedPRType,
		selected,
	} = useSelect();

	const nextStep = () => {
		setItems(PR_TYPE_ITEMS.filter(item => getIsSelectedPRType(item.value)));
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
			if (PR_TYPE_ITEMS[focusedIdx]?.value) {
				// @ts-ignore
				toggledSelectedPRType(PR_TYPE_ITEMS[focusedIdx]?.value);
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

			{PR_TYPE_ITEMS.map((item, index) => {
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

const StepSelectChecks = () => {
	const {exit} = useApp();
	const {nextStep: _nextStep} = useStepContext();
	const {items: selectedPRTypes} = usePRTypesContext();
	const {setItems: setSelectedChecks} = useSelectedChecksContext();

	const selectedAndApplicableChecks = selectedPRTypes
		.map(({checks}) => checks)
		.flat()
		.concat(APPLICABLE_TO_ALL_PR_TYPES);

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
						{item.checks.map((check, __index) => {
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
					</Fragment>
				);
			})}

			<Text dimColor>(Applicable to all)</Text>

			{APPLICABLE_TO_ALL_PR_TYPES.map((check, _index) => {
				const index = indexes.shift();
				return (
					<Text
						key={index}
						color={focusedIdx == index ? 'greenBright' : undefined}
						wrap={focusedIdx == index ? 'wrap' : 'truncate'}
					>
						<ListItemMarker isSelected={focusedIdx == index} />{' '}
						<ListItemMarker isSelected={getIsSelectedCheck(check)} marker="*" />{' '}
						{check.match(/\(.+\)$/)?.[0] ? (
							<>
								{check.substring(0, check.indexOf('('))}
								<Text dimColor>
									{check.substring(check.indexOf('('), check.indexOf(')') + 1)}
								</Text>
							</>
						) : (
							check
						)}
					</Text>
				);
			})}

			<Newline />
			<Text dimColor>Press Enter to continue</Text>
			<Text dimColor>Press Esc / q to quit</Text>
		</>
	);
};

const StepGenerateOutput = () => {
	const {exit} = useApp();
	const {items} = useSelectedChecksContext();

	// print all check as empty markdown checkboxes
	const formattedChecks = items.map(item => `- [ ] ${item}`).join('\n');

	useEffect(() => {
		let ghURL: string;

		exec(
			"gh_url=$(git config --get remote.origin.url | sed 's/.git$//');gh_url+=/compare/;gh_url+=$(git branch --show-current);gh_url+='?expand=1&body=LMAO';echo ${gh_url}",
			(error, stdout, stderr) => {
				if (error) {
					console.error(`error: ${error.message}`);
					return;
				}

				if (stderr) {
					console.error(`stderr: ${stderr}`);
					return;
				}

				if (stdout?.includes('https://github.com')) {
					ghURL = stdout;
				}

				exec(
					`echo '${formattedChecks}' | pbcopy`,
					(_error, _stdout, _stderr) => {
						if (_error) {
							console.error(`error: ${_error.message}`);
							return;
						}

						if (stderr) {
							console.error(`stderr: ${_stderr}`);
							return;
						}

						console.log(formattedChecks);
						console.log('\n');
						console.log('✅ Copied to clipboard!');
						console.log('\n');
						console.log(
							`—but if that didn't work, simply copy from up there 👆`,
						);

						if (ghURL) {
							console.log('\n');
							console.log(
								`—alternatively open it up as a pre-filled PR here 👇`,
							);
							console.log(ghURL);
						}
					},
				);
			},
		);

		exit();
	}, []);

	return <></>;
};

const STEP_COUNT = new Array(999).fill(null);

export default function App({}: Props) {
	const {exit} = useApp();
	const {} = useFocusManager();
	const {} = useFocus();
	const {index: step, next: nextStep, prev: prevStep} = useList(STEP_COUNT, 1);
	const [PRTypes, setPRTypes] = useState<typeof PR_TYPE_ITEMS>([]);
	const [selectedChecks, setSelectedChecks] = useState<
		ContextType<typeof SelectedChecksContext>['items']
	>([]);

	return (
		<StepContext.Provider value={{step, nextStep, prevStep}}>
			<PRTypesContext.Provider value={{items: PRTypes, setItems: setPRTypes}}>
				<SelectedChecksContext.Provider
					value={{items: selectedChecks, setItems: setSelectedChecks}}
				>
					{/* @ts-ignore */}
					{(() => {
						switch (step) {
							case 1:
								return <StepSelectPRType />;

							case 2:
								return <StepSelectChecks />;

							case 3:
								return <StepGenerateOutput />;

							default:
								<>{exit()}</>;
						}
					})()}
				</SelectedChecksContext.Provider>
			</PRTypesContext.Provider>
		</StepContext.Provider>
	);
}

const ListItemMarker = ({
	isSelected,
	marker = '>',
}: {
	isSelected?: boolean;
	marker?: string;
}) => <>{isSelected ? marker : ' '}</>;
