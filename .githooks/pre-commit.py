import copy
import ruamel.yaml

theme_file_path = './themes/material_rounded.yaml'

# ruamel.yaml.representer.RoundTripRepresenter.ignore_aliases = lambda x, y: True
yaml = ruamel.yaml.YAML()
yaml.indent(mapping=4, sequence=4, offset=4)

with open(theme_file_path, 'r') as f:
	theme_file = yaml.load(f)

	# Create a no mod copy of theme which doesn't have card-mod keys
	theme_title = 'Material Rounded No Mod'
	del theme_file[theme_title]
	# theme_file[theme_title] = copy.deepcopy(theme_file['Material Rounded'])
	# del theme_file[theme_title]['card-mod-theme']
	# del theme_file[theme_title]['card-mod-root-yaml']
	theme_file[theme_title] = theme_file['Material Rounded']


with open(theme_file_path, 'w') as f:
	yaml.dump(theme_file, f)