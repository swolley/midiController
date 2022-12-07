<script setup lang="ts">
import { useColors } from "@/composables/useColors";
import { computed, ref } from "vue";
import type { IDeviceConfig } from "@/services/types/devices";

const props = defineProps<{
    device: IDeviceConfig;
    showPots: boolean;
}>();

const { background, isFgInverted } = useColors(props.device.backgroundColor);
const invert = ref<boolean>(isFgInverted);
const potStyles = computed(() => props.device.style || "dark");
</script>

<template>
    <div class="device flex flex-col rounded-sm my-1.5 mx-0.5 py-2 overflow-hidden select-none" :style="{ 'background-color': background.toString() }">
        <div class="opacity-50 whitespace-nowrap text-center" :class="{ invert: invert }">
            {{ device.label || device.id }}
        </div>
        <div class="flex justify-end gap-2 px-3" v-if="showPots">
            <div class="mini-rotary" :class="potStyles">
                <div class="switch"></div>
            </div>
            <div class="mini-rotary" :class="potStyles">
                <div class="switch"></div>
            </div>
            <div class="mini-rotary" :class="potStyles">
                <div class="switch"></div>
            </div>
            <div class="mini-rotary" :class="potStyles">
                <div class="switch"></div>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
.device {
    box-shadow: 0px 1px 2px;
    background-image: url(/metal.jpg);
    background-blend-mode: soft-light;
}

.mini-rotary {
    width: 20px;
    height: 20px;
    background-size: 20px;
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

    .switch {
        @apply w-full h-full;
        background-size: 20px;
        background-repeat: no-repeat;
    }
}
</style>
