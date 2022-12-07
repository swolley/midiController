import type { IConsoleLog, IConsole, LogType } from "@/services/types/devices";

export default class RackConsole implements IConsole {
    logs: IConsoleLog[] = [];

    public constructor() {
        Object.keys(console).forEach((method) => {
            if (RackConsole.isLogType(method)) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any, no-console
                const original = console[method as keyof Console] as (...args: any[]) => void; /*.bind(console)*/
                // eslint-disable-next-line @typescript-eslint/no-explicit-any, no-console
                (console[method as keyof Console] as (...args: any[]) => void) = (...args: any[]) => {
                    original(...args);
                    this.log(method as LogType, args);
                };
            }
        });
    }

    private static isLogType(arg: string): arg is LogType {
        return ["info", "warn", "error"].some((element) => element === arg);
    }

    private log(type: LogType, contents: unknown[]) {
        const logs = [...this.logs.slice(0, 19)];
        logs.unshift({
            type: type,
            timestamp: new Date(),
            message: contents.map((text) => (typeof text === "object" ? JSON.stringify(text) : text)).join(" "),
        });

        this.logs = logs;
    }
}
