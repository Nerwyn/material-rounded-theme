[![GitHub Release][releases-shield]][releases]
[![License][license-shield]](LICENSE.md)
[![hacs_badge](https://img.shields.io/badge/HACS-Default-blue.svg?style=for-the-badge)](https://github.com/hacs/integration)
![Project Maintenance][maintenance-shield]
[![GitHub Activity][last-commit-shield]][commits]
[![Community Forum][forum-shield]][forum]

[![My Home Assistant](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?repository=material-rounded-theme&owner=Nerwyn&category=Plugin)

# Material Rounded Theme

Material Rounded theme for Home Assistant influenced by Material You on Android.

This theme aims to match the styling of the Google Home app as closely as possible, so it may change over time as the style of the Google Home app changes. It also aims to implement Material You redesigns of elements.

Relies on [card-mod](https://github.com/thomasloven/lovelace-card-mod) for toolbar modifications, other Material You component redesigns, and Material You coloring. If you have card-mod installed and do not want these changes to apply, use the "No Mod" versions of this theme.

Don't like blue? You can choose a different Material You base color! See below for more. Also requires card-mod.

This theme also includes "Transparent Card" versions with card backgrounds that match the view background.

## Screenshots

### Tiles

<img src="https://raw.githubusercontent.com/Nerwyn/material-rounded-theme/main/assets/tiles-dark.png" alt="tiles-dark" width="600"/>

<img src="https://raw.githubusercontent.com/Nerwyn/material-rounded-theme/main/assets/tiles-light.png" alt="tiles-light" width="600"/>

### Compared to Google Home

<img src="https://raw.githubusercontent.com/Nerwyn/material-rounded-theme/main/assets/tiles-comparison-dark.png" alt="tiles-comparison-dark" width="600"/>

<img src="https://raw.githubusercontent.com/Nerwyn/material-rounded-theme/main/assets/tiles-comparison-light.png" alt="tiles-comparison-light" width="600"/>

<img src="https://raw.githubusercontent.com/Nerwyn/material-rounded-theme/main/assets/comparison-dark.png" alt="buttons-comparison-dark" width="600"/>

<img src="https://raw.githubusercontent.com/Nerwyn/material-rounded-theme/main/assets/comparison-light.png" alt="buttons-comparison-light" width="600"/>

Light cards made using [Big Slider Card](https://github.com/nicufarmache/lovelace-big-slider-card).

## Installation

1. Navigate to HACS (install from [here](https://hacs.xyz/) if you do not have it yet).
2. Navigate to `Frontend`.
3. Click `+ EXPLORE & DOWNLOAD REPOSITORIES` and search for `Material Rounded Theme`.
4. Open this repository in HACS and click `DOWNLOAD`.
5. Refresh Home Assistant.
6. Navigate to your Profile, and select `Material Rounded` under Theme along with your preference for light or dark mode.

## Powered By Card Mod

This theme is super-charged by [card-mod](https://github.com/thomasloven/lovelace-card-mod)! Using card-mod many components have received Material You design upgrades.

### Navigation

Redesigns the toolbar and sidebar buttons to follow Material You navigation component guidelines.

#### [Navigation Bar](https://m3.material.io/components/navigation-bar/overview)

-   Converts the header toolbar to a footer.
-   Removes the default selection bar and ripple.
-   Spaces the view icons evenly along the entire toolbar.
-   Adds view names below the view icons.
-   Highlights the current view with a colored icon and background behind the icon.
-   Transition animation on view icon background when selected.

#### [Navigation Drawer](https://m3.material.io/components/navigation-drawer/overview)

Desktop sidebar expanded and mobile.

-   Icon and background of current view now uses primary and accent colors.
-   Transition animation on view icon background when selected.

#### [Navigation Rail](https://m3.material.io/components/navigation-rail/overview)

Desktop sidebar collapsed.

-   Background of current view now uses primary and accent colors.
-   Current view icon background is a circle to match Material You example of a navigation rail menu without labels.

### [Switches](https://m3.material.io/components/switch/overview)

-   Track now encompasses thumb.
-   Removes the default ripple in favor of a thumb that changes size when used.
-   Uses primary and accent colors for the switch thumb and track.

### Views

-  Adds a 12px margin to each side of the view to match the Google Home app.
-  Add card button updated to match the [extended FAB specification](https://m3.material.io/components/extended-fab/overview).

If you do not want these changes, use the "No Mod" versions of the theme.

## Material You Colors

This theme supports Material You color theming! Create a helper template sensor named `Material Rounded Base Color` that returns the hex code of your preferred base color. The accent and primary color will be calculated using it, retaining your color's hue and saturation but altering it's luminance. The entity ID should be `sensor.material_rounded_base_color`.

To create a template sensor helper:

1. Navigate to `Settings` > `Devices & services` > ` Helpers`.
2. Click `+ CREATE HELPER`.
3. Click `Template`.
4. Click `Template a sensor`.
5. Name the sensor `Material Rounded Base Color`. If you want this color to only apply to your profile, add your name as it appears in the [Home Assistant people page](http://homeassistant.local:8123/config/person) to the end.
6. Enter your Material You base color as a six digit hex code, like `238636` or `#db4437`. You can also use a template to read a hex code from the state or attribute of a different entity, like `{{ states("sensor.pixel_fold_accent_color") }}`.
7. Click `SUBMIT`.

You can also choose user specific colors by creating a sensor named `Material Rounded Base Color Your Name`, with your name being your person name as it appears on the [Home Assistant people page](http://homeassistant.local:8123/config/person). The sensory entity Id should be something like `sensor.material_rounded_base_color_john_doe`.

If you are using the Home Assistant Android companion app, you can enable the accent color sensor in the companion app settings to use your phone's Material You accent color as the theme base color:

1. Navigate to `Settings` > `Companion app`.
2. Click `Manage sensors.`
3. Scroll down to the section titled `Dynamic color` and click `Accent color`.
4. Toggle `Enable sensor` on. It should now return your phone's Material You base color as a hex code.

**NOTE**: Card mod does not support all Home Assistant pages. Namely the developer tools and settings pages, and view configuration, add card, and edit card configuration popups. These pages will still use the theme default colors on parts of the UI.

## Similar Projects and Credits

### Big Slider Card

Use [Big Slider Card](https://github.com/nicufarmache/lovelace-big-slider-card) to create Google Home style button/slider cards for light entities. Use the following style settings to match the screenshots:

```yaml
colorize: true
show_percentage: true
bold_text: true
height: 88
```

And for lights that do not have brightness control:

```yaml
color: sandybrown
show_percentage: false
bold_text: true
height: 88
max: 0
```

### Material Symbols

Check out [Material Symbols](https://github.com/beecho01/material-symbols) to use updated material icons, as shown in the screenshots!

### Graphite Theme

This theme was initially modified from the [Graphite theme](https://github.com/TilmanGriesel/graphite), as it was my favorite Home Assistant theme on HACS before I created this one. Therefore, it contains similar logic and variables.

[last-commit-shield]: https://img.shields.io/github/last-commit/Nerwyn/material-rounded-theme?style=for-the-badge
[commits]: https://github.com/Nerwyn/material-rounded-theme/commits/main
[forum-shield]: https://img.shields.io/badge/community-forum-brightgreen.svg?style=for-the-badge
[forum]: https://community.home-assistant.io/t/material-rounded-a-google-material-you-inspired-theme/623242
[license-shield]: https://img.shields.io/github/license/Nerwyn/material-rounded-theme.svg?style=for-the-badge
[maintenance-shield]: https://img.shields.io/badge/maintainer-Nerwyn-blue.svg?style=for-the-badge
[releases-shield]: https://img.shields.io/github/release/Nerwyn/material-rounded-theme.svg?style=for-the-badge
[releases]: https://github.com/nerwyn/material-rounded-theme/releases
[github]: https://img.shields.io/github/followers/Nerwyn.svg?style=social
