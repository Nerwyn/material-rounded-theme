import copy
import ruamel.yaml

yaml = ruamel.yaml.YAML(typ='safe')

with open('./themes/material_rounded.yaml', 'w') as dist:
	output = {}

	# Material Rounded themes
	with open('./src/Material Rounded/material_rounded.yaml', 'r') as src:
		# Create Material Rounded theme
		theme_title = 'Material Rounded'
		base_theme = yaml.load(src)[theme_title]
		
		output[theme_title] = copy.deepcopy(base_theme)

		# Create a transparent card background version of theme
		theme_title = 'Material Rounded Transparent Card'
		transparent = 'var(--lovelace-background)'
		output[theme_title] = copy.deepcopy(base_theme)
		output[theme_title]['modes']['dark']['card-background-color'] = transparent
		output[theme_title]['modes']['light']['card-background-color'] = transparent
		output[theme_title]['ha-card-background'] = transparent
		output[theme_title]['ha-card-border-color'] = transparent

		# Create a no mod versions of theme with fixed status and navbar colors
		theme_title = 'Material Rounded No Mod'
		output[theme_title] = copy.deepcopy(output['Material Rounded'])
		output[theme_title]['app-header-background-color'] = 'var(--navbar-background)'
		output[theme_title]['primary-background-color'] = 'var(--lovelace-background)'
		
		theme_title = 'Material Rounded Transparent Card No Mod'
		output[theme_title] = copy.deepcopy(output['Material Rounded Transparent Card'])
		output[theme_title]['app-header-background-color'] = 'var(--navbar-background)'
		output[theme_title]['primary-background-color'] = 'var(--lovelace-background)'

		# Add card mod fields to main versions of theme
		output['Material Rounded']['card-mod-theme'] = 'Material Rounded'
		output['Material Rounded Transparent Card']['card-mod-theme'] = 'Material Rounded'
		for element in ['root', 'card', 'row']:
			with open(f'./src/Material Rounded/{element}.yaml', 'r') as css:
				output['Material Rounded'][f'card-mod-{element}-yaml'] = css.read()
				output['Material Rounded Transparent Card'][f'card-mod-{element}-yaml'] = output['Material Rounded'][f'card-mod-{element}-yaml']

	yaml.dump(output, dist)
