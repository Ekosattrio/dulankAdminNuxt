<script setup lang="ts">
import feather from "feather-icons";

const props = withDefaults(
  defineProps<{
    name: string;
    size?: number | string;
    strokeWidth?: number | string;
    class?: string;
  }>(),
  {
    size: 18,
    strokeWidth: 2,
    class: "",
  },
);

const svgContent = computed(() => {
  const fi = (feather as any)?.icons || (feather as any)?.default?.icons || (feather as any);
  const icon = fi ? fi[props.name] : null;
  if (!icon) {
    return "";
  }
  return icon.toSvg({
    width: props.size,
    height: props.size,
    "stroke-width": props.strokeWidth,
    class: `inline-block align-middle ${props.class}`,
  });
});
</script>

<template>
  <span v-if="svgContent" class="feather-icon-wrapper inline-flex items-center justify-center leading-none" v-html="svgContent" />
  <i v-else :class="props.class" />
</template>
