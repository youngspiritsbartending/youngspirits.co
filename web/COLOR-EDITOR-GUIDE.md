# Young Spirits Color Editor Guide

## Overview

The Color Editor is a standalone visual tool that allows you to customize all colors across your website without touching any code. It provides real-time previews and exports a configuration file that can be directly integrated into your project.

## Features

- **Visual Color Editing**: Use color pickers or enter hex codes directly
- **Real-Time Preview**: See changes instantly for both Light and Firefly modes
- **Export/Import**: Save and load color configurations as JSON
- **Copy to Clipboard**: Quickly copy configuration for pasting
- **Reset to Defaults**: Restore original colors with one click

## How to Use

### Step 1: Open the Color Editor

Open `color-editor.html` in your web browser. You can do this by:
- Double-clicking the file
- Opening it through your code editor's live preview
- Serving it with a local web server

### Step 2: Customize Colors

The editor is divided into two panels:

#### Light Mode (Left Panel)
- **Backgrounds**: Primary, Secondary, and Card backgrounds
- **Text**: Primary, Secondary, and Tertiary text colors
- **Borders & Accents**: Gold accent and secondary border colors

#### Firefly Mode (Right Panel)
- Same categories as Light Mode but for dark/night theme

For each color:
1. Click the color square to open the color picker
2. Or type a hex code directly into the text field
3. Watch the preview update in real-time below

### Step 3: Preview Your Changes

Each panel includes a preview card showing how your colors will look in actual components:
- Heading text (Primary text color)
- Body text (Secondary text color)
- Button with border (Gold accent)
- Card background and borders

### Step 4: Export Your Configuration

Once you're happy with your colors:

1. Click **"Export Configuration"** button
2. The JSON configuration appears in the textarea below
3. Click **"Copy to Clipboard"** to copy it

### Step 5: Apply to Your Website

You have two options:

#### Option A: Update the Default Colors (Recommended)

1. Open `src/config/colors.ts` in your code editor
2. Find the `defaultColors` object
3. Replace it with your exported JSON configuration
4. Save the file

Example:
```typescript
export const defaultColors: ThemeColors = {
  // Paste your exported JSON here
  light: {
    backgrounds: {
      primary: '#your-color',
      // ... rest of your configuration
    }
  }
};
```

#### Option B: Use Runtime Import (Advanced)

You can also load colors dynamically at runtime using the import functions in `src/config/colors.ts`.

## Color Categories Explained

### Backgrounds

- **Primary**: Main page background
- **Secondary**: Alternate section backgrounds
- **Tertiary**: Special section backgrounds
- **Card**: Individual card/tile backgrounds
- **CardAlt**: Alternate card styling
- **Gradient**: Background gradients (auto-generated)

### Text

- **Primary**: Main headings and important text
- **Secondary**: Subheadings and labels
- **Tertiary**: Body text and descriptions

### Borders

- **Primary**: Gold accent borders (usually stays gold)
- **Secondary**: Subtle dividers and card borders

### Accents

- **Gold**: Primary accent color (CTA buttons, highlights)
- **GoldHover**: Hover state for gold elements (auto-generated)

## Tips for Great Color Schemes

1. **Maintain Contrast**: Ensure text is readable on backgrounds
   - Light mode: Dark text on light backgrounds
   - Firefly mode: Light text on dark backgrounds

2. **Keep Gold Consistent**: The gold accent (#d4af37) is part of the brand identity. Consider keeping it the same across both modes.

3. **Test in Preview**: Always check the preview cards to ensure your colors work well together

4. **Subtle Differences**: For backgrounds, use subtle variations rather than dramatic contrasts

5. **Save Your Work**: Export and save your configurations regularly

## Importing Previous Configurations

To load a previously saved color scheme:

1. Click **"Import Configuration"** button
2. Select your saved JSON file
3. All colors will update automatically
4. Review the changes in the preview panels

## Troubleshooting

### Colors Don't Look Right After Import

- Ensure your JSON file is properly formatted
- Check that all required color properties are present
- Try resetting and starting over

### Preview Doesn't Update

- Make sure you're entering valid hex codes (e.g., #ff0000)
- Refresh the page and try again

### Export Button Not Working

- Try the "Copy to Clipboard" button instead
- Manually select and copy the text from the textarea

## Technical Details

### Color Format

All colors must be in hex format: `#RRGGBB`

Valid examples:
- `#d4af37`
- `#fdfcf8`
- `#1a1f3a`

Invalid examples:
- `rgb(212, 175, 55)` ❌
- `gold` ❌
- `#d4af3` ❌ (missing digit)

### Configuration Structure

```json
{
  "light": {
    "backgrounds": { ... },
    "text": { ... },
    "borders": { ... },
    "accents": { ... }
  },
  "firefly": {
    "backgrounds": { ... },
    "text": { ... },
    "borders": { ... },
    "accents": { ... }
  }
}
```

## Advanced: Coordinated Transitions

The website now uses an improved organic transition system that coordinates color changes across all elements. Here's what was fixed:

### The Problem
Previously, tiled elements (packages, addons, testimonials, contact form) all changed colors at the same time in a jarring flash.

### The Solution
Each section now uses **hierarchical timing**:

1. **Base Delay**: When the section starts its transition
2. **Stagger Delay**: Time between each card's transition
3. **Duration**: How long each transition takes

This creates a beautiful "wave" effect where:
- Hero elements transition first
- Section headers follow
- Individual cards cascade in sequence
- The whole page feels organic and cohesive

### Customizing Transition Timing

If you want to adjust the transition behavior, edit `src/hooks/useOrganicTransition.ts`:

```typescript
const defaultConfig: TransitionConfig = {
  baseDelay: 0,          // Start immediately
  staggerDelay: 0.05,    // 50ms between elements
  minDuration: 0.6,      // Minimum 600ms
  maxDuration: 1.2,      // Maximum 1200ms
};
```

Lower values = faster transitions
Higher values = slower, more dramatic transitions

## Support

If you encounter issues or have questions about the color editor, refer to the main project documentation or check the configuration files in `src/config/`.

---

**Enjoy customizing your Young Spirits website!**
