import Color from "@/services/classes/Color";

export function useColors(background: Color, lightColor = "#ffffff", darkColor = "#000000") {
    const validLightColor = validateLightColor();
    const validDarkColor = validateDarkColor();
    const foreground = getFgFromBgColor();
    const isFgInverted = foreground.toHex().substring(0, 7) === validLightColor.toHex().substring(0, 7);

    function validateLightColor() {
        if (lightColor === "transparent") return new Color(0, 0, 0, 0);
        if (lightColor[0] !== "#") lightColor = "#" + lightColor;
        if (lightColor.length === 4) lightColor += lightColor.substring(1);
        return Color.createFromHex(lightColor);
    }

    function validateDarkColor() {
        if (darkColor === "transparent") return new Color(0, 0, 0, 0);
        if (darkColor[0] !== "#") darkColor = "#" + darkColor;
        if (darkColor.length === 4) darkColor += darkColor.substring(1);
        return Color.createFromHex(darkColor);
    }

    function getFgFromBgColor() {
        let color = background.isTransparent() ? Color.createFromHex("#c0c0c0") : background;
        const c = [color.r / 255, color.g / 255, color.b / 255].map((col) => {
            if (col <= 0.03928) return col / 12.92;
            return Math.pow((col + 0.055) / 1.055, 2.4);
        });
        const L = 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
        color = L > 0.479 ? validDarkColor : validLightColor;
        return color || new Color(0, 0, 0);
    }

    return {
        background,
        foreground,
        isFgInverted,
    };
}
