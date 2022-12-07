import { Enumerations, Input, Output, WebMidi } from "webmidi";
import type { ChannelRange, IDeviceConfig, MessageType } from "../types/devices";

export class Midi {
    private _inputs: Input[] = [];

    private _outputs: Output[] = [];

    public constructor(inputs: Input[], outputs: Output[]) {
        this._inputs = inputs;
        this._outputs = outputs;
    }

    get inputs() {
        return this._inputs;
    }

    get outputs() {
        return this._outputs;
    }

    public isSysexEnabled(): boolean {
        return WebMidi.interface.sysexEnabled;
    }

    public static async init() {
        try {
            await WebMidi.enable({ sysex: true });
            // eslint-disable-next-line no-console
            console.info("WebMidi enabled ", true);
            // eslint-disable-next-line no-console
            console.info("Sysex enabled ", WebMidi.interface.sysexEnabled);
            return new Midi(WebMidi.inputs, WebMidi.outputs);
        } catch (err) {
            // eslint-disable-next-line no-console
            console.error("WebMidi could not be enabled: " + JSON.stringify(err));
        }
    }

    // addHttpInput() {}

    // addHttpOutput() {}

    /**
     *
     * @param {string} channel 	- message channel
     * @param {number} note 	- message note
     * @param {number} velocity - message velocity
     * @param {number} base		- numeric base conversion
     * @returns {string}		- printable midi message
     */
    private static getPrintableOctects(messageType: number, channel: ChannelRange, note: number, velocity: number, base = 10) {
        let octects = [
            Midi.convertBase(((messageType << 4) + (channel - 1)).toString(), 10, base),
            Midi.convertBase(note.toString(), 10, base),
            Midi.convertBase(velocity.toString(), 10, base),
        ];

        switch (base) {
            case 2:
                octects = octects.map((octect) => ("00000000" + octect).substring(-8));
                break;
            case 10:
                octects = octects.map((octect) => ("000" + octect).substring(-3));
                break;
            case 16:
                octects = octects.map((octect) => ("00" + octect).substring(-2));
                break;
        }

        return octects.join(" ");
    }

    // getNote(outboard, controller) {
    //     try {
    //         return outboard.getController(controller);
    //     } catch (e) {
    //         console.error(`No "${controller}" controller configured on "${outboard.name}" device`);
    //     }
    // }

    private static convertBase(value: string, from_base: number, to_base: number) {
        const range = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ+/".split("");
        const from_range = range.slice(0, from_base);
        const to_range = range.slice(0, to_base);

        let dec_value = value
            .split("")
            .reverse()
            .reduce(function (carry, digit, index) {
                if (from_range.indexOf(digit) === -1) throw new Error("Invalid digit `" + digit + "` for base " + from_base + ".");
                return (carry += from_range.indexOf(digit) * Math.pow(from_base, index));
            }, 0);

        let new_value = "";
        while (dec_value > 0) {
            new_value = to_range[dec_value % to_base] + new_value;
            dec_value = (dec_value - (dec_value % to_base)) / to_base;
        }
        return new_value || "0";
    }

    /**
     * send midi message
     * @param {string|object} outputIdx 			- midi message type
     * @param {string} channel 				- message channel
     * @param {string} messageType 			- midi message type
     * @param {number} deviceIdx 			- midi interface index
     * @param {number} note 				- message note
     * @param {number} velocity 			- message velocity
     * @param {number} selectedOutboardIdx 	- outboard index
     */
    send(output: Output | number, channel: ChannelRange, messageType: MessageType, note: number, velocity: number, selectedOutboard: IDeviceConfig) {
        if (typeof output === "number") output = this._outputs[output];

        // let success = true;
        let messageTypeNumber: number | null = null;
        try {
            switch (messageType) {
                case "CC":
                    output.sendControlChange(note, velocity, { channels: channel });
                    messageTypeNumber = Enumerations.MIDI_CHANNEL_MESSAGES.controlchange;
                    break;
                case "PC":
                    output.sendProgramChange(note, { channels: channel });
                    messageTypeNumber = Enumerations.MIDI_CHANNEL_MESSAGES.programchange;
                    break;
                default:
                    throw new Error(`MessageType ${messageType} not handled`);
            }

            const octects = Midi.getPrintableOctects(messageTypeNumber, channel, note, velocity, 2);
            // eslint-disable-next-line no-console
            console.info("sending", octects, "through", output.name, "to", selectedOutboard.label);
            return true;
        } catch (e) {
            // success = false;
            // eslint-disable-next-line no-console
            console.error((e as Error).message);
            return false;
        } /*finally {
            document.dispatchEvent(
                new CustomEvent(`messagesend`, {
                    detail: { selectedOutboard, success },
                })
            );
        }*/
    }
}
