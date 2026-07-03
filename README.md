# AuraCast Extended

An unofficial extended edition of [AuraCast](https://github.com/Manaiakalani/auracast), focused on E01 and E87 round LED badges.

Create and send images, animated patterns, text, GIFs, video clips, image sequences, and QR codes directly from Google Chrome using Web Bluetooth.

## Use it

Open the hosted site in the latest Google Chrome, wake the badge, click **Connect**, and choose an `E01` or `E87` device.

Supported platforms: Chrome on Windows, macOS, ChromeOS, and Android. Browsers on iPhone and iPad do not expose Web Bluetooth.

## Local development

```bash
cd web
npm install
npm run dev
```

## Credits

AuraCast Extended builds on:

- [Manaiakalani/auracast](https://github.com/Manaiakalani/auracast)
- [jumpingmushroom/e87_badge](https://github.com/jumpingmushroom/e87_badge)
- [hybridherbst/web-bluetooth-e87](https://github.com/hybridherbst/web-bluetooth-e87)

The original copyright notices are retained in [LICENSE](LICENSE). Licensed under the MIT License.
