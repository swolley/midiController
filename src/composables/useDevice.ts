import type { IDeviceConfig, ILcdControllerConfigs, IMessageControllerConfigs } from "@/services/types/devices";

export function useDevice(device: IDeviceConfig) {
    let hasPatch = false;
    const lcds: ILcdControllerConfigs[] = device.controllers.lcds;
    const rotaries: IMessageControllerConfigs[] = device.controllers.rotaries;
    const toggles: IMessageControllerConfigs[] = device.controllers.toggles;

    for (const controller of device.controllers.lcds) {
        if (controller.message === "programchange") {
            hasPatch = true;
            break;
            // lcds.push(c as ILcdControllerConfigs);
        } /* else if (c.type === "LCD") {
            lcds.push(c as ILcdControllerConfigs);
        } else if (c.type === "TOGGLE") {
            toggles.push(c as IMessageControllerConfigs);
        } else {
            rotaries.push(c as IMessageControllerConfigs);
        }*/
    }

    return {
        hasPatch,
        lcds,
        rotaries,
        toggles,
    };
}
