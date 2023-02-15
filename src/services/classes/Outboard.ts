import type { ChannelRange, ILcdControllerConfigs, IMessageControllerConfigs, IDeviceConfig, IControllerConfigs, RotaryStyle } from "../types/devices";

export class Outboard implements IDeviceConfig {
    public id: string;
    readonly key: string;
    public _channel: ChannelRange = 1;
    public label: string;
    public backgroundColor: string;
    public panelColor?: string = "transparent";
    public borderColor?: string = "transparent";
    public borderSize?: number = 0;
    public hasMultiSelection = false;
    public stock: boolean;
    public category?: string;
    public style: RotaryStyle = "dark";
    public logo?: string;
    // public controllers: (ILcdControllerConfigs | IMessageControllerConfigs)[];
    public controllers: {
        lcds: ILcdControllerConfigs[];
        toggles: IMessageControllerConfigs[];
        rotaries: IMessageControllerConfigs[];
    };

    readonly originalConfigs: IDeviceConfig;

    public constructor(config: IDeviceConfig) {
        this.originalConfigs = config;

        this.id = config.id;
        this.key = config.id + new Date().getTime().toString();
        this.label = config.label;
        this.backgroundColor = config.backgroundColor;
        this.panelColor = config.panelColor;
        this.borderColor = config.borderColor;
        this.borderSize = config.borderSize;
        this.stock = config.stock;
        this.logo = config.logo;
        this.controllers = config.controllers;
        if (config.category) this.category = config.category;
        // if (config.hasMultiSelection) this.hasMultiSelection = config.hasMultiSelection;
        if (config.style) this.style = config.style;
        // {
        //     lcds: config.controllers.lcds.map((controller) => Outboard.createController(controller)),
        //     toggles: config.controllers.toggles.map((controller) => Outboard.createController(controller)),
        //     rotaries: config.controllers.rotaries.map((controller) => Outboard.createController(controller)),
        // };
    }

    get channel(): ChannelRange {
        return this._channel;
    }

    set channel(channel: ChannelRange) {
        this._channel = channel;
    }

    // private static createController(controller: IControllerConfigs) {
    //     return controller;
    // }

    public getDeviceConfigs(): IDeviceConfig {
        return {
            id: this.id,
            // channel: this.channel,
            label: this.label,
            backgroundColor: this.backgroundColor,
            panelColor: this.panelColor,
            borderColor: this.borderColor,
            borderSize: this.borderSize,
            // hasMultiSelection: this.hasMultiSelection,
            controllers: this.controllers,
            style: this.style,
            stock: this.stock,
            category: this.category,
        };
    }
}
