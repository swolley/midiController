import { Output } from "webmidi";

export default class HttpOutput extends Output {
    public host: string;

    public constructor(host: string) {
        this.host = host;
    }
}
