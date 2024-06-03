<template>
  <div
    :style="{ backgroundColor: color.background, color: color.color }"
    class="badge"
  >
    <slot></slot>
  </div>
</template>
<script>
export default {
  props: {
    color: {
      type: Object,
      default: {
        color: '#8f44e1',
        background: 'white',
      },
    },
  },
};
</script>

<style scoped>
.badge {
  padding: 3px 6px;
  display: inline-flex;
  align-items: center;
  border-radius: 8px;
  font-weight: 600;
}
</style>
