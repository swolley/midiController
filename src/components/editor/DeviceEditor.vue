<script setup lang="ts">
import type { IDeviceConfig } from "@/services/types/devices";
import { Container, Draggable } from "vue-dndrop";
import LcdIcon from "../icons/LcdIcon.vue";
import LightLed from "../controllers/LightLed.vue";
import RotaryIcon from "../icons/RotaryIcon.vue";
import IconClose from "../icons/CancelIcon.vue";
import DragIcon from "../icons/DragIcon.vue";
import PlusIcon from "../icons/PlusIcon.vue";
import TrashIcon from "../icons/TrashIcon.vue";
defineProps<{
    device: IDeviceConfig;
}>();
function onDrop(groupIndex: "rack" | "available", dropResult: Event) {
    // let result = applyDrag(groupIndex === "rack" ? props.rackDevices : props.availableDevices, dropResult);
    //   Vue.set(this.groups, groupIndex, result);
    console.log("drop from", groupIndex);
}

function applyDrag(list: IDeviceConfig[], dragResult: Event) {
    // const { removedIndex, addedIndex, payload } = dragResult;
    // if (removedIndex === null && addedIndex === null) return list;
    // const result = [...list];
    // let itemToAdd = payload;
    // if (removedIndex !== null) itemToAdd = result.splice(removedIndex, 1)[0];
    // if (addedIndex !== null) result.splice(addedIndex, 0, itemToAdd);
    // return result;
}
</script>

<template>
    <form v-if="device">
        <div class="sticky inset-x-0 top-0 left-0 bg-black/80 border border-white/5 rounded pt-1 z-10 shadow mb-1">
            <div class="flex gap-2 px-2 ml-5" v-if="device">
                <div class="flex flex-col grow">
                    <label for="id" class="form-label">id</label>
                    <input name="id" class="form-top-input" :value="device.id" />
                </div>
                <div class="flex flex-col grow">
                    <label for="deviceLabel" class="form-label">label</label>
                    <input name="deviceLabel" class="form-top-input" :value="device.label" />
                </div>
                <div class="flex flex-col grow">
                    <label for="backgroundColor" class="form-label">background color</label>
                    <div class="form-top-input flex items-center">
                        <input type="color" name="backgroundColor" class="bg-transparent grow cursor-pointer" :value="device.backgroundColor" />
                        <IconClose class="text-2xl p-1 cursor-pointer" />
                    </div>
                </div>
                <div class="flex flex-col grow">
                    <label for="panelColor" class="form-label">panel color</label>
                    <div class="form-top-input flex items-center">
                        <input type="color" name="panelColor" class="bg-transparent grow cursor-pointer" :value="device.panelColor" />
                        <IconClose class="text-2xl p-1 cursor-pointer" />
                    </div>
                </div>
                <div class="flex flex-col grow">
                    <label for="borderColor" class="form-label">border color</label>
                    <div class="form-top-input flex items-center">
                        <input type="color" name="borderColor" class="bg-transparent grow cursor-pointer" :value="device.borderColor" />
                        <IconClose class="text-2xl p-1 cursor-pointer" />
                    </div>
                </div>
            </div>
            <hr class="h-px my-2 ml-7 mr-2 border-white/10" />
        </div>
        <div class="gap-2">
            <template v-for="(controllers, type) in device.controllers" :key="type">
                <label class="form-label">{{ type }}</label>
                <Container
                    group-name="devices"
                    class="grow-0 shrink-0 gap-1 shadow-inner"
                    :data-index="'rackDevices_' + type"
                    orientation="vertical"
                    lock-axis="y"
                    non-drag-area-selector=".field"
                    drag-handle-selector=".column-drag-handle"
                >
                    <Draggable v-for="(controller, index) in controllers" :key="index">
                        <fieldset class="border rounded border-white/5 pb-2 pt-1 px-2 flex items-center mb-1 gap-x-2">
                            <DragIcon class="text-white mt-6 mb-0" />
                            <!-- <span
                                class="column-drag-handle text-white opacity-20 hover:opacity-30 transtition-opacity cursor-pointer active:cursor-move flex translate-y-1/2 pr-2"
                                >&#x2630;</span
                            > -->
                            <div class="mt-auto mb-0">
                                <!-- <label for="type" class="form-label">type</label> -->
                                <div class="flex items-center form-select gap-x-2">
                                    <div class="w-5">
                                        <RotaryIcon v-if="controller.type === 'ROTARY'" :pot-style="device.style" />
                                        <LightLed v-else-if="controller.type === 'TOGGLE'" status="off" />
                                        <LcdIcon v-else-if="controller.type === 'LCD'" :invert="false" />
                                    </div>
                                    <!-- <select disabled name="type" class="bg-transparent w-full" v-model="controller.type">
                                        <option value="LCD">lcd</option>
                                        <option value="TOGGLE">toggle</option>
                                        <option value="ROTARY">rotary</option>
                                    </select> -->
                                </div>
                            </div>
                            <div class="grow grid grid-cols-4 gap-2">
                                <div class="flex flex-col field">
                                    <label for="controllerLabel" class="form-label">label</label>
                                    <input type="text" name="controllerLabel" class="form-input" :value="controller.label" />
                                </div>
                                <div class="flex flex-col field">
                                    <label for="message" class="form-label">message</label>
                                    <select name="message" class="form-select" v-model="controller.message">
                                        <option value="programchange">Program Change</option>
                                        <option value="controlchange">Control Change</option>
                                    </select>
                                </div>
                                <div class="flex flex-col field">
                                    <label for="minValue" class="form-label">min value</label>
                                    <input type="number" name="minValue" class="form-input" :value="controller.minValue || 1" min="0" max="127" step="1" />
                                </div>
                                <div class="flex flex-col field">
                                    <label for="maxValue" class="form-label">min value</label>
                                    <input type="number" name="maxValue" class="form-input" :value="controller.maxValue || 127" min="0" max="127" step="1" />
                                </div>
                            </div>
                            <button class="btn btn-outline invert opacity-40 text-white">
                                <TrashIcon class="w-8" />
                            </button>
                        </fieldset>
                    </Draggable>
                </Container>
                <div
                    class="rounded border-2 border-dashed flex items-center justify-center px-2 py-1 m-1 mb-4 opacity-30 hover:opacity-70 transition-opacity cursor-pointer"
                >
                    <PlusIcon class="text-gray-100 text-xl" @click="$emit('createdevice')" />
                </div>
            </template>
        </div>
    </form>
</template>

<style scoped lang="scss">
.dndrop-container {
    min-height: 0;
}
</style>
