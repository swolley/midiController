import type { ChannelRange, IDeviceConfig, RotaryStyle, IDeviceControllers, IControllerConfigs } from "@/services/types/devices";
import { ObjectUtils, Validators } from "@/services/classes/Utils";
import Color from "@/services/classes/Color";
import { sealed, MyObjectListener, Listener } from "@/services/types/decorators";
import type { Output } from "webmidi";

const notValidError = "Not a valid color";

@sealed
@Listener(new MyObjectListener())
export class Outboard implements IDeviceConfig {
    private _id: string;
    private _label: string;
    private _backgroundColor: Color;
    private _panelColor: Color;
    private _borderColor: Color;
    private _borderSize = 0;
    private _hasMultiSelection = false;
    private _category: string;
    private _style: RotaryStyle = "dark";
    private _logo?: string;
    private _controllers: IDeviceControllers;
    private _channel: ChannelRange = 1;
    private _output?: Output;
    readonly stock: boolean;
    readonly originalConfigs: IDeviceConfig;
    readonly key: string;

    public constructor(config: IDeviceConfig) {
        this.originalConfigs = Object.freeze(ObjectUtils.clone<IDeviceConfig>(config));

        this._id = config.id;
        this.key = config.id + new Date().getTime().toString();
        this._label = config.label;
        this._backgroundColor = Outboard.parseColor(config.backgroundColor);
        this._panelColor = Outboard.parseColor(config.panelColor);
        this._borderColor = Outboard.parseColor(config.borderColor);
        if (config.borderSize) this._borderSize = config.borderSize;
        this.stock = config.stock;
        this._logo = config.logo;
        for (const type in config.controllers) {
            for (const controller of config.controllers[type as keyof IDeviceControllers]) {
                controller.minValue = controller.minValue || 1;
                controller.minValue = controller.maxValue || 127;
            }
        }
        this._controllers = config.controllers;
        this._category = config.category || "uncategorized";
        if (config.style) this._style = config.style;
        // if (config.hasMultiSelection) this.hasMultiSelection = config.hasMultiSelection;
        // {
        //     lcds: config.controllers.lcds.map((controller) => Outboard.createController(controller)),
        //     toggles: config.controllers.toggles.map((controller) => Outboard.createController(controller)),
        //     rotaries: config.controllers.rotaries.map((controller) => Outboard.createController(controller)),
        // };
    }

    private static parseColor(color: Color | string | undefined): Color {
        if (typeof color === "string" && color !== "transparent" && !Validators.isColor(color)) throw new Error(notValidError);
        if (color === "transparent" || color === undefined) return new Color(0, 0, 0, 0);
        return typeof color === "string" ? Color.createFromHex(color) : color;
    }

    get id(): string {
        return this._id;
    }

    set id(id: string) {
        this._id = id;
    }

    get label(): string {
        return this._label;
    }

    set label(label: string) {
        this._label = label;
    }

    get backgroundColor(): Color {
        return this._backgroundColor;
    }

    set backgroundColor(color: Color | string) {
        this._backgroundColor = Outboard.parseColor(color);
    }

    get panelColor(): Color {
        return this._panelColor;
    }

    set panelColor(color: Color | string) {
        this._panelColor = Outboard.parseColor(color);
    }

    get borderColor(): Color {
        return this._borderColor;
    }

    set borderColor(color: Color | string) {
        this._borderColor = Outboard.parseColor(color);
    }

    get borderSize(): number {
        return this._borderSize;
    }

    set borderSize(size: number) {
        if (size <= 0) throw new Error(notValidError);
        this._borderSize = size;
    }

    get hasMultiSelection(): boolean {
        return this._hasMultiSelection;
    }

    set hasMultiSelection(value: boolean) {
        this._hasMultiSelection = value;
    }

    get category(): string {
        return this._category;
    }

    set category(value: string | undefined) {
        if (value && value.length) throw new Error(notValidError);
        this._category = value !== undefined && value.length > 0 ? value : "uncategorized";
    }

    get style(): RotaryStyle {
        return this._style;
    }

    set style(value: RotaryStyle) {
        this._style = value;
    }

    get logo(): string | undefined {
        return this._logo;
    }

    set logo(value: string | undefined) {
        if (value && value.length) throw new Error(notValidError);
        this._logo = value;
    }

    get channel(): ChannelRange {
        return this._channel;
    }

    set channel(channel: ChannelRange) {
        this._channel = channel;
    }

    get outputInterface(): Output | undefined {
        return this._output;
    }

    set outputInterface(output: Output | undefined) {
        this._output = output;
    }

    get controllers(): IDeviceControllers {
        return this._controllers;
    }

    private getControllerList(controller: IControllerConfigs) {
        switch (controller.type) {
            case "LCD":
                return this.controllers.lcds;
            case "TOGGLE":
                return this.controllers.toggles;
            case "ROTARY":
                return this.controllers.rotaries;
        }
    }

    public addController(controller: IControllerConfigs) {
        const list: IControllerConfigs[] = this.getControllerList(controller);
        const foundIdx = list.findIndex((c) => c.label === controller.label);
        if (foundIdx !== -1) throw new Error("Controller already exists");

        list.push(controller);
    }

    public deleteController(controller: IControllerConfigs) {
        const list: IControllerConfigs[] = this.getControllerList(controller);
        const foundIdx = this.controllers.lcds.findIndex((c) => c.label === controller.label);
        if (foundIdx === -1) throw new Error("Controller not found");

        list.splice(foundIdx, 1);
    }

    // private static createController(controller: IControllerConfigs) {
    //     return controller;
    // }

    // public getDeviceConfigs(): IDeviceConfig {
    //     return JSON.parse(
    //         JSON.stringify({
    //             id: this.id,
    //             // channel: this.channel,
    //             label: this.label,
    //             backgroundColor: this.backgroundColor,
    //             panelColor: this.panelColor,
    //             borderColor: this.borderColor,
    //             borderSize: this.borderSize,
    //             // hasMultiSelection: this.hasMultiSelection,
    //             controllers: this.controllers,
    //             style: this.style,
    //             stock: this.stock,
    //             category: this.category,
    //         })
    //     ) as IDeviceConfig;
    // }
}
