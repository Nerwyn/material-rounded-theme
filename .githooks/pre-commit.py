import os
import copy
import ruamel.yaml
from jinja2 import Template
from io import StringIO

yaml = ruamel.yaml.YAML(typ='safe')
yaml.width = 4096
yaml.default_flow_style = False

with open('./themes/material_rounded.yaml', 'w') as dist:
	output = {}

	# Load common card-mod resources
	context = {
		'user_colors': {
			'jinja': '{{ user_colors }}'
		}
	}
	resources = os.listdir('./src/common/')
	for resource in resources:
		with open(f'./src/common/{resource}', 'r') as f:
			name, file_type = resource.split('.')
			if name not in context:
				context[name] = {}
			if file_type == 'yaml':
				with open(f'./src/common/{name}.yaml', 'r') as y:
					context[name][file_type] = yaml.load(y)
			else:
				context[name][file_type] = f.read()
	
	# Build Material You switches
	context['row']['yaml']['ha-entity-toggle$']['ha-switch$'] = Template(context['row']
		['yaml']['ha-entity-toggle$']['ha-switch$']).render(context)
	context['card']['yaml']['hui-entities-toggle$']['.'] = Template(context['card']
		['yaml']['hui-entities-toggle$']['.']).render(context)
	context['card']['yaml']['hui-entities-toggle$']['ha-switch$'] = Template(context['card']
		['yaml']['hui-entities-toggle$']['ha-switch$']).render(context)
	
	# Build common root templates
	for common_template in [
		'ha-tabs$',
		'paper-tabs$',
		'paper-tab$',
		'hui-masonry-view$',
		'hui-sidebar-view$',
		'hui-panel-view$',
		'masonry-layout$',
		'horizontal-layout$',
		'vertical-layout$',
		'grid-layout$'
	]:
		context['root']['yaml'][common_template] = Template(
			context['root']['yaml'][common_template]).render(context)
	
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
			user_colors = {
				**context,
				'user_colors': {
					'jinja': f.read()
				},
			}
		
		for element in ['row', 'card', 'root']:
			# Render templates with Material You color information
			element_yaml = {
				**{ key: context[element]['yaml'][key] for key in context[element]['yaml'] },
				'.': Template(context[element]['yaml']['.']).render(user_colors)
			}

			# Save template to buffer and then read to get yaml as string
			buffer = StringIO()
			yaml.dump(element_yaml, buffer)
			output['Material Rounded'][f'card-mod-{element}-yaml'] = buffer.getvalue()

			# Copy card mod fields to transparent card version of theme
			output['Material Rounded Transparent Card'][f'card-mod-{element}-yaml'] = output[
				'Material Rounded'][f'card-mod-{element}-yaml']

	yaml.dump(output, dist)
