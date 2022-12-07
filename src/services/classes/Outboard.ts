import type { ChannelRange, ILcdControllerConfigs, IMessageControllerConfigs, IDeviceConfig, IControllerConfigs, RotaryStyle } from "../types/devices";

export class Outboard implements IDeviceConfig {
    public id: string;
    readonly key: string;
    public channel: ChannelRange;
    public label: string;
    public backgroundColor: string;
    public panelColor?: string = "transparent";
    public borderColor?: string = "transparent";
    public borderSize?: number = 0;
    public hasMultiSelection = false;
    public stock: boolean;
    public category?: string;
    public style: RotaryStyle = "dark";
    public controllers: (ILcdControllerConfigs | IMessageControllerConfigs)[];

    public constructor(config: IDeviceConfig) {
        this.id = config.id;
        this.key = config.id + new Date().getTime().toString();
        this.channel = config.channel;
        this.label = config.label;
        this.backgroundColor = config.backgroundColor;
        this.panelColor = config.panelColor;
        this.borderColor = config.borderColor;
        this.borderSize = config.borderSize;
        this.stock = config.stock;
        if (config.category) this.category = config.category;
        if (config.hasMultiSelection) this.hasMultiSelection = config.hasMultiSelection;
        if (config.style) this.style = config.style;
        this.controllers = config.controllers.map((controller) => Outboard.createController(controller));
    }

    private static createController(controller: IControllerConfigs) {
        return controller;
    }
}
