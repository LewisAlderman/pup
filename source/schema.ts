import z from 'zod';

export const ConfigSchema = z.object({
	items: z
		.array(
			z.object({
				label: z.string(),
				value: z.string(),
				options: z
					.array(z.string().trim().min(1))
					.nonempty({message: 'Items have at least one option'}),
			}),
		)
		.nonempty({message: 'Config have at least one item'}),
	alwaysShownOptions: z.array(z.string().trim().min(1)).min(1).optional(),
});

export type Config = z.infer<typeof ConfigSchema>;
export type ConfigItems = Config['items'];
export type ConfigItem = ConfigItems[number];
