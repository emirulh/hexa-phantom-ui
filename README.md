# HEXA ONE — Car display prototype

A client presentation prototype of an electric-car centre display. React + Vite; all interactions run locally in the browser. No vehicle, mapping, weather, billing or audio service is connected.

## Present the prototype

Open in a landscape browser (1280 × 800 or larger recommended). The six bottom menus always remain accessible. Open **Settings → Presentation guide** for a walkthrough and **Reset demonstration** between client sessions.

- **Navigate:** search the four sample destinations, preview/start/end a route, zoom and centre the illustrated map.
- **Comfort:** set 16–28°C, select temperature presets, adjust the fan, cooling, fresh air and window clearing.
- **Charging:** choose a sample station, set a 50–100% target, start/pause/finish an accelerated charge. Range and sample cost update with progress. Station selection and target changes are locked while charging.
- **Car:** toggle door locks and boot, set lights and wipers.
- **Music:** simulated playlist, play/pause, next track and volume. No audio plays.
- **Settings:** night appearance, brightness, full-screen mode, presentation guide and reset.

The car remains parked. Destinations and prices are illustrative. The clock uses the browser's local time. Reload resets the prototype. Touch and keyboard controls are supported, with a stacked layout on smaller screens.

## Develop

```sh
npm ci
npm run dev
```

```sh
npm run lint
npm run build
```

## Design

Original sage, ivory and charcoal palette, illustrated map and Hexa branding. Persistent vehicle information and one-touch comfort access take inspiration from modern automotive interfaces, including Tesla's touchscreen overview and climate documentation, without reproducing their layout or branding.
