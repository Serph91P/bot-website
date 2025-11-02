# Icons für PWA erstellen

Diese Datei enthält Anweisungen zum Erstellen der PWA-Icons.

## Benötigte Icon-Größen

Erstellen Sie Icons in folgenden Größen und speichern Sie sie in diesem Verzeichnis:

- icon-72x72.png (72x72 Pixel)
- icon-96x96.png (96x96 Pixel)
- icon-128x128.png (128x128 Pixel)
- icon-144x144.png (144x144 Pixel)
- icon-152x152.png (152x152 Pixel)
- icon-192x192.png (192x192 Pixel)
- icon-384x384.png (384x384 Pixel)
- icon-512x512.png (512x512 Pixel)

## Automatische Generierung

Sie können alle Icons automatisch aus einem einzigen hochauflösenden Bild generieren:

### Mit PWA Asset Generator

```bash
npm install -g pwa-asset-generator

# Erstellen Sie zunächst ein Logo (mindestens 512x512px) und speichern Sie es als logo.png
pwa-asset-generator logo.png ./public/icons --icon-only --background "#000000"
```

### Mit ImageMagick

```bash
# Installieren Sie ImageMagick
# Ubuntu/Debian: sudo apt-get install imagemagick
# macOS: brew install imagemagick

# Generieren Sie alle Größen aus einem Quellbild (source-logo.png)
convert source-logo.png -resize 72x72 icon-72x72.png
convert source-logo.png -resize 96x96 icon-96x96.png
convert source-logo.png -resize 128x128 icon-128x128.png
convert source-logo.png -resize 144x144 icon-144x144.png
convert source-logo.png -resize 152x152 icon-152x152.png
convert source-logo.png -resize 192x192 icon-192x192.png
convert source-logo.png -resize 384x384 icon-384x384.png
convert source-logo.png -resize 512x512 icon-512x512.png
```

## Online-Tools

Alternativ können Sie Online-Tools verwenden:

- [Favicon Generator](https://realfavicongenerator.net/)
- [PWA Builder](https://www.pwabuilder.com/imageGenerator)
- [App Icon Generator](https://www.appicon.co/)

## Design-Richtlinien

- **Einfaches Design**: Icons sollten auch in kleinen Größen gut erkennbar sein
- **Kontrast**: Verwenden Sie hohen Kontrast für bessere Sichtbarkeit
- **Padding**: Lassen Sie etwas Rand um das Icon (ca. 10% der Größe)
- **Format**: PNG mit Transparenz oder einfarbigem Hintergrund

## Placeholder-Icons

Für schnelle Tests können Sie temporär ein einfaches Icon erstellen:

```bash
# Mit ImageMagick ein einfaches farbiges Icon erstellen
for size in 72 96 128 144 152 192 384 512; do
  convert -size ${size}x${size} xc:#3B82F6 \
    -gravity center \
    -pointsize $((size/3)) \
    -fill white \
    -annotate +0+0 "BW" \
    icon-${size}x${size}.png
done
```

Dies erstellt blaue Icons mit weißem "BW" Text.
