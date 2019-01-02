<template>
  <div class="tfx-table">
    <table
      :class="{active: active}"
      tabindex="0"
      @keydown="keydown($event)"
      @focus="onFocus"
      v-click-outside="onClickOutside">
      <caption v-if="showCaption">{{ caption }}</caption>
      <thead v-if="showHead">
        <tr>
          <th v-if="showRowNumber">&nbsp;</th>
          <tfx-table-cell-head
            v-for="(column, index) in tableColumns"
            :key="index"
            :column="column" />
          <th v-if="showDeleteButton">&nbsp;</th>
        </tr>
      </thead>
      <tbody>
        <tfx-table-row
          v-for="(row, rowIndex) in rows"
          :key="rowIndex"
          :index.Number="rowIndex"
          :columns="columns"
          :row="rows[rowIndex]"
          :active-cell="activeCell"
          :show-row-number="showRowNumber"
          :show-delete-button="showDeleteButton"
          :last="rowIndex === maxRowIndex"/>
      </tbody>
    </table>
  </div>
</template>

<script>
import Vue from 'vue'
import TfxTableRow from './components/table-row'
import TfxTableCellHead from './components/table-cell-head'
import {keyArrowEvent, present, defaultCompare, importData, exportData, emptyRow} from './components/utilites'

export default {
  name: 'TfxTable',
  components: {TfxTableRow, TfxTableCellHead},
  props: {
    showCaption: {
      type: Boolean,
      default: true
    },
    caption: {
      type: String,
      default: 'TfxTable'
    },
    showHead: {
      type: Boolean,
      default: true
    },
    showRowNumber: {
      type: Boolean,
      default: true
    },
    showDeleteButton: {
      type: Boolean,
      default: true
    },
    deleteConfirmation: {
      type: Function,
      default: null
    },
    columns: {
      required: true,
      type: Array,
      default: () => []
    },
    tableData: {
      required: true,
      type: Array,
      default: () => []
    },
    change: {
      required: true,
      type: Object | Function
    },
    afterSortChange: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      rows: [],
      activeCell: {col: -1, row: -1},
      cell: null,
      active: false,
      tableColumns: []
    }
  },
  mounted() {
    this.initEvents()
    this.initRows()
  },
  computed: {
    eventBus: {
      get() {
        return this
      }
    },
    countRows: {
      get() {
        return this.rows.length
      }
    },
    maxRowIndex: {
      get() {
        return this.countRows - 1
      }
    },
    countCols: {
      get() {
        return this.columns.length
      }
    },
    maxColIndex: {
      get() {
        return this.countCols - 1
      }
    },
    allowNavigateCell: {
      get() {
        return !this.cell || !this.cell.isEditing
      }
    }
  },
  methods: {
    initEvents() {
      this.eventBus.$on('table-cell-activate', this.changeActiveCell)
      this.eventBus.$on('table-cell-update', this.updateCellValue)
      this.eventBus.$on('table-row-remove', this.onRemoveRow)
      this.eventBus.$on('table-column-sort', this.onSort)
    },
    initRows() {
      const imps = importData(this.columns, this.tableData)
      Vue.set(this, 'rows',  imps.rows)
      Vue.set(this, 'tableColumns', imps.columns)
      this.rows.forEach((row, index) => row.index = index)
      if (!emptyRow(this.rows[this.maxRowIndex])) this.addEmptyRow()
    },
    keydown(e) {
        const key = keyArrowEvent(e)
        if (key && this.allowNavigateCell) {
          if (key === 'ArrowDown' && this.activeCell.row < this.maxRowIndex) this.activeCell.row = this.activeCell.row + 1
          if (key === 'ArrowUp' && this.activeCell.row > 0) this.activeCell.row = this.activeCell.row - 1
          if (key === 'ArrowLeft' && this.activeCell.col > 0) this.activeCell.col = this.activeCell.col - 1
          if (key === 'ArrowRight' && this.activeCell.col < this.maxColIndex) this.activeCell.col = this.activeCell.col + 1
          if (this.activeCell.row < 0) this.activeCell.row = 0
          if (this.activeCell.col < 0) this.activeCell.col = 0
        }
    },
    changeActiveCell(cell) {
      this.activeCell.row = cell.row
      this.activeCell.col = cell.col
      this.cell = cell
      this.active = true
    },
    updateCellValue(value) {
      Vue.set(this.rows[this.activeCell.row],String(this.activeCell.col), value || '')
      if (this.activeCell.row === this.maxRowIndex && !emptyRow(this.rows[this.maxRowIndex])) this.addEmptyRow()
      this.onChange()
    },
    addEmptyRow() {
      const emptyRow = []
      this.rows[0].forEach((c) => emptyRow.push(''))
      emptyRow.index = this.rows.length
      this.rows.push(emptyRow)
    },
    onRemoveRow(index) {
      if (this.deleteConfirmation) {
        this.deleteConfirmation(this.rows[index], () => this.removeRow(index))
      } else {
        this.removeRow(index)
      }
    },
    removeRow(index) {
      this.rows.splice(index, 1)
      this.onChange()
    },
    onFocus() {
      this.active = true
    },
    onClickOutside() {
      if (this.active) {
        if (this.cell.isEditing) this.cell.endEditing(true)
        this.active = false
      }
    },
    onSort({column, direction}) {
      const sortIndex = direction === 0 ? 'index' : this.tableColumns.indexOf(column)
      const sortDirection = direction === 0 ? 1 : direction
      this.rows.sort((a, b) => {
        if (emptyRow(a)) return 1
        if (a[sortIndex] > b[sortIndex]) return 1 * sortDirection
        if (a[sortIndex] < b[sortIndex]) return -1 * sortDirection
        return 0
      })
      if (this.afterSortChange) this.onChange()
    },
    onChange() {
      const onChangeData = exportData(this.columns, this.rows)
      if (typeof(this.change) === 'function') {
        this.change(onChangeData)
      } else {
        if (this.change.onChange) this.change.onChange(onChangeData)
      }
    }
  }
}
</script>

<style lang="scss">
.tfx-table {
  table {
    width: 100%;
    border-spacing: 0;
    border-collapse: collapse;

    caption: {
      font-weight: bold;
    }

    thead {

      tr {

        th {
          text-align: center;
          font-weight: bold;

          span {
            &:after {
              content: '='
            }

            &.sort-up {
              &:after {
                content: '∧'
              }
            }

            &.sort-down {
              &:after {
                content: '∨'
              }
            }
          }
        }
      }
    }

    tbody {

      tr {

        td {
          border: solid 1px #eeeeee;
          padding: 5px 5px;

          &:focus {
            outline: none;
          }
        }
      }
    }

    &.active {

      tbody {

        tr {

          &.active {
            background-color: #bbbbbb;

            td {
              background-color: #bbbbbb;

              &.active {
                background-color: yellow;
                border-color: blue;
              }
            }
          }

        }
      }
    }
  }
}
</style>
