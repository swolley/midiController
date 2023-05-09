import { Enumerations } from "webmidi";
import type { ChannelRange, IComunicatorInterface, IDeviceConfig, MessageType } from "@/services/types/devices";
import AbstractComunicator from "@/services/classes/AbstractComunicator";
import type HttpOutput from "@/services/classes/HttpOutput";

const consoleColor = ["%Http", "color: #dcd3bb"];

export class Http extends AbstractComunicator implements IComunicatorInterface {
    public send(output: HttpOutput | number, channel: ChannelRange, messageType: MessageType, note: number, velocity: number, selectedOutboard: IDeviceConfig) {
        if (typeof output === "number") output = this._outputs[output] as HttpOutput;

        // let success = true;
        let messageTypeNumber: number | null = null;
        try {
            switch (messageType) {
                case "controlchange":
                    output.sendControlChange(note, velocity, { channels: channel });
                    messageTypeNumber = Enumerations.CHANNEL_MESSAGES.controlchange;
                    break;
                case "programchange":
                    output.sendProgramChange(note, { channels: channel });
                    messageTypeNumber = Enumerations.CHANNEL_MESSAGES.programchange;
                    break;
                default:
                    throw new Error(`MessageType ${messageType} not handled`);
            }

            const octects = Http.getPrintableOctects(messageTypeNumber, channel, note, velocity, 2);
            // eslint-disable-next-line no-console
            console.info(...consoleColor, "sending", octects, "through", output.name, "to", selectedOutboard.label);
            return true;
        } catch (e) {
            // success = false;
            // eslint-disable-next-line no-console
            console.error(...consoleColor, (e as Error).message);
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
