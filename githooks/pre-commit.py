import os
from copy import deepcopy
import ruamel.yaml
import rcssmin
from jinja2 import Template
from io import StringIO

def main():
	yaml = ruamel.yaml.YAML(typ='safe')
	yaml.width = 4096
	yaml.default_flow_style = False

	theme_name = 'Material You'
	with open('./themes/material_you.yaml', 'w') as dist:
		output = {}

		# Load common card-mod resources
		theme_context = {}
		resources = os.listdir('./src/resources/')
		for resource in resources:
			with open(f'./src/resources/{resource}', 'r') as f:
				name, file_type = resource.split('.')
				if name not in theme_context:
					theme_context[name] = {}
				r_str = ''
				match file_type:
					case 'yaml':
						r_str = yaml.load(f)
					case 'css':
						r_str = rcssmin.cssmin(f.read())
					case 'jinja':
						r_str = rcssmin.cssmin(Template(f.read()).render())
					case _:
						r_str= f.read()
				theme_context[name][file_type] = r_str
		
		# Build element yaml subelements
		for element in theme_context:
			if 'yaml' in theme_context[element]:
				theme_context[element]['yaml'] = recursiveRender(theme_context[element]['yaml'], theme_context)

		theme_file_name = theme_name.lower().replace(' ', '_')
		with open(f'./src/{theme_file_name}.yaml', 'r') as src:
			# Create base theme
			theme_title = theme_name
			base_theme = yaml.load(src)[theme_title]
			output[theme_title] = deepcopy(base_theme)

			# Create a transparent card background version of theme
			theme_title = f'{theme_name} Transparent Card'
			output[theme_title] = deepcopy(base_theme)
			output[theme_title]['ha-card-background'] = 'transparent'

			# Create a no mod versions of theme with fixed status and navbar colors
			theme_title = f'{theme_name} No Mod'
			output[theme_title] = deepcopy(output[theme_name])
			output[theme_title]['app-header-background-color'] = 'var(--navbar-background)'
			output[theme_title]['primary-background-color'] = 'var(--lovelace-background)'
			
			theme_title = f'{theme_name} Transparent Card No Mod'
			output[theme_title] = deepcopy(output[f'{theme_name} Transparent Card'])
			output[theme_title]['app-header-background-color'] = 'var(--navbar-background)'
			output[theme_title]['primary-background-color'] = 'var(--lovelace-background)'

			# Add card mod fields to main versions of theme
			output[theme_name]['card-mod-theme'] = theme_name
			output[f'{theme_name} Transparent Card']['card-mod-theme'] = theme_name
				
		# Build card-mod theme
		for element in theme_context:
			if 'yaml' in theme_context[element]:
				element_yaml = {
					**{ key: theme_context[element]['yaml'][key] for key in theme_context[element]['yaml'] },
				}
				if '.' in theme_context[element]['yaml']:
					element_yaml['.'] = Template(theme_context[element]['yaml']['.']).render(theme_context).strip()

				# Save template to buffer and then read to get yaml as string
				buffer = StringIO()
				yaml.dump(element_yaml, buffer)
				output[theme_name][f'card-mod-{element.replace("_", "-")}-yaml'] = buffer.getvalue().strip()

		yaml.dump(output, dist)

	# Create separate light and dark mode versions for special use cases
	with open(f'./themes/material_you.yaml', 'r+') as f:
		themes = yaml.load(f)
		new_themes = {}
		for sub_theme_name in themes.keys():
			light = deepcopy(themes[sub_theme_name])
			dark = deepcopy(themes[sub_theme_name])
			del light['modes']
			del dark['modes']
			card_mod_keys = [
				key for key in light.keys()
				if key.startswith('card-mod-')
				and key != 'card-mod-theme'
			]
			for key in card_mod_keys:
				del light[key]
				del dark[key]

			modes = themes[sub_theme_name]['modes']
			for attribute in modes['light']:
				light[attribute] = modes['light'][attribute]
			for attribute in modes['dark']:
				dark[attribute] = modes['dark'][attribute]

			new_themes[sub_theme_name + ' Light'] = light
			new_themes[sub_theme_name + ' Dark'] = dark
		themes = { **themes, **new_themes}
		f.seek(0)
		yaml.dump(themes, f)
		f.truncate()


def recursiveRender(element, context):
	for subelement in element:
		if isinstance(element[subelement], str) and subelement != '.':
			element[subelement] = Template(element[subelement]).render(context)
		elif isinstance(element[subelement], dict):
			element[subelement] = recursiveRender(element[subelement], context)
	return element

if __name__ == '__main__':
	main()