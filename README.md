[![GitHub Release][releases-shield]][releases]
[![License][license-shield]](LICENSE.md)
[![hacs_badge](https://img.shields.io/badge/HACS-Custom-orange.svg?style=for-the-badge)](https://github.com/custom-components/hacs)
![Project Maintenance][maintenance-shield]
[![GitHub Activity][last-commit-shield]][commits]
[![Community Forum][forum-shield]][forum]

<a href="https://www.buymeacoffee.com/nerwyn" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-blue.png" alt="Buy Me A Coffee" style="height: 60px !important;width: 217px !important;" ></a>

[![My Home Assistant](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?repository=material-rounded-theme&owner=Nerwyn&category=Plugin)

# Material Rounded Theme

Material Rounded theme for Home Assistant influenced by Material You on Android.

This theme aims to match the styling of the Google Home app as closely as possible, so it may change over time as the style of the Google Home app changes.

Relies on [card-mod](https://github.com/thomasloven/lovelace-card-mod) for header/footer modifications.

# Screenshots

## Tiles

<img src="https://raw.githubusercontent.com/Nerwyn/material-rounded-theme/main/assets/tiles-dark.png" alt="tiles-dark" width="600"/>

<img src="https://raw.githubusercontent.com/Nerwyn/material-rounded-theme/main/assets/tiles-light.png" alt="tiles-light" width="600"/>

## Compared to Google Home

<img src="https://raw.githubusercontent.com/Nerwyn/material-rounded-theme/main/assets/tiles-comparison-dark.png" alt="tiles-comparison-dark" width="600"/>

<img src="https://raw.githubusercontent.com/Nerwyn/material-rounded-theme/main/assets/tiles-comparison-light.png" alt="tiles-comparison-light" width="600"/>

<img src="https://raw.githubusercontent.com/Nerwyn/material-rounded-theme/main/assets/comparison-dark.png" alt="buttons-comparison-dark" width="600"/>

<img src="https://raw.githubusercontent.com/Nerwyn/material-rounded-theme/main/assets/comparison-light.png" alt="buttons-comparison-light" width="600"/>

Light entities made using [Big Slider Card](https://github.com/nicufarmache/lovelace-big-slider-card). Use the following settings to match:

```yaml
colorize: true
show_percentage: true
bold_text: true
height: 88
```

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

This theme uses [card-mod](https://github.com/thomasloven/lovelace-card-mod) to:

-   Turn the toolbar header into a footer.
-   Remove the selection bar.
-   Space the view icons evenly along the entire toolbar.
-   Add the view name below the icon.
-   Highlight the current view with a colored icon and background behind the icon.

You can disable this by commenting out or deleting everything below `### Card Mod theming ###` after installing. After installing from HACS this theme can be found in the folder `/config/themes/material_rounded/`.

This card also includes some examples of how to use special colors on a per view basis, like so:

```css
paper-tab.iron-selected > ha-icon[title='Lights'] {
	color: var(--yellow-color);
}
```

Also check out [Material Symbols](https://github.com/beecho01/material-symbols) to use updated material icons, as shown in the screenshots!

This theme was initially modified from the [Graphite theme](https://github.com/TilmanGriesel/graphite), as I found that it was my favorite of the available Home Assistant themes on HACS when I started creating this theme. Therefore, it contains similar logic for reusing variables and possibly some unusued variables.

[last-commit-shield]: https://img.shields.io/github/last-commit/Nerwyn/material-rounded-theme?style=for-the-badge
[commits]: https://github.com/Nerwyn/material-rounded-theme/commits/main
[forum-shield]: https://img.shields.io/badge/community-forum-brightgreen.svg?style=for-the-badge
[forum]: https://community.home-assistant.io/t/material-rounded-a-google-material-you-inspired-theme/623242
[license-shield]: https://img.shields.io/github/license/Nerwyn/material-rounded-theme.svg?style=for-the-badge
[maintenance-shield]: https://img.shields.io/badge/maintainer-Nerwyn-blue.svg?style=for-the-badge
[releases-shield]: https://img.shields.io/github/release/Nerwyn/material-rounded-theme.svg?style=for-the-badge
[releases]: https://github.com/nerwyn/material-rounded-theme/releases
[github]: https://img.shields.io/github/followers/Nerwyn.svg?style=social
