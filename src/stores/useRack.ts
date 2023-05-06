import { Midi } from "@/services/classes/Midi";
import RackConsole from "@/services/classes/RackConsole";
import type { DropResult, IDeviceConfig } from "@/services/types/devices";
import type { CategorizedDeviceList, IAppStoreProps } from "@/services/types/stores";
import { defineStore } from "pinia";
import type { Output } from "webmidi";
import outboards from "../../config/outboard";
import { Outboard } from "@/services/classes/Outboard";

function checkBeforeMoveDevice(list: Outboard[], from: number, to: number) {
    if (from < 0 || to < 0) throw new Error("Position cannot be negative");
    if (from > list.length) throw new Error("Position cannot be out of range");
}

export const useRack = defineStore("rack", {
    state: (): IAppStoreProps => {
        return {
            // devices
            rackDevices: [],
            availableDevices: {},
            console: undefined,
            editor: undefined,
            // connectors
            midi: undefined,
            http: undefined,
        };
    },
    getters: {
        device: (state) => (id: string) => {
            return (
                (state.rackDevices as Outboard[]).find((d) => d.id === id) ||
                Object.values(state.availableDevices)
                    .flat()
                    .find((d) => d.id === id)
            );
        },
        rackDevice: (state) => (id: string) => {
            return (state.rackDevices as Outboard[]).find((d) => d.id === id);
        },
        storeDevice: (state) => (id: string) => {
            return Object.values(state.availableDevices)
                .flat()
                .find((d) => d.id === id);
        },
        interfaces: (state) => () => {
            return [...(state.midi ? (state.midi.activeOutputs as Output[]) : []), ...(state.http ? (state.http.activeOutputs as unknown[]) : [])];
        },
    },
    actions: {
        async init() {
            try {
                if (!Object.keys(this.availableDevices).length) {
                    const groups: Record<string, Outboard[]> = {};
                    const sorted = outboards
                        .sort((a: IDeviceConfig, b: IDeviceConfig) =>
                            (a.category || "uncategozized") < (b.category || "uncategozized") && a.label < b.label ? 1 : -1
                        )
                        .map((d) => new Outboard(d));

                    sorted.forEach((device) => {
                        // if (!device.category) device.category = "uncategorized";
                        if (!((device.category as string) in groups)) {
                            groups[device.category] = [device];
                        } else {
                            groups[device.category].push(device);
                        }
                    });

                    this.availableDevices = groups;
                }
                this.console = this.console = new RackConsole();
                this.midi = await Midi.init();
                // this.http = await Http.init();
                return true;
            } catch (e) {
                // eslint-disable-next-line no-console
                console.error((e as Error).message);
                return false;
            }
        },
        moveDeviceToRack(category: keyof CategorizedDeviceList, from: number, to: number) {
            if (!(category in this.availableDevices)) throw new Error(`Category ${category} not available`);
            checkBeforeMoveDevice(this.availableDevices[category], from, to);

            const removed = this.availableDevices[category].splice(from, 1)[0];
            if (!removed) throw new Error("Unable to remove device");

            (this.rackDevice as unknown as Outboard[]).splice(to, 0, removed);
        },
        // moveDevice(dropResult: DropResult, from: "store" | "rack", to: "store" | "rack") {
        //     const fromRealList = from === "rack" ? this.rackDevices : this.availableDevices[dropResult.payload.device.category || "uncategorized"];
        //     const toRealList = to === "rack" ? this.rackDevices : this.availableDevices[dropResult.payload.device.category || "uncategorized"];
        //     const removed = fromRealList.splice(dropResult.removedIndex, 1)[0];
        //     if (removed) toRealList.splice(dropResult.addedIndex, 0, removed);
        // },
        reorderRackDevices(dropResult: DropResult) {
            if (Number.isNaN(dropResult.addedIndex) || Number.isNaN(dropResult.removedIndex)) throw new Error("Missing indexes");
            checkBeforeMoveDevice(this.rackDevices as Outboard[], dropResult.removedIndex, dropResult.addedIndex);

            const removed = this.rackDevices.splice(dropResult.removedIndex, 1)[0];
            if (!removed) throw new Error("Unable to remove device");

            this.rackDevices.splice(dropResult.addedIndex, 0, removed);
        },
        reorderCategoryDevices(dropResult: DropResult) {
            if (!("group" in dropResult.payload)) throw new Error("No group specified");
            if (!(dropResult.payload.group in this.availableDevices)) throw new Error(`Category ${dropResult.payload.group} not available`);
            if (Number.isNaN(dropResult.addedIndex) || Number.isNaN(dropResult.removedIndex)) throw new Error("Missing indexes");

            const category = this.availableDevices[dropResult.payload.group];
            category.splice(dropResult.addedIndex, 0, category.splice(dropResult.removedIndex, 1)[0]);
        },
        removeDevice(device: Outboard) {
            if (device.stock) return;
            for (const category in this.availableDevices) {
                const list = this.availableDevices[category];
                const found = list.findIndex((d: IDeviceConfig) => d.id === device.id);
                if (found !== -1) {
                    /*const removed = */ list.splice(found, 1)[0];
                    // found = this.rackDevices.findIndex((d) => d.id === removed.id);
                    // if (found) this.rackDevices.splice(found, 1)[0];
                    break;
                }
            }
        },
        createDevice(): Outboard {
            let totalDevices = 0;
            for (const category in this.availableDevices) {
                totalDevices += this.availableDevices[category].length;
            }
            const name = "newly-created-" + (totalDevices + 1);
            const newDevice: IDeviceConfig = {
                backgroundColor: "transparent",
                category: "uncategorized",
                id: name,
                label: name,
                stock: false,
                // channel: 1,
                controllers: {
                    lcds: [],
                    toggles: [],
                    rotaries: [],
                },
            };
            // console.log(newDevice);
            const instance = new Outboard(newDevice);
            this.availableDevices["uncategorized"].push(instance);

            return instance;
        },

        changeDeviceInterface(device: Outboard, outputInterface: Output | undefined) {
            device.outputInterface = outputInterface;
        },
        changeDeviceBackgroundColor(device: Outboard, backgroundColor: string) {
            device.backgroundColor = backgroundColor;
        },
        changeDevicePanelColor(device: Outboard, panelColor: string) {
            device.panelColor = panelColor;
        },
        changeDeviceBorderColor(device: Outboard, borderColor: string) {
            device.borderColor = borderColor;
        },
        changeDeviceId(device: Outboard, id: string) {
            device.id = id;
        },
        changeDeviceLabel(device: Outboard, label: string) {
            device.label = label;
        },
    },
    persist: {
        paths: ["rackDevices", "availableDevices"],
        serializer: {
            serialize(state) {
                return JSON.stringify(state);
            },
            deserialize(value) {
                const newState: IAppStoreProps = JSON.parse(value);
                newState.rackDevices = newState.rackDevices.map((d) => new Outboard(d));
                for (const category in newState.availableDevices) {
                    newState.availableDevices[category] = newState.availableDevices[category].map((d) => new Outboard(d));
                }

                return newState;
            },
        },
    },
});
