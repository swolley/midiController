// import { Http } from "@/services/classes/Http";
import { Midi } from "@/services/classes/Midi";
import { Outboard } from "@/services/classes/Outboard";
import RackConsole from "@/services/classes/RackConsole";
import type { DragResult, IDeviceConfig } from "@/services/types/devices";
import type { IAppStoreProps } from "@/services/types/stores";
import { defineStore } from "pinia";
import type { Output } from "webmidi";
import outboards from "../../config/outboard";

export const useRack = defineStore("rack", {
    state: (): IAppStoreProps => {
        return {
            rackDevices: [],
            availableDevices: [],
            // inputs: [],
            // outputs: [],
            midi: undefined,
            http: undefined,
            editor: undefined,
            console: undefined,
        };
    },
    getters: {
        device: (state) => (id: string) => {
            return state.rackDevices.find((d) => d.id === id);
        },
        interfaces: (state) => () => {
            return [...(state.midi ? (state.midi.activeOutputs as Output[]) : []), ...(state.http ? (state.http.activeOutputs as unknown[]) : [])];
        },
    },
    actions: {
        async init() {
            try {
                if (!this.availableDevices.length)
                    this.availableDevices = outboards.sort((a: IDeviceConfig, b: IDeviceConfig) =>
                        (a.category || "Uncategozized") < (b.category || "Uncategozized") ? 1 : -1
                    );
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
        moveDevice(dropResult: DragResult, from: "store" | "rack", to: "store" | "rack") {
            const fromRealList = from === "rack" ? this.rackDevices : this.availableDevices;
            const toRealList = to === "rack" ? this.rackDevices : this.availableDevices;
            const removed: IDeviceConfig = fromRealList.splice(dropResult.removedIndex, 1)[0];
            if (removed) toRealList.splice(dropResult.addedIndex, 0, to === "store" ? (removed as Outboard).getDeviceConfigs() : new Outboard(removed));
        },
        reorderDevices(dropResult: DragResult, list: "store" | "rack") {
            if (Number.isNaN(dropResult.addedIndex) || Number.isNaN(dropResult.removedIndex)) return;

            const realList = list === "rack" ? this.rackDevices : this.availableDevices;
            const removed = realList.splice(dropResult.removedIndex, 1)[0];
            if (list === "store") {
                // console.log({ ...removed }, list, dropResult);
                let newCategory = removed.category;
                // console.log(newCategory);
                if (dropResult.addedIndex === 0 && realList.length - 1 > dropResult.addedIndex) {
                    newCategory = realList[dropResult.addedIndex + 1].category;
                } else if (dropResult.addedIndex > 0) {
                    newCategory = realList[dropResult.addedIndex - 1].category;
                }

                removed.category = newCategory;
            }

            realList.splice(dropResult.addedIndex, 0, removed);
        },
        removeDevice(device: IDeviceConfig) {
            if (device.stock) return;
            let found = this.availableDevices.findIndex((d: IDeviceConfig) => d.id === device.id);
            if (found) {
                const removed: IDeviceConfig = this.availableDevices.splice(found, 1)[0];
                found = this.rackDevices.findIndex((d: IDeviceConfig) => d.id === removed.id);
                if (found) this.rackDevices.splice(found, 1)[0];
            }
        },
        createDevice() {
            const name = "newly-created-" + new Date().getTime().toString();
            const newDevice: IDeviceConfig = {
                backgroundColor: "transparent",
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
            this.availableDevices.push(newDevice);

            return newDevice;
        },
    },
    persist: {
        paths: ["rackDevices", "availableDevices"],
    },
});
