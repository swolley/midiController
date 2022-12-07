import type { IDeviceConfig, ILcdControllerConfigs, IMessageControllerConfigs } from "@/services/types/devices";

export function useDevice(device: IDeviceConfig) {
    let hasPatch = false;
    const lcds: ILcdControllerConfigs[] = [];
    const rotaries: IMessageControllerConfigs[] = [];
    const toggles: IMessageControllerConfigs[] = [];

    device.controllers.forEach((c) => {
        if (c.message === "PC") {
            hasPatch = true;
            lcds.push(c as ILcdControllerConfigs);
        } else if (c.type === "LCD") {
            lcds.push(c as ILcdControllerConfigs);
        } else if (c.type === "TOGGLE") {
            toggles.push(c as IMessageControllerConfigs);
        } else {
            rotaries.push(c as IMessageControllerConfigs);
        }
    });

    return {
        hasPatch,
        lcds,
        rotaries,
        toggles,
    };
}
