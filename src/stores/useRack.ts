import { Midi } from "@/services/classes/Midi";
import { Outboard } from "@/services/classes/Outboard";
import RackConsole from "@/services/classes/RackConsole";
import type { DragResult, IDeviceConfig } from "@/services/types/devices";
import type { IAppStoreProps } from "@/services/types/stores";
import { defineStore } from "pinia";
import outboards from "../../config/outboard";

export const useRack = defineStore("rack", {
    state: (): IAppStoreProps => {
        return {
            rackDevices: [],
            availableDevices: [],
            // inputs: [],
            // outputs: [],
            midi: undefined,
            editor: undefined,
            console: undefined,
        };
    },
    getters: {
        device: (state) => (id: string) => {
            return state.rackDevices.find((d) => d.id === id);
        },
    },
    actions: {
        async init() {
            this.availableDevices = outboards;
            this.rackDevices = this.availableDevices.slice(0, -2).map((outboard) => new Outboard(outboard));
            this.console = this.console = new RackConsole();
            this.midi = await Midi.init();
        },
        moveDevice(dropResult: DragResult, from: "store" | "rack", to: "store" | "rack") {
            const fromRealList = from === "rack" ? this.rackDevices : this.availableDevices;
            const toRealList = to === "rack" ? this.rackDevices : this.availableDevices;
            toRealList.splice(dropResult.addedIndex, 0, fromRealList.splice(dropResult.removedIndex, 1)[0]);
        },
        reorderDevices(dropResult: DragResult, list: "store" | "rack") {
            if (Number.isNaN(dropResult.addedIndex) || Number.isNaN(dropResult.removedIndex)) return;

            const realList = list === "rack" ? this.rackDevices : this.availableDevices;
            const removed = realList.splice(dropResult.removedIndex, 1)[0];
            if (list === "store") {
                let newCategory = removed.category;
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
            let found = this.availableDevices.findIndex((d: IDeviceConfig) => d === device);
            if (found) {
                const removed: IDeviceConfig = this.availableDevices.slice(found, 1)[0];
                found = this.rackDevices.findIndex((d: IDeviceConfig) => d === removed);
                if (found) this.rackDevices.slice(found, 1)[0];
            }
        },
        createDevice() {
            const newDevice: IDeviceConfig = {
                backgroundColor: "transparent",
                id: "newly-created-" + new Date().getTime().toString(),
                label: "",
                stock: false,
                channel: 1,
                controllers: [],
            };
            console.log(newDevice);
            this.availableDevices.push(newDevice);

            return newDevice;
        },
    },
    persist: {
        paths: ["rackDevices", "availableDevices"],
    },
});
