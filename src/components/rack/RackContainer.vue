<script lang="ts" setup>
import ToolBar from "@/components/toolbar/ToolBar.vue";
import { useRack } from "@/stores/useRack";
import OutboardsContainer from "@/components/rack/OutboardsContainer.vue";
import ConsoleDevice from "@/components/devices/ConsoleDevice.vue";
import OutboardDevice from "@/components/devices/OutboardDevice.vue";
import type { Midi } from "@/services/classes/Midi";
import { Container, Draggable } from "vue-dndrop";
import type RackConsole from "@/services/classes/RackConsole";
import type { Outboard } from "@/services/classes/Outboard";
import { useWindowSize } from "@vueuse/core";
import type { DropResult } from "@/services/types/devices";
import { ref, computed, watch, onMounted } from "vue";

defineEmits<{
    (event: "openeditor", device: Outboard): void;
    (event: "togglestore"): void;
    (event: "togglesettings"): void;
}>();

const rackStore = useRack();

const collapseAll = ref<boolean>(false);
const selectedDevice = ref<Outboard | undefined>();
const showConsole = ref<boolean>(true);

const { width } = useWindowSize();
const isDesktop = computed(() => width.value >= 1024);

function selectFirstDevice() {
    selectedDevice.value = rackStore.rackDevices.length ? (rackStore.rackDevices[0] as Outboard) : undefined;
}

function toggleCollapseAll(collapse: boolean) {
    collapseAll.value = collapse;
}

function onDrop(dropResult: DropResult) {
    if (dropResult.removedIndex === null && dropResult.addedIndex !== null) {
        rackStore.moveDeviceToRack(dropResult.payload.device, dropResult.addedIndex);
        selectedDevice.value = dropResult.payload.device;
    } else if (dropResult.removedIndex !== null && dropResult.addedIndex !== null && dropResult.payload.list === "rack") {
        rackStore.reorderRackDevices(dropResult.payload.device, dropResult.removedIndex, dropResult.addedIndex);
    }
}

function focusDevice(device: Outboard) {
    if (selectedDevice.value !== device) selectedDevice.value = device;
}

function moveBackToStore(device: Outboard) {
    rackStore.moveDeviceBackToStore(device);
    selectFirstDevice();
}

watch(
    () => selectedDevice.value,
    () => {
        if (selectedDevice.value) document.title = "App - " + selectedDevice.value.label;
    }
);

onMounted(() => {
    selectFirstDevice();
});
</script>

<template>
    <div class="h-full table">
        <div class="table-row">
            <div class="hidden md:table-cell cell lt"></div>
            <div class="table-cell cell ct">
                <!-- header -->
                <ToolBar
                    class="mx-2 my-3"
                    :show-toggle-console="isDesktop"
                    @toggleconsole="showConsole = !showConsole"
                    @togglestore="$emit('togglestore')"
                    @togglecollapseall="toggleCollapseAll"
                    @togglesettings="$emit('togglesettings')"
                />
            </div>
            <div class="hidden md:table-cell cell rt"></div>
        </div>

        <div class="table-row">
            <div class="hidden md:table-cell cell lc"></div>
            <div class="table-cell cell cc">
                <!-- box -->
                <OutboardsContainer :showConsole="showConsole">
                    <Container
                        class="h-full overflow-y-scroll"
                        :get-child-payload="(index: number) => ({ list: 'rack', device: rackStore.rackDevices[index] })"
                        :fire-related-events-only="true"
                        drag-handle-selector=".column-drag-handle"
                        group-name="devices"
                        data-index="rack"
                        orientation="vertical"
                        @drop="(drop: DropResult) => onDrop(drop)"
                        v-if="rackStore.midi !== undefined || rackStore.http !== undefined"
                    >
                        <!-- devices -->
                        <Draggable v-for="device in rackStore.rackDevices" :key="device.id">
                            <OutboardDevice
                                :background="device.backgroundColor"
                                :collapsable="true"
                                :draggable="true"
                                :collapsed="collapseAll"
                                :selected="selectedDevice !== undefined && selectedDevice.id === device.id"
                                :device="(device as Outboard)"
                                :midi="(rackStore.midi as Midi)"
                                :is-selected="selectedDevice !== undefined && selectedDevice.id === device.id"
                                @openeditor="() => $emit('openeditor', device)"
                                @removedevice="() => moveBackToStore(device as Outboard)"
                                @click="focusDevice(device as Outboard)"
                            />
                        </Draggable>
                    </Container>

                    <template v-slot:footer v-if="rackStore.console && isDesktop">
                        <!-- console -->
                        <ConsoleDevice
                            v-show="showConsole && rackStore.console"
                            :console="(rackStore.console as RackConsole)"
                            :collapsable="true"
                            :collapsed="collapseAll"
                        />
                    </template>
                </OutboardsContainer>
            </div>
            <div class="hidden md:table-cell cell rc"></div>
        </div>

        <div class="table-row">
            <div class="hidden md:table-cell cell lb"></div>
            <div class="table-cell cell cb"></div>
            <div class="hidden md:table-cell cell rb"></div>
        </div>
    </div>
</template>

<style scoped lang="scss">
.table-row {
    &:first-child,
    &:last-child {
        .cell {
            height: 61px;
        }
    }

    &:nth-child(2) {
        .cell:first-child,
        .cell:last-child {
            background-repeat: repeat-y;
        }
    }

    .cell {
        &:first-child,
        &:last-child {
            background-repeat: no-repeat;
            width: 53px;
        }

        &:nth-child(2) {
            background-repeat: repeat-x;
        }

        &.lt {
            background-image: url(/box-top-left.jpg);
        }
        &.ct {
            background-image: url(/box-top-center.jpg);
        }
        &.rt {
            background-image: url(/box-top-right.jpg);
        }
        &.lc {
            background-image: url(/box-center-left.jpg);
        }
        &.rc {
            background-image: url(/box-center-right.jpg);
        }
        &.lb {
            background-image: url(/box-bottom-left.jpg);
        }
        &.cb {
            background-image: url(/box-bottom-center.jpg);
            background-position-y: bottom;
        }
        &.rb {
            background-image: url(/box-bottom-right.jpg);
        }
    }
}
</style>
