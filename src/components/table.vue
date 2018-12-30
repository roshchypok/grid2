<template>
  <div class="tfx-table">
    <table
      :class="{active: active}"
      tabindex="0"
      @keydown="keydown($event)"
      @focus="onFocus"
      @blur="onBlur"
      v-click-outside="onClickOutside">
      <caption v-if="showCaption">{{ caption }}</caption>
      <thead v-if="showHead">
        <tr>
          <th v-if="showRowNumber">&nbsp;</th>
          <tfx-table-cell-head
            v-for="(column, index) in columns"
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
          :show-delete-button="showDeleteButton"/>
      </tbody>
    </table>
  </div>
</template>

<script>
import Vue from 'vue'
import TfxTableRow from './table-row'
import TfxTableCellHead from './table-cell-head'
import {keyArrowEvent, present, defaultCompare} from './utilites'

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
    columns: {
      required: true,
      type: Array,
      default: () => []
    },
    tableData: {
      required: true,
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      rows: [],
      activeCell: {col: -1, row: -1},
      cell: null,
      active: false,
      sort: {
        column: null,
        direction: 0
      }
    }
  },
  mounted() {
    this.eventBus.$on('table-cell-activate', this.changeActiveCell)
    this.eventBus.$on('table-cell-update', this.updateCellValue)
    this.eventBus.$on('table-row-remove', this.removeRow)
    this.eventBus.$on('table-column-sort', this.onSort)
    Vue.set(this, 'rows',  this.tableData)
    this.rows.forEach((row, index) => row.index = index)
    const allowAddEmptyRow = this.rows[this.rows.length -1].some((v) => present(v))
    if (allowAddEmptyRow) this.addEmptyRow()
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
    countCols: {
      get() {
        return this.columns.length
      }
    },
    maxColIndex: {
      get() {
        return this.columns.length - 1
      }
    },
    allowNavigateCell: {
      get() {
        return !this.cell || !this.cell.isEditing
      }
    }
  },
  methods: {
    keydown(e) {
        const key = keyArrowEvent(e)

        if (key && this.allowNavigateCell) {
          if (key === 'ArrowDown' && this.activeCell.row < (this.countRows - 1)) this.activeCell.row = this.activeCell.row + 1
          if (key === 'ArrowUp' && this.activeCell.row > 0) this.activeCell.row = this.activeCell.row - 1
          if (key === 'ArrowLeft' && this.activeCell.col > 0) this.activeCell.col = this.activeCell.col - 1
          if (key === 'ArrowRight' && this.activeCell.col < (this.countCols - 1)) this.activeCell.col = this.activeCell.col + 1
          if (this.activeCell.row < 0) this.activeCell.row = 0
          if (this.activeCell.col < 0) this.activeCell.col = 0
        } else if (e.key === 'Tab') {
          console.log('Tab')
          //this.cellActive.col < this.maxColIndex ? this.gotoCol(1) : this.cellActive.col
        }
    },
    changeActiveCell(cell) {
      this.activeCell.row = cell.row
      this.activeCell.col = cell.col
      this.cell = cell
      this.active = true
    },
    updateCellValue(value) {
      Vue.set(this.rows[this.activeCell.row],String(this.activeCell.col), value)
      if (this.activeCell.row === (this.countRows - 1)) {
        const allowAddEmptyRow = this.rows[this.rows.length - 1].some((v) => present(v))
        this.addEmptyRow()
      }
      console.log(this.countRows)
      console.log(this.rows)
    },
    addEmptyRow() {
      const emptyRow = []
      this.rows[0].forEach((c) => emptyRow.push(''))
      emptyRow.index = this.rows.length
      this.rows.push(emptyRow)
    },
    removeRow(index) {
      this.rows.splice(index, 1)
    },
    onFocus() {
      this.active = true
    },
    onBlur() {
      console.log('table blur')
    },
    onClickOutside() {
      if (this.active) {
        if (this.cell.isEditing) this.cell.endEditing(true)
        this.active = false
      }
    },
    onSort({column, direction}) {
      console.log('sort')
      const sortIndex = this.columns.indexOf(column)
      this.rows.sort((a, b) => {
        if (a.every((v) => !present(v))) return 1
        if (a[sortIndex] > b[sortIndex]) return 1 * direction
        if (a[sortIndex] < b[sortIndex]) return -1 * direction
        return 0
      })
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
