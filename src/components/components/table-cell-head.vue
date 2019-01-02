<template>
  <th
    :class="{clicked: allowedSort, 'sort-up': isSortedUp, 'sort-down': isSortedDown}"
    @click="onClick"
  >
  <span
    v-if="allowedSort"
    class="icon"
    :class="{'sort-up': isSortedUp, 'sort-down': isSortedDown }" />
  {{ column.title }}</th>
</template>

<script>
export default {
  name: 'TfxTableCellHead',
  props: {
    column: {
      required: true,
      type: Object
    }
  },
  data() {
    return {
      sortDirection: 0
    }
  },
  computed: {
    eventBus: {
      get() {
        return this.$parent
      }
    },
    allowedSort: {
      get() {
        return !!this.column.sort
      }
    },
    isSortedUp: {
      get() {
        return this.sortDirection > 0
      }
    },
    isSortedDown: {
      get() {
        return this.sortDirection < 0
      }
    },
  },
  mounted() {
    if (this.allowedSort) this.eventBus.$on('table-column-sort-clear', this.clearSortDirection)
  },
  methods: {
    onClick() {
      if (this.allowedSort) {
        this.sortDirection = this.sortDirection > 0 ? -1 : (this.sortDirection < 0 ? 0 : 1)
        this.eventBus.$emit('table-column-sort', {column: this.column, direction: this.sortDirection})
        this.eventBus.$emit('table-column-sort-clear', this.column)
      }
    },
    clearSortDirection(exclude) {
      if (this.column.title !== exclude.title) this.sortDirection = 0
    }
  }
}
</script>
