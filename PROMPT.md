Build an interactive "Secret Decoder Wheel" web app for the 1988 Cinemaware game **Rocket Ranger**.

## What it is
Rocket Ranger shipped with a physical cardboard decoder wheel as copy protection. It's two concentric discs joined by a brass fastener. You rotate the inner disc to align your origin country with a marker, then read the fuel value for your destination through a cutout window. The game prompts you with an origin and destination country at startup and you must enter the correct fuel value.

## Data
`decoder-data.json` contains the full lookup table. It's a nested object: `data[origin][destination]` = fuel value.

## Requirements
- Single-page app (HTML/CSS/JS, no framework needed)
- Interactive rotating wheel that mimics the physical prop — two concentric discs that rotate
- Click/drag to rotate the outer wheel, inner wheel stays fixed (or vice versa — whichever feels more natural)
- Countries arranged around the circumference of each disc
- When origin and destination are aligned/selected, display the fuel value prominently
- Also include a simple dropdown fallback for quick lookups
- Visual style: 1940s pulp serial / art deco aesthetic matching the game's theme — bold colors, retro typography, aged paper textures
- Responsive, works on desktop and mobile
- Load the data from decoder-data.json

## Reference
The physical wheel is roughly 6 inches diameter, cream/tan cardboard, with country names printed around the edges in a typewriter-style font. The center has the Cinemaware logo. There's a small rectangular window cut in the top disc that reveals the fuel number on the bottom disc when properly aligned.
