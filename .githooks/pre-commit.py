import copy
import ruamel.yaml

theme_file_path = './themes/material_rounded.yaml'

ruamel.yaml.representer.RoundTripRepresenter.ignore_aliases = lambda x, y: True
yaml = ruamel.yaml.YAML()
yaml.indent(mapping=4, sequence=4, offset=4)

with open(theme_file_path, 'r') as f:
	# Copy base theme and remove redundant card-mod fields
	theme_file = yaml.load(f)
	original_theme = copy.deepcopy(theme_file['Material Rounded'])
	del original_theme['card-mod-root-yaml']
	del original_theme['card-mod-more-info-yaml']

	# Create a no mod version of theme with no card-mod
	theme_title = 'Material Rounded No Mod'
	theme_file.pop(theme_title, None)
	theme_file[theme_title] = copy.deepcopy(original_theme)
	del theme_file[theme_title]['card-mod-theme']
	theme_file[theme_title]['app-header-background-color'] = 'var(--navbar-background)'
	theme_file[theme_title]['primary-background-color'] = 'var(--lovelace-background)'


	# Create a transparent card background version of theme
	theme_title = 'Material Rounded Transparent Card'
	transparent = 'var(--lovelace-background)'
	theme_file.pop(theme_title, None)
	theme_file[theme_title] = copy.deepcopy(original_theme)
	theme_file[theme_title]['dark']['card-background-color'] = transparent
	theme_file[theme_title]['light']['card-background-color'] = transparent
	theme_file[theme_title]['ha-card-background'] = transparent
	theme_file[theme_title]['ha-card-border-color'] = transparent
	
	# Create a transparent card background version of theme with no card-mod
	theme_title = 'Material Rounded Transparent Card No Mod'
	theme_file.pop(theme_title, None)
	theme_file[theme_title] = copy.deepcopy(original_theme)
	del theme_file[theme_title]['card-mod-theme']
	theme_file[theme_title]['app-header-background-color'] = 'var(--navbar-background)'
	theme_file[theme_title]['primary-background-color'] = 'var(--lovelace-background)'
	theme_file[theme_title]['dark']['card-background-color'] = transparent
	theme_file[theme_title]['light']['card-background-color'] = transparent
	theme_file[theme_title]['ha-card-background'] = transparent
	theme_file[theme_title]['ha-card-border-color'] = transparent


with open(theme_file_path, 'w') as f:
	yaml.dump(theme_file, f)