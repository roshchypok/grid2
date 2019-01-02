<template>
  <div>
    <vue-multiselect
      v-if="isListEditor"
      v-model="value"
      :options="listOptions"
      :block-keys="['Escape']"
      :showLabels="false"
      :hideSelected="false"
      :tabindex.Number="-1"
      ref="element"
    />
    <input
      v-else
      type="text"
      v-model="value"
      ref="element"
      :tabindex.Number="-1"
      >
  </div>
</template>

<script>
import VueMultiselect from 'vue-multiselect'
import {present} from './../utilites'

export default {
  name: 'TfxTableCellEditor',
  components: {VueMultiselect},
  props: {
    column: {
      required: true,
      type: Object
    },
    initValue: {
      required: true,
      type: String
    }
  },
  data() {
    return {
      value: null,
      firstTime: true
    }
  },
  mounted() {
    this.value = this.initValue
    if (this.isListEditor) {
      this.$refs.element.activate()
    } else {
      this.$refs.element.focus()
    }
  },
  computed: {
    isListEditor: {
      get() {
        return this.column.type === 'list'
      }
    },
    listOptions: {
      get() {
        return this.isListEditor ? this.column.options() : []
      }
    }
  },
  methods: {
    selectOption() {
      this.$parent.$emit('table-cell-editor-end', true)
    }
  },
  watch: {
    value(value) {
      if (!this.firstTime) this.$parent.$emit('table-cell-editor-update-value', this.value)
      this.firstTime = false
    }
  }
}
</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
