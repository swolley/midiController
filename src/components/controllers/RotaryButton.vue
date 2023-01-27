<script setup lang="ts">
import type { IMessageControllerConfigs, RotaryStyle } from "@/services/types/devices";
import { ref, computed, onMounted, onUnmounted } from "vue";
import ControllerLabel from "./ControllerLabel.vue";
import { getOffset } from "./../../services/classes/Utils";

const emit = defineEmits(["changevalue"]);
const props = withDefaults(
    defineProps<{
        controller: IMessageControllerConfigs;
        invert: boolean;
        beginDeg?: number;
        lengthDeg?: number;
        // snapInMotion?: boolean;
        // minimumOverMaximum?: boolean;
        // step?: number;
        style: RotaryStyle;
    }>(),
    {
        beginDeg: 45,
        lengthDeg: 270,
        // snapInMotion: false,
        // minimumOverMaximum: true,
        // step: 1,
    }
);
const rotary = ref<HTMLElement>();

const currentValue = ref<number>(props.controller.value || props.controller.minValue || 0);
const steps = (props.controller.maxValue || 127) - (props.controller.minValue || 0);
const maxDeg = props.beginDeg + props.lengthDeg;
const degPerStep = props.lengthDeg / steps;
const rotate = computed(() => currentValue.value * degPerStep - props.beginDeg - 90);
const rotateStyle = computed(() => `${rotate.value}deg`);

let startY = 0;
let direction = 0;
let movement = 0;
let isChanging = false;

let changeTimeout: number | null = null;

function onMouseWheel(e: WheelEvent) {
    if (e.deltaY < 0 && currentValue.value < (props.controller.maxValue || 127)) {
        currentValue.value++;
    } else if (currentValue.value > (props.controller.minValue || 0)) {
        currentValue.value--;
    }
    console.log(currentValue.value, rotate.value);
}
function onMouseDown(e: MouseEvent) {
    if (changeTimeout) clearTimeout(changeTimeout);
    if (e.ctrlKey) {
        resetToMiddleValue();
    } else {
        startMouseRotation(e);
    }
}
function onMouseMove(e: MouseEvent) {
    const degrees = calculateMoveDeg(e.pageY);
    if (degrees !== movement) {
        isChanging = true;
        movement = degrees;
        currentValue.value = Math.round(degrees / degPerStep);
    }
}
function onMouseUp() {
    document.removeEventListener("mouseup", onMouseUp);
    document.removeEventListener("mousemove", onMouseMove);
    if (isChanging) {
        isChanging = false;
        changeTimeout = setTimeout(() => {
            emit("changevalue", currentValue.value);
            changeTimeout = null;
        }, 250);
    }
}
function startMouseRotation(e: MouseEvent) {
    startY = e.pageY;
    direction = rotary.value && e.pageX > getOffset(rotary.value || null).left ? -1 : 1;
    document.addEventListener("mouseup", onMouseUp);
    document.addEventListener("mousemove", onMouseMove);
}
function resetToMiddleValue() {
    currentValue.value = Math.round(steps / 2);
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
    let diff = (startY + mouseY * direction) % 360;
    if (diff > maxDeg /*|| (startY - mouseY) / 360 > 1*/) {
        diff = maxDeg;
    } else if (diff < props.beginDeg) {
        diff = props.beginDeg;
    }

    const steps = Math.round(diff / degPerStep);
    const degrees = steps * degPerStep;

    console.log("diff:", diff, "degrees:", degrees, "steps:", steps, "minDeg:", props.beginDeg, "maxDeg:", maxDeg);
    return steps * degPerStep;
}

onMounted(() => {
    if (rotary.value) rotary.value.addEventListener("wheel", onMouseWheel);
});
onUnmounted(() => {
    if (rotary.value) rotary.value.removeEventListener("wheel", onMouseWheel);
});
</script>

<template>
    <div class="rotary-controller flex flex-col items-center" :title="controller.label">
        <div
            ref="rotary"
            class="rotaryswitchPlugin"
            :class="style"
            @mousedown.prevent="onMouseDown"
            @touchstart.prevent="onTouchStart"
            @dblclick.prevent="resetToMiddleValue"
        >
            <input
                type="number"
                :min="controller ? controller.minValue : 0"
                :max="controller ? controller.maxValue : 127"
                v-model="currentValue"
                :hidden="true"
            />
            <div class="switch" :style="{ transform: `rotate(${rotateStyle})` }"></div>
        </div>
        <ControllerLabel v-if="controller" :label="controller.label" :invert="invert" />
    </div>
</template>

<style scoped lang="scss">
.rotaryswitchPlugin {
    @apply relative cursor-pointer shadow-md rounded-full active:cursor-ns-resize;
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
