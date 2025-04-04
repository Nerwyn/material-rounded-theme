import haSwitchStyles from './resources/ha-switch.css';

const elements: Record<string, string> = {
	'ha-switch': haSwitchStyles.toString(),
};

for (const [element, styles] of Object.entries(elements)) {
	customElements.whenDefined(element).then((Constructor) => {
		const originalFirstUpdated = Constructor.prototype.firstUpdated;

		Constructor.prototype.firstUpdated = function () {
			originalFirstUpdated?.call(this);

			const style = document.createElement('style');
			style.textContent = styles;

			this.shadowRoot.appendChild(style);
		};
	});
}

