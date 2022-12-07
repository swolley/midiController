<script lang="ts" setup>
import DeviceContainer from "./DeviceContainer.vue";
import type { IMessageControllerConfigs, ILcdControllerConfigs, LedStatus } from "@/services/types/devices";
import { useColors } from "@/composables/useColors";
import { ref } from "vue";
import { useDevice } from "@/composables/useDevice";
import UploadIcon from "../icons/UploadIcon.vue";
import DownloadIcon from "../icons/DownloadIcon.vue";
import LightLed from "../controllers/LightLed.vue";
import type { Midi } from "@/services/classes/Midi";
import ToggleButton from "../controllers/ToggleButton.vue";
import LcdDisplay from "../controllers/LcdDisplay.vue";
import LcdSwitch from "../controllers/LcdSwitch.vue";
import RotaryButton from "../controllers/RotaryButton.vue";
import PaletteIcon from "../icons/PaletteIcon.vue";
import type { Outboard } from "@/services/classes/Outboard";

const props = defineProps<{
    collapsable: boolean;
    collapsed: boolean;
    device: Outboard;
    midi: Midi;
}>();

const { hasPatch, lcds, rotaries, toggles } = useDevice(props.device);
const outPanel = useColors(props.device.backgroundColor);
const overPanel = useColors(props.device.panelColor && props.device.panelColor !== "transparent" ? props.device.panelColor : props.device.backgroundColor);
const lightStatus = ref<LedStatus>("off");
const midiChannels = Array.from(Array(16).keys(), (n) => n + 1);
const selectedInterface = ref<number>(0);

const lastNote = ref<number | undefined>();
const lastValue = ref<string | undefined>();

let blinkTimeout: number | null = null;
let displayTimeout: number | null = null;

function changeInteface(e: Event) {
    selectedInterface.value = parseInt((e.target as HTMLSelectElement).value);
}

function handleBlink(sent: boolean) {
    if (blinkTimeout) clearTimeout(blinkTimeout);
    lightStatus.value = sent ? "success" : "error";
    blinkTimeout = setTimeout(() => (lightStatus.value = "off"), 100);
}
function handleDisplay(value: string, note?: number) {
    if (displayTimeout) clearTimeout(displayTimeout);
    lastValue.value = value;
    lastNote.value = note;
    displayTimeout = setTimeout(() => {
        lastValue.value = undefined;
        lastNote.value = undefined;
    }, 300);
}

function dispatchToggle(controller: IMessageControllerConfigs, active: boolean) {
    handleDisplay(active ? "on" : "off", controller.note);
    const sent = props.midi.send(
        props.midi.outputs[selectedInterface.value],
        props.device.channel,
        controller.message,
        controller.note,
        active ? controller.maxValue || 127 : controller.minValue || 0,
        props.device
    );
    handleBlink(sent);
}

function dispatchPCMessage(controller: ILcdControllerConfigs, value: number) {
    if (value >= (controller.minValue || 0) && value <= (controller.maxValue || 127)) {
        const sent = props.midi.send(props.midi.outputs[selectedInterface.value], props.device.channel, controller.message, value, value, props.device);
        handleBlink(sent);
    }
}
function dispatchCCMessage(controller: IMessageControllerConfigs, value: number) {
    if (value >= (controller.minValue || 0) && value <= (controller.maxValue || 127)) {
        handleDisplay(value + "", controller.note);
        const sent = props.midi.send(
            props.midi.outputs[selectedInterface.value],
            props.device.channel,
            controller.message,
            controller.note,
            value,
            props.device
        );
        handleBlink(sent);
    }
}
</script>

<template>
    <DeviceContainer
        :background="device.backgroundColor"
        :collapsable="collapsable"
        :collapsed="collapsed"
        display="vertical"
        :data-id="device.id"
        :label="device.label"
        class="device-container"
    >
        <template v-slot:header>
            <div class="flex items-center gap-2">
                <LightLed :status="lightStatus" class="mr-2" />
                <template v-if="midi.isSysexEnabled() && hasPatch">
                    <button class="btn btn-outline h-6 aspect-square" :class="{ invert: outPanel.isFgInverted }" title="Send Sysex message">
                        <UploadIcon />
                    </button>
                    <button class="btn btn-outline h-6 aspect-square" :class="{ invert: outPanel.isFgInverted }" title="Send Sysex message">
                        <DownloadIcon />
                    </button>
                </template>
                <select class="btn border-3d text-xs uppercase h-6" :class="{ invert: outPanel.isFgInverted }" title="Set Midi input/output Interface">
                    <option v-for="(output, idx) in midi.outputs" :key="idx" :value="idx" @change="changeInteface">
                        {{ (output.manufacturer ? output.manufacturer + " - " : "") + output.name }}
                    </option>
                </select>
                <select class="btn border-3d text-xs uppercase h-6" :class="{ invert: outPanel.isFgInverted }" title="Set Midi channel">
                    <option v-for="channel in midiChannels" :key="channel" :value="channel">
                        {{ "Channel " + channel }}
                    </option>
                </select>
                <button class="btn btn-outline h-6 aspect-square" :class="{ invert: outPanel.isFgInverted }" title="Open Device Settings">
                    <PaletteIcon @click="$emit('openeditor')" />
                </button>
            </div>
        </template>

        <div class="flex justify-between grow mt-2 gap-3">
            <div class="flex flex-col xl:flex-row gap-1 items-center justify-end xl:w-42">
                <LcdSwitch
                    v-for="(lcd, idx) in lcds"
                    :key="idx"
                    :controller="lcd"
                    :invert="outPanel.isFgInverted"
                    @changevalue="(value) => dispatchPCMessage(lcd, value)"
                />
                <LcdDisplay class="hidden lg:flex" :invert="outPanel.isFgInverted" label="value" :value="lastValue" :note="lastNote" />
            </div>
            <div
                class="flex flex-col xl:flex-row py-2 px-3 rounded-lg gap-2 items-start lg:items-center justify-center mx-5"
                :class="{ 'shadow-md': device.borderSize || (device.panelColor && device.panelColor !== 'transparent') }"
                :style="{
                    'background-color': device.panelColor || 'transparent',
                    'border-width': `${device.borderSize || 0}px`,
                    'border-color': device.borderColor || 'transparent',
                    'border-style': 'solid',
                }"
            >
                <div class="grid gap-2 grid-flow-col" v-if="toggles.length">
                    <ToggleButton
                        v-for="(toggle, idx) in toggles"
                        class="w-16"
                        :key="idx"
                        @changevalue="(active) => dispatchToggle(toggle, active)"
                        :label="toggle.label"
                        :invert="overPanel.isFgInverted"
                        :data-controller="toggle.label"
                    />
                </div>
                <div class="grid gap-3 grid-cols-6 md:grid-flow-col" v-if="rotaries.length">
                    <RotaryButton
                        class="w-16"
                        v-for="(rotary, idx) in rotaries"
                        :key="idx"
                        :controller="rotary"
                        :invert="overPanel.isFgInverted"
                        :style="device.style || 'dark'"
                        @changevalue="(active) => dispatchCCMessage(rotary, active)"
                    />
                </div>
            </div>
        </div>
    </DeviceContainer>
</template>

<style scoped lang="scss"></style>
