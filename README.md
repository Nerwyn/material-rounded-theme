[![GitHub Release][releases-shield]][releases]
[![License][license-shield]](LICENSE.md)
[![hacs_badge](https://img.shields.io/badge/HACS-Default-blue.svg?style=for-the-badge)](https://github.com/hacs/integration)
![Project Maintenance][maintenance-shield]
[![GitHub Activity][last-commit-shield]][commits]
[![Community Forum][forum-shield]][forum]

[![My Home Assistant](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?repository=material-rounded-theme&owner=Nerwyn&category=Plugin)

# Material Rounded Theme

Themes for Home Assistant influenced by Material You by Google on Android.

This theme aims to match the styling of Material Design 3 (also known as Material You) apps like Google Home as closely as possible, so it may change over time as these apps evolve. It also aims to implement Material You redesigns of elements when possible.

Relies on [card-mod](https://github.com/thomasloven/lovelace-card-mod) for toolbar modifications, other Material You component redesigns, and Material You coloring. If you have card-mod installed and do not want these changes to apply, use the "No Mod" versions of this theme.

Don't like the blue accents? You can choose a different Material You base color! See below for more. Also requires card-mod.

This theme also includes "Transparent Card" versions with card backgrounds that match the view background. It also includes separate light and dark versions of all themes for niche use cases.

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

### Updated Material You Components

<img src="https://raw.githubusercontent.com/Nerwyn/material-rounded-theme/main/assets/components-dark.png" alt="components-dark" width="600"/>

<img src="https://raw.githubusercontent.com/Nerwyn/material-rounded-theme/main/assets/components-light.png" alt="components-light" width="600"/>

### User Defined Base Color

<img src="https://raw.githubusercontent.com/Nerwyn/material-rounded-theme/main/assets/custom-color-dark.png" alt="custom-color-dark" width="600"/>

<img src="https://raw.githubusercontent.com/Nerwyn/material-rounded-theme/main/assets/custom-color-light.png" alt="custom-color-light" width="600"/>

## Material You Components, Powered By Card Mod

This theme is super-charged by [card-mod](https://github.com/thomasloven/lovelace-card-mod)! Using card-mod many components have received Material You design upgrades.

### Navigation

Redesigns the toolbar and sidebar buttons to follow Material You navigation component guidelines.

#### [Top App Bar](https://m3.material.io/components/top-app-bar/overview)

-   Retains the sidebar toggle and dashboard menu (small width screens) or action items (large width screens) from the navigation toolbar header in a top app bar.
-   Non-view buttons appear at top of screen near their original locations.
-   Buttons disappear when user is not scrolled to the top of the view.

#### [Navigation Bar](https://m3.material.io/components/navigation-bar/overview)

-   Converts the toolbar header view tabs bar into a navigation bar footer.
-   Removes the default selection bar and ripple.
-   Spaces the view icons evenly along the entire toolbar.
    -   **WARNING**: Subviews must be placed at the end of the toolbar for the view tab count to be correct, otherwise the view tabs will end up smaller than expected.
    -   While evenly spacing the icons should (and previously) be done by making their parent a flexbox, their parent is within a shadow-root which the view tabs are slotted into. Modifying this parent element with card-mod is possible but it is slow and inconsistent. A tab count and width calculation method is used instead, which is much faster and more consistent.
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

-   Adds a 40px margin to the top for the top app bar and an 80px margin to the bottom for the navigation bar.
-   Adds a 12px margin to each side of the view to match the Google Home app.
-   Add card button of classic lovelace views updated to better match the [extended FAB specification](https://m3.material.io/components/extended-fab/overview).

If you do not want these changes, use the "No Mod" versions of the theme.

## Material You Colors

This theme supports Material You color theming! Create a helper template sensor named `Material Rounded Base Color` that returns the hex code of your preferred base color. The accent and primary color will be calculated using it, retaining your color's hue and saturation but altering it's luminance.

To create a template sensor helper:

1. Navigate to `Settings` > `Devices & services` > ` Helpers`.
2. Click `+ CREATE HELPER`.
3. Click `Template`.
4. Click `Template a sensor`.
5. Name the sensor `Material Rounded Base Color`. The sensor entity ID should be `sensor.material_rounded_base_color`.
6. Enter your Material You base color as a six digit hex code, like `238636` or `#db4437`. You can also use a template to read a hex code from the state or attribute of a different entity, like `{{ states("sensor.pixel_fold_accent_color") }}`.
7. Click `SUBMIT`.

You can also choose user specific colors by creating a sensor named `Material Rounded Base Color Your Name`, with your name being your person name as it appears on the [Home Assistant people page](http://homeassistant.local:8123/config/person). The sensory entity ID should be something like `sensor.material_rounded_base_color_john_doe`.

If you are using the Home Assistant Android companion app, you can enable the accent color sensor in the companion app settings to use your phone's Material You accent color as the theme base color:

1. Navigate to `Settings` > `Companion app`.
2. Click `Manage sensors.`
3. Scroll down to the section titled `Dynamic color` and click `Accent color`.
4. Toggle `Enable sensor` on. It should now return your phone's Material You base color as a hex code.

**NOTE**: Card mod does not support all Home Assistant frontend elements like the developer tools and settings pages, and thew view configuration, add card, edit card configuration, and assist dialogues. These pages will still use the theme default colors on parts of the UI.

## Installation

1. Navigate to HACS (install from [here](https://hacs.xyz/) if you do not have it yet).
2. Navigate to `Frontend`.
3. Click `+ EXPLORE & DOWNLOAD REPOSITORIES` and search for `Material Rounded Theme`.
4. Open this repository in HACS and click `DOWNLOAD`.
5. Optionally also install card-mod from HACS to take advantage of the Material You components and colors described above.
6. Refresh Home Assistant.
7. Navigate to your Profile, and select `Material Rounded` under Theme along with your preference for light or dark mode.

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

Check out [Material Symbols](https://github.com/beecho01/material-symbols) to use updated material icons as shown in the screenshots!

### Graphite Theme

This theme was initially modified from [Graphite theme](https://github.com/TilmanGriesel/graphite), as it was my favorite Home Assistant theme on HACS before I created this one. Therefore, it may contain some legacy variables from it.

## Developing, Modifying, and Building The Theme

Due to the multiple versions and complexity of this theme, I have split it into multiple CSS and yaml files and created a Python git pre-commit build pipeline to compile all of the files into a single Home Assistant theme file. You can either run this build pipeline by making a git commit (not to the main repo of course) running the file `build.sh`, or running the `pre-commit.py` Python file.

Twelve versions of a theme are created per base theme - with card mod, without card mod, transparent cards with card mod, transparent cards without card mod, and a separate light and dark version of each. The no card mod versions of theme have the `card-mod-theme` fields removed and will have no design upgrades or custom colors. The transparent card versions of the theme use the same color for the background and cards, making them appear transparent (true transparency breaks overlays like dropdowns). The separate light and dark versions of the theme are if you need to explicitly set a device to use light or dark mode without the Home Assistant built in theme mode options.

Any files under common that end in `.yaml` are treated as `card-mod-*-yaml` fields in the themes, and files ending in `.css` contain the actual card-mod CSS. Different overall version of the theme are included in separate folders, such as `material_rounded`. CSS files are copied into the card-mod yaml fields using jinja2 templates, allowing for repetitive styles that go in different shadow roots to all source from the same file.

The common folder also includes `hex2hsl.jinja` - a hex to HSL color formula ported to jinja2 for transforming user defined base colors into HSL. The HSL base color is used for calculating primary, accent, and other custom colors. How these custom colors are defined and used is determined at the theme folder level in `user_colors.jinja`. If possible, I would like to instead use Material You's HCT color system, but it would have to be ported to jinja2 along with a HCT to hex/rgb/hsl/etc function.

[last-commit-shield]: https://img.shields.io/github/last-commit/Nerwyn/material-rounded-theme?style=for-the-badge
[commits]: https://github.com/Nerwyn/material-rounded-theme/commits/main
[forum-shield]: https://img.shields.io/badge/community-forum-brightgreen.svg?style=for-the-badge
[forum]: https://community.home-assistant.io/t/material-rounded-a-google-material-you-inspired-theme/623242
[license-shield]: https://img.shields.io/github/license/Nerwyn/material-rounded-theme.svg?style=for-the-badge
[maintenance-shield]: https://img.shields.io/badge/maintainer-Nerwyn-blue.svg?style=for-the-badge
[releases-shield]: https://img.shields.io/github/release/Nerwyn/material-rounded-theme.svg?style=for-the-badge
[releases]: https://github.com/nerwyn/material-rounded-theme/releases
[github]: https://img.shields.io/github/followers/Nerwyn.svg?style=social
