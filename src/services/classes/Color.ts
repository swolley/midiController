import { Listener, MyObjectListener, sealed } from "@/services/types/decorators";

@sealed
@Listener(new MyObjectListener())
export default class Color {
    private _r: number;
    private _g: number;
    private _b: number;
    private _a?: number;

    public constructor(r?: number, g?: number, b?: number, a?: number) {
        this._r = r !== undefined ? r : Color.random();
        this._g = g !== undefined ? g : Color.random();
        this._b = b !== undefined ? b : Color.random();
        this._a = a;
    }

    public get r(): number {
        return this._r;
    }
    public set r(value: number) {
        if (Color.validateValue(value, 255)) Color.throwInvalidValueError();
        this._r = value;
    }

    public get g(): number {
        return this._g;
    }
    public set g(value: number) {
        if (Color.validateValue(value, 255)) Color.throwInvalidValueError();
        this._g = value;
    }

    public get b(): number {
        return this._b;
    }
    public set b(value: number) {
        if (Color.validateValue(value, 255)) Color.throwInvalidValueError();
        this._b = value;
    }

    public get a(): number | undefined {
        return this._a;
    }
    public set a(a: number | undefined) {
        if (a !== undefined && Color.validateValue(a, 100)) Color.throwInvalidValueError();
        this._a = a;
    }

    private static validateValue(value: number, max: number): boolean {
        return value < 0 || value > max;
    }

    private static throwInvalidValueError() {
        throw new Error("rbg values must be between 0 and 255");
    }

    private static random(): number {
        return Math.floor(Math.random() * 255);
    }

    private static componentToHex(c: number): string {
        const hex = c.toString(16);
        return hex.length == 1 ? "0" + hex : hex;
    }

    public static createFromHex(hex: string): Color {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})?$/i.exec(hex);
        if (!result) throw new Error(`${hex} is not a valid hex value`);
        return new Color(parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16));
    }

    public static isValidHex(hex: string): boolean {
        return /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex) !== null;
    }

    public isTransparent(): boolean {
        return this._a === 0;
    }

    public toRgb(): string {
        return this._a !== undefined ? `rgba(${this._r},${this._g},${this._b},${this._a})` : `rgb(${this._r},${this._g},${this._b})`;
    }

    public toHex(): string {
        return (
            "#" +
            Color.componentToHex(this._r) +
            Color.componentToHex(this._g) +
            Color.componentToHex(this._b) +
            (this._a ? Color.componentToHex((this._a / 100) * 255) : "")
        );
    }

    public toString() {
        return this.toRgb();
    }
}
