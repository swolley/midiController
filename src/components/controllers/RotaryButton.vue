<script setup lang="ts">
/* inspired by jquery.rotaryswitch.js Version 1.0.1

Copyright 2014 Red White Silver GmbH

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

import type { IMessageControllerConfigs, RotaryStyle } from "@/services/types/devices";
import { ref, computed } from "vue";
import ControllerLabel from "./ControllerLabel.vue";

const emit = defineEmits(["changevalue"]);
const props = withDefaults(
    defineProps<{
        controller: IMessageControllerConfigs;
        invert: boolean;
        beginDeg?: number;
        lengthDeg?: number;
        snapInMotion?: boolean;
        // minimumOverMaximum?: boolean;
        step?: number;
        style: RotaryStyle;
    }>(),
    {
        beginDeg: 45,
        lengthDeg: 270,
        snapInMotion: false,
        // minimumOverMaximum: true,
        step: 1,
    }
);
const currentValue = ref<number>((props.controller.value || props.controller.minValue || 0) / 360);
const rotary = ref<HTMLElement>();
const steps = Math.abs((props.controller.maxValue || 0) - (props.controller.minValue || 127));
const maxDeg = props.beginDeg + props.lengthDeg;
const degPerStep = props.lengthDeg / steps;
const rotate = ref<number>(props.beginDeg);
const rotateStyle = computed(() => `${currentValue.value - props.beginDeg - 90}deg`);
let startY = 0;

function onMouseDown(e: MouseEvent) {
    startY = e.pageY;
    document.addEventListener("mouseup", onMouseUp);
    document.addEventListener("mousemove", onMouseMove);
}
function onMouseUp() {
    document.removeEventListener("mouseup", onMouseUp);
    document.removeEventListener("mousemove", onMouseMove);
}
function onMouseMove(e: MouseEvent) {
    rotate.value = calculateMoveDeg(e.pageY);
}

function onTouchStart(event: TouchEvent) {
    event.preventDefault();
    // mousePosition.x = event./*originalEvent.*/ targetTouches[0].pageX;
    // mousePosition.y = event./*originalEvent.*/ targetTouches[0].pageY;
    // startHandling(event.target as EventTarget);
}
// function onTouchEnd(event: TouchEvent) {
//     stopHandling(event.target as EventTarget);
// }
// function onTouchMove(event: TouchEvent) {
//     event.preventDefault();
//     mousePosition.x = event./*originalEvent.*/ targetTouches[0].pageX;
//     mousePosition.y = event./*originalEvent.*/ targetTouches[0].pageY;
//     calculateSwitchDeg();
//     calculateValueByDeg();
//     rotateSwitch(false);
//     setValueToInput();
// }

// function startHandling(target: EventTarget) {
//     calculateSwitchDeg();
//     calculateValueByDeg();
//     rotateSwitch(false);
//     setValueToInput();
//     document.addEventListener("mouseup", onMouseUp.bind(target));
//     document.addEventListener("mousemove", onMouseMove.bind(target));
//     document.addEventListener("touchend", onTouchEnd.bind(target));
//     document.addEventListener("touchmove", onTouchMove.bind(target));
//     // this.domElements.main.addClass("active");
// }
// function stopHandling(target: EventTarget) {
//     document.removeEventListener("mouseup", onMouseUp.bind(target));
//     document.removwitchDeg = 0;
// let valueInPercent = 0;
// let lastTriggeredValue = -1;entListener("mousemove", onMouseMove.bind(target));
//     document.removeEventListener("touchend", onTouchEnd.bind(target));
//     document.removeEventListener("touchmove", onTouchMove.bind(target));
//     rotateSwitch(true);
//     // this.domElements.main.removeClass("active");
// }

// function setValueToInput() {
//     if (currentValue.value !== lastTriggeredValue) {
//         lastTriggeredValue = currentValue.value;
//         // this.element.val(currentValue.value).trigger({ type: "change", plugin: this });
//     }
// }

// function calculateSwitchDeg() {
//     var offset = rotary.value.offsetTop,
//         radians = Math.atan2(mousePosition.x - (offset.left + rotary.value.outherWidth / 2), mousePosition.y - (offset.top + rotary.value.outherHeight / 2));

