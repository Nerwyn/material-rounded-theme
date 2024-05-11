import os
import copy
import ruamel.yaml
from jinja2 import Template
from io import StringIO

def main():
	yaml = ruamel.yaml.YAML(typ='safe')
	yaml.width = 4096
	yaml.default_flow_style = False

	with open('./themes/dist.yaml', 'w') as dist:
		output = {}

		# Load common card-mod resources
		common_context = {
			'user_colors': {
				'jinja': '{{ user_colors }}'
			}
		}
		resources = os.listdir('./src/common/')
		for resource in resources:
			with open(f'./src/common/{resource}', 'r') as f:
				name, file_type = resource.split('.')
				if name not in common_context:
					common_context[name] = {}
				if file_type == 'yaml':
					with open(f'./src/common/{name}.yaml', 'r') as y:
						common_context[name][file_type] = yaml.load(y)
				else:
					common_context[name][file_type] = f.read()
		
		# Build element yaml subelements
		for element in common_context:
			if 'yaml' in common_context[element]:
				common_context[element]['yaml'] = recursiveRender(common_context[element]['yaml'], common_context)

		with open('./src/material_rounded/material_rounded.yaml', 'r') as src:
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

			# Load Material Rounded user colors code
			with open('./src/material_rounded/user_colors.jinja') as f:
				theme_context = {
					**common_context,
					'user_colors': {
						'jinja': f.read()
					},
				}
			
			for element in theme_context:
				if 'yaml' in theme_context[element]:
					element_yaml = {
						**{ key: common_context[element]['yaml'][key] for key in common_context[element]['yaml'] },
						'.': Template(common_context[element]['yaml']['.']).render(theme_context).strip()
					}

					# Save template to buffer and then read to get yaml as string
					buffer = StringIO()
					yaml.dump(element_yaml, buffer)
					element = element.replace('_', '-')
					output['Material Rounded'][f'card-mod-{element}-yaml'] = buffer.getvalue().strip()

					# Copy card mod fields to transparent card version of theme
					output['Material Rounded Transparent Card'][f'card-mod-{element}-yaml'] = output[
						'Material Rounded'][f'card-mod-{element}-yaml']

		yaml.dump(output, dist)


def recursiveRender(element, context):
	for subelement in element:
		if isinstance(element[subelement], str) and subelement != '.':
			element[subelement] = Template(element[subelement]).render(context)
		elif isinstance(element[subelement], dict):
			element[subelement] = recursiveRender(element[subelement], context)
	return element

if __name__ == '__main__':
	main()