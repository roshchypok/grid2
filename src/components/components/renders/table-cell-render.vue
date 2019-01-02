<template>
  <span>{{ cell }}</span>
</template>

<script>
export default {
  name: 'TfxTableCellRender',
  props: {
    column: {
      required: true,
      type: Object
    },
    cell: {
      required: true,
      type: String
    }
  }
}
</script>
