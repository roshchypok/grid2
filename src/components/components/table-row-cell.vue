<template>
  <td
    :class="{active: isActive}"
    @keydown="keydown($event)"
    @click="click"
    tabindex="0"
    ref="td">
    <tfx-table-cell-editor
      v-if="isEditing"
      :column="column"
      :init-value="this.editingValue" />
    <tfx-table-cell-render
      v-else
      :column="column"
      :cell="cellValue" />
  </td>
</template>

<script>
import TfxTableCellRender from './renders/table-cell-render'
import TfxTableCellEditor from './editors/table-cell-editor'
import {present, allowedKeyForAutoEditing} from './utilites'

export default {
  name: 'TfxTableRowCell',
  props: {
    row: {
      type: Number
    },
    col: {
      type: Number
    },
    column: {
      type: Object,
      default: () => {}
    },
    cellValue: {
      type: String,
      default: null
    },
    activeCell: {
      type: Object,
      default: () => {}
    }
  },
  components: {TfxTableCellRender, TfxTableCellEditor},
  data() {
    return {
      isEditing: false,
      editingValue: null
    }
  },
  computed: {
    eventBus: {
      get() {
        return this.$parent.$parent
      }
    },
    value: {
      get() {
        return this.cellValue
      }
    },
    isActive: {
      get() {
        return this.row === this.activeCell.row && this.col === this.activeCell.col
      }
    },
    isClickEditing: {
      get() {
        return this.column.type === 'list'
      }
    },
    allowAutoEditing: {
      get() {
        return !this.isEditing && !present(this.value) && !this.isClickEditing
      }
    }
  },
  methods: {
    keydown(e) {
      switch (e.key) {
        case 'Enter':
          this.isEditing ? this.endEditing() : this.startEditing()
          break
        case 'Escape':
          if (this.isEditing) this.endEditing(false)
          break
        default:
          if (this.allowAutoEditing && allowedKeyForAutoEditing(e)) this.startEditing(e.key)
      }
    },
    click() {
      if (this.isActive) {
        this.startEditing()
      } else {
        this.eventBus.$emit('table-cell-activate', this)
        if (this.isClickEditing) this.startEditing()
      }
    },
    focus() {
      this.$refs.td.focus()
    },
    activate() {
      this.eventBus.$emit('table-cell-activate', this)
      this.focus();
    },
    deactivate() {
      if (this.isEditing) this.endEditing(true)
    },
    startEditing(start) {
      this.editingValue = start || this.value
      this.isEditing = true
      this.$on('table-cell-editor-update-value', this.updateEditingValue)
      this.$on('table-cell-editor-end', this.endEditing)
    },
    endEditing(action = true) {
      this.isEditing = false
      this.$off('table-cell-editor-update-value')
      this.$off('table-cell-editor-end')
      this.focus()
      if (action && this.value !== this.editingValue) this.eventBus.$emit('table-cell-update', this.editingValue)
    },
    updateEditingValue(value) {
      this.editingValue = value
      if (this.isClickEditing) this.endEditing(true)
    }
  },
  watch: {
    isActive(value) {
      value ? this.activate() : this.deactivate()
    }
  }
}
</script>
