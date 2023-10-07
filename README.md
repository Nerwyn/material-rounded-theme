[![GitHub Release][releases-shield]][releases]
[![License][license-shield]](LICENSE.md)
[![hacs_badge](https://img.shields.io/badge/HACS-Custom-orange.svg?style=for-the-badge)](https://github.com/custom-components/hacs)
![Project Maintenance][maintenance-shield]
[![GitHub Activity][last-commit-shield]][commits]
[![Community Forum][forum-shield]][forum]

# Material Rounded Theme

Material Rounded theme for Home Assistant influenced by Material You on Android.

Relies on [card-mod](https://github.com/thomasloven/lovelace-card-mod) for header/footer modifications.

# Screenshots

## Tiles

<img src="https://raw.githubusercontent.com/Nerwyn/material-rounded-theme/main/assets/tiles-dark.png" alt="tile-dark" width="600"/>

<img src="https://raw.githubusercontent.com/Nerwyn/material-rounded-theme/main/assets/tiles-light.png" alt="tile-light" width="600"/>

## [Big Slider Card](https://github.com/nicufarmache/lovelace-big-slider-card)

<img src="https://raw.githubusercontent.com/Nerwyn/material-rounded-theme/main/assets/big-slider-card.png" alt="big-slider-card-dark" width="600"/>

Use the following settings in big-slider-card to match:

```yaml
colorize: true
show_percentage: true
bold_text: true
height: 88
```

## Compared to Google Home

<img src="https://raw.githubusercontent.com/Nerwyn/material-rounded-theme/main/assets/google-home-comparison-dark.png" alt="google-home-comparison-dark" width="600"/>

<img src="https://raw.githubusercontent.com/Nerwyn/material-rounded-theme/main/assets/google-home-comparison-light.png" alt="google-home-comparison-light" width="600"/>

# Installation

1. Navigate to HACS (install from [here](https://hacs.xyz/) if you do not have it yet).
2. Navigate to `Frontend`.
3. Click on the three dot menu and then `Custom repositories`.
4. Paste this repository (https://github.com/Nerwyn/material-rounded-theme) in the text box, set the category to `Theme`, and click `ADD`.
5. This theme should appear as a new repository on the screen. If not search for it by clicking `+ EXPLORE & DOWNLOAD REPOSITORIES`.
6. Open this repository in HACS and click `DOWNLOAD`.
7. Refresh Home Assistant.
8. Navigate to your Profile, and select `Material Rounded` under Theme along with your preference for light or dark mode.

# Card Mod Powered Footer

This theme uses [card-mod](https://github.com/thomasloven/lovelace-card-mod) to turn the header into a footer, to remove the selection bar, and to highlight the current view with a colored icon and background behind the icon.
You can disable this by commenting out or deleting everything below `### Card Mod theming ###` after installing. After installing from HACS this theme can be found in the folder `/config/themes/material_rounded/`.

When using the card-mod footer, you may find that it "breaks" if you enter edit mode or go to a subview and back. This is due to the effected elements unloading when either of these actions are done, which causes the card-mod css to unload. This can be fixed by navigating to a different dashboard and back, refreshing the page, or reloading the theme via a service call.

This card also includes some examples of how to use special colors on a per view basis, like so:

```css
paper-tab.iron-selected > ha-icon[title='Lights'] {
	color: var(--yellow-color);
}
```

This theme was initially modified from the [Graphite theme](https://github.com/TilmanGriesel/graphite), as I found that it was my favorite of the available Home Assistant themes on HACS.

[last-commit-shield]: https://img.shields.io/github/last-commit/Nerwyn/material-rounded-theme?style=for-the-badge
[commits]: https://github.com/Nerwyn/material-rounded-theme/commits/main
[forum-shield]: https://img.shields.io/badge/community-forum-brightgreen.svg?style=for-the-badge
[forum]: https://community.home-assistant.io/t/material-rounded-theme/
[license-shield]: https://img.shields.io/github/license/Nerwyn/material-rounded-theme.svg?style=for-the-badge
[maintenance-shield]: https://img.shields.io/badge/maintainer-Nerwyn-blue.svg?style=for-the-badge
[releases-shield]: https://img.shields.io/github/release/Nerwyn/material-rounded-theme.svg?style=for-the-badge
[releases]: https://github.com/nerwyn/material-rounded-theme/releases
[github]: https://img.shields.io/github/followers/Nerwyn.svg?style=social
