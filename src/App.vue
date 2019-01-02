<template>
  <div id="app">
    <tfx-table :columns="cols" :table-data="rows" :change="tableChange"
    :deleteConfirmation="deleteRow"
    />
    <br>
    <tfx-table :columns="cols" :table-data="rows2" :show-head="false" :change="tableChange"/>
  </div>
</template>

<script>
import TfxTable from "./components/table"

export default {
  name: 'App',
  components: {TfxTable},
  data() {
    return {
      records: [],
      cols: [
        {title: 'firs', type: 'string', width: '300', sort: true},
        {title: 'last', type: 'string', width: '300'},
        {title: 'dob', type: 'date'},
        {title: 'address', type: 'list', width: '300', options: () => ['Lviv', 'Drohobych', 'Kyiv', 'Tula', 'Magadan', 'Tokio']},
        {title: 'price', type: 'money', sort: true},
        {title: 'active', type: 'boolean'},
      ],
      rows: [
        ['Roman', 'Tara', 'Jan-20-1970', 'Drohobych', '66.66', 'true'],
        ['Roman2', 'Tara2', 'Jan-20-1970', 'Drohobych', '77.66', 'true'],
        ['Roman3', 'Tara3', 'Jan-20-1970', 'Drohobych', '88.66', 'true'],
        ['Roman4', 'Tara4', 'Jan-20-1970', 'Drohobych', '66.66', 'true'],
        ['Tara', 'Buga', 'Jan-20-1974', 'Lviv', '33.66', 'true'],
        ['Tara3', 'Buga2', 'Jan-20-1974', 'Lviv', '22.66', 'true'],
        ['Tara6', 'Buga0', 'Jan-20-1974', 'Lviv', '70.66', 'true']
      ],
      rows2: [
        ['Roman', 'Tara', 'Jan-20-1970', 'Drohobych', '66.66', 'true'],
        ['Roman2', 'Tara2', 'Jan-20-1970', 'Drohobych', '77.66', 'true'],
        ['Roman3', 'Tara3', 'Jan-20-1970', 'Drohobych', '88.66', 'true'],
        ['Roman4', 'Tara4', 'Jan-20-1970', 'Drohobych', '66.66', 'true'],
        ['Tara', 'Buga', 'Jan-20-1974', 'Lviv', '33.66', 'true'],
        ['Tara3', 'Buga2', 'Jan-20-1974', 'Lviv', '22.66', 'true'],
        ['Tara6', 'Buga0', 'Jan-20-1974', 'Lviv', '70.66', 'true']
      ]
    }
  },
  mounted() {
  },
  methods: {
    tableChange(table) {
      console.log('table changed ', table)
    },
    deleteRow(row, callback) {
      if (confirm(`Delete row with index = ${row.index + 1}`)) {
        callback()
      }
    }
  }
}
</script>
