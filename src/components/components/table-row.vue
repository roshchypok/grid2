<template>
  <tr :class="{active: isActive}">
    <td v-if="showRowNumber">{{ index + 1 }}</td>
    <tfx-table-row-cell
      v-for="(column, colIndex) in columns"
      :key="colIndex"
      :column="column"
      :row="index"
      :col="colIndex"
      :cell-value="row[colIndex]"
      :active-cell="activeCell"
      />
    <td v-if="showDeleteButton">
      <button
        :disabled="!allowDelete" 
        @click="remove">Del</button>
    </td>
  </tr>
</template>

<script>
import TfxTableRowCell from './table-row-cell'
import {emptyRow} from './utilites'

export default {
  name: 'TfxTableRow',
  components: {TfxTableRowCell},
  props: {
    showRowNumber: {
      type: Boolean
    },
    showDeleteButton: {
      type: Boolean
    },
    index: {
      type: Number
    },
    columns: {
      type: Array,
      default: () => []
    },
    row: {
      type: Array,
      default: () => []
    },
    activeCell: {
      type: Object,
      default: () => {}
    },
    last: {
      required: true,
      type: Boolean
    }
  },
  computed: {
    eventBus: {
      get() {
        return this.$parent
      }
    },
    isActive: {
      get() {
        return this.index === this.activeCell.row
      }
    },
    allowDelete: {
      get() {
        return !this.last && !emptyRow(this.row)
      }
    }
  },
  methods: {
    remove() {
      this.eventBus.$emit('table-row-remove', this.index)
    }
  }
}
</script>
