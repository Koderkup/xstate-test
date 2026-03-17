<template>
    <div class="lms-left-sidebar-collapsed"
         @click.stop="$emit('click')"
         v-tooltip="collapsed ? 'Развернуть' : 'Свернуть'">
        <ArrowLeft v-if="collapsed"/>
        <ArrowRight v-else/>
    </div>
</template>

<script setup lang="ts">
import ArrowLeft from "@/shared/assets/icons/chevrone-left.svg";
import ArrowRight from "@/shared/assets/icons/shevrone-right.svg";

defineProps({
    collapsed: {
        type: Boolean,
    }
});
defineEmits(['click']);
</script>


<style scoped lang="scss">
.lms-left-sidebar-collapsed {
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 5px;
    width: 28px;
    height: 40px;
    color: #ffffff;
    background-color: #003A67;
    transition: 0.3s ease all;
}

.lms-left-sidebar-collapsed:hover {
    background-color: #002542;
}

.lms-left-sidebar-collapsed:active {
    background-color: #00467E;
}
</style>