import { IEditor, IConsole, type IDeviceConfig } from "./devices";
import type { Midi } from "../classes/Midi";
import type { Http } from "../classes/Http";
import type { Outboard } from "../classes/Outboard";

export interface IAppStoreProps {
    rackDevices: Outboard[];
    availableDevices: IDeviceConfig[];
    // inputs: WebMidi.inputs;
    // outputs: WebMidi.outputs;
    midi?: Midi;
    http?: Http;
    editor?: IEditor;
    console?: IConsole;
}