//     if (mousePosition.x !== -1) {
//         switchDeg = radians * (180 / Math.PI) * -1 + 180;
//     }
// }

// // eslint-disable-next-line sonarjs/cognitive-complexity
// function calculateValueByDeg() {
//     const minimum = props.controller.minValue || 0;
//     const maximum = props.controller.maxValue || 127;
//     const range = maximum - minimum;
//     let value = 0;

//     valueInPercent = switchDeg - props.beginDeg > 0 ? (switchDeg - props.beginDeg) / props.lengthDeg : (switchDeg - props.beginDeg + 360) / props.lengthDeg;

//     if (valueInPercent > 1) valueInPercent = valueInPercent > (360 / props.lengthDeg - 1) / 2 + 1 ? 0 : 1;

//     value = ~~((range * valueInPercent < 0 ? -0.5 : 0.5) + (range * valueInPercent) / props.step) * props.step;
//     value += props.controller.minValue || 0;

//     if (props.lengthDeg === 360 && (value === minimum || value === maximum)) {
//         currentValue.value = props.minimumOverMaximum ? minimum : maximum;
//         emit("changevalue", currentValue.value);
//     }
// }

// function rotateSwitch(snap: boolean) {
//     let deg = 0;
//     const exactDeg = valueInPercent * props.lengthDeg;
//     const roundedDeg = (currentValue.value / steps) * props.lengthDeg - (props.controller.minValue || 0) * degPerStep;
//     const difference = Math.abs(Math.abs(exactDeg) - Math.abs(roundedDeg));

//     if (snap || (props.snapInMotion && difference < degPerStep / 6)) {
//         deg = roundedDeg + props.beginDeg < 360 ? roundedDeg + props.beginDeg : roundedDeg + props.beginDeg - 360;
//     } else {
//         deg = exactDeg + props.beginDeg < 360 ? exactDeg + props.beginDeg : exactDeg + props.beginDeg - 360;
//     }

//     currentValue.value = deg;
// }
function calculateMoveDeg(mouseY: number): number {
    let diff = startY - mouseY;
    // rotate.value += diff;
    console.log(rotate.value + diff);

    // if (diff < 0) diff = diff + 360;
    const realValue = Math.round((diff % degPerStep) * degPerStep);
    if (realValue !== currentValue.value) {
        if (diff > maxDeg) {
            diff = maxDeg;
        } else if (diff < props.beginDeg) {
            diff = props.beginDeg;
        } else {
            diff = realValue;
        }
    }
    return diff;
}
</script>

<template>
    <div class="rotary-controller flex flex-col items-center" :title="controller.label">
        <div
            ref="rotary"
            class="rotaryswitchPlugin"
            :class="style"
            @mousedown.prevent="onMouseDown"
            @touchstart.prevent="onTouchStart"
            :style="{ transform: `rotate(${rotateStyle})` }"
        >
            <input
                type="number"
                :min="controller ? controller.minValue : 0"
                :max="controller ? controller.maxValue : 127"
                v-model="currentValue"
                :hidden="true"
            />
            <div class="switch"></div>
        </div>
        <ControllerLabel v-if="controller" :label="controller.label" :invert="invert" />
    </div>
</template>

<style scoped lang="scss">
.rotaryswitchPlugin {
    @apply relative cursor-pointer shadow-md rounded-full;
    width: 51px;
    height: 51px;
    background-size: 51px;
    background-repeat: no-repeat;
    &.dark {
        background-image: url(/darkBackground.png);
        .switch {
            background-image: url(/darkFront.png);
        }
    }
    &.light {
        background-image: url(/lightBackground.png);
        .switch {
            background-image: url(/lightFront.png);
        }
    }
    &.metal {
        background-image: url(/metalBackground.png);
        .switch {
            background-image: url(/metalFront.png);
        }
    }
}

.rotaryswitchPlugin .switch {
    @apply w-full h-full;
    background-size: 51px;
    background-repeat: no-repeat;
}

.rotary-controller:not(:hover) label {
    opacity: 80%;
}
</style>
