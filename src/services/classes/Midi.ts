import { Enumerations, Input, InputChannel, Output, WebMidi } from "webmidi";
import type { ChannelRange, IComunicatorInterface, IDeviceConfig, MessageType } from "../types/devices";
import AbstractComunicator from "./AbstractComunicator";

export class Midi extends AbstractComunicator implements IComunicatorInterface {
    public static async init(disabled?: string[]): Promise<Midi | undefined> {
        try {
            await WebMidi.enable({ sysex: true });
            // eslint-disable-next-line no-console
            console.info("WebMidi enabled ", true);
            // eslint-disable-next-line no-console
            console.info("Sysex enabled ", WebMidi.interface.sysexEnabled);

            WebMidi.inputs.forEach((entry) => {
                entry.addListener("midimessage", (e) =>
                    Midi.onMIDIMessage(
                        e.target,
                        e.message.type as MessageType,
                        ((e as unknown as Record<string, unknown>).dataBytes as [number, number])[0],
                        ((e as unknown as Record<string, unknown>).dataBytes as [number, number])[1]
                    )
                );
            });

            return new Midi(WebMidi.inputs, WebMidi.outputs, disabled);
        } catch (err) {
            // eslint-disable-next-line no-console
            console.error("WebMidi could not be enabled: " + JSON.stringify(err));
        }
    }

    public isSysexEnabled(): boolean {
        return WebMidi.interface.sysexEnabled;
    }

    public send(
        output: Output | number,
        channel: ChannelRange,
        messageType: MessageType,
        note: number,
        velocity: number,
        selectedOutboard: IDeviceConfig
    ): boolean {
        if (typeof output === "number") output = this._outputs[output];

        let messageTypeNumber: number | null = null;
        try {
            switch (messageType) {
                case "controlchange":
                    output.sendControlChange(note, velocity, { channels: channel });
                    messageTypeNumber = Enumerations.MIDI_CHANNEL_MESSAGES.controlchange;
                    break;
                case "programchange":
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
            // eslint-disable-next-line no-console
            console.error((e as Error).message);
            return false;
        }
    }

    private static onMIDIMessage(input: Input | InputChannel, messageType: MessageType, note: number, velocity: number) {
        // let str = `MIDI message received at timestamp ${event.timeStamp}[${event.data.length} bytes]: `;
        // for (const character of event.data) {
        //     str += `0x${character.toString(16)} `;
        // }
        // console.log(str);

        switch (messageType) {
            case "controlchange":
            case "programchange":
            case "noteon":
                console.log(messageType, note, velocity);
                break;
            // case "sysex":
            //     console.log(messageType, note, velocity);
        }
    }
}
