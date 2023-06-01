import {createContext, useContext} from 'react';
import z from 'zod';
import {ConfigSchema} from '../components/ConfigLoader.js';

type TConfig = z.infer<typeof ConfigSchema>;

export const ConfigContext = createContext<{
	state: TConfig;
	setState: (x: TConfig) => void;
}>({
	state: {items: [] as any},
	setState: () => {},
});

export const useConfigContext = () => useContext(ConfigContext);
