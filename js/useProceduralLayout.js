/**
 * Generates procedural layout data for a grid of background cards.
 * Returns an array of positional and transform values.
 */

export function generateProceduralLayout(cardCount, config = {}) {
    // Determine viewport size to help center the grid
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    const {
        gridCols = 4,
        spacingX = 350,
        spacingY = 250,
        maxRotation = 8,  // ±8 degrees
        minScale = 0.7,
        maxScale = 1.1,
        maxDepth = 5 // used for blur and opacity
    } = config;

    const layoutParams = [];

    // Calculate grid total dimensions to center it
    const gridRows = Math.ceil(cardCount / gridCols);
    const totalWidth = (gridCols - 1) * spacingX + (gridRows - 1) * (spacingX / 2);
    const totalHeight = (gridRows - 1) * spacingY;

    // Base offset to center the entire grid on screen
    const offsetX = (viewportWidth - totalWidth) / 2;
    const offsetY = (viewportHeight - totalHeight) / 2;

    for (let i = 0; i < cardCount; i++) {
        // Grid positioning
        const col = i % gridCols;
        const row = Math.floor(i / gridCols);

        // Base positions with diagonal shift
        let x = offsetX + (col * spacingX) + (row * (spacingX / 2));
        let y = offsetY + (row * spacingY);

        // Add some noise (randomness) to positions so it doesn't look too rigid
        x += (Math.random() - 0.5) * (spacingX * 0.4);
        y += (Math.random() - 0.5) * (spacingY * 0.4);

        // Rotation (± rotation)
        const rotation = (Math.random() * maxRotation * 2) - maxRotation;

        // Scale
        const scale = minScale + (Math.random() * (maxScale - minScale));

        // Depth (1 to maxDepth). Higher depth = further away = more blur, less opacity
        const depth = 1 + Math.random() * (maxDepth - 1);

        // Z translation based on depth to actually push it back in 3D space
        // Assuming perspective is set on the container
        const translateZ = -1 * depth * 50;

        layoutParams.push({
            x,
            y,
            rotation,
            scale,
            depth,
            translateZ
        });
    }

    // Shuffle the array slightly to mix foreground and background cards
    return layoutParams.sort(() => Math.random() - 0.5);
}
