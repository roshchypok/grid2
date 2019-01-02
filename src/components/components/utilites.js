export function keyArrowEvent(e) {
  if (e.type === 'keydown' && e.key.match('Down|Up|Right|Left')) {
    return e.key.match('Arrow') ? e.key : `Arrow${e.key}`
  } else {
    return ''
  }
}

export function present(value) {
  return value && value !== '' && value != NaN && value !== null && value != undefined
}

export function emptyRow(row) {
  return !row.some((f) => present(f))
}

export function allowedKeyForAutoEditing(event) {
  const ds = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Up', 'Down', 'Left', 'Right', 'Escape', 'Tab', 'Enter']
  return !ds.includes(event.key) && /[\u0000-\u007A]/.test(event.keyCode)
}

export function defaultCompare(a, b) {
  if (a < b) return -1;
  if (a > b) return 1;
  return 0;
}

export function importData(columns, rows) {
  const result = {columns: [], rows: []}
  columns.forEach((c) => {
    if (c.type === 'money') {
      result.columns.push({
        title: c.title,
        type: 'amount',
        sort: c.sort,
        width: c.width // fix to const
      })
      result.columns.push({
        title: 'Currency',
        type: 'currency'
      })
    } else {
      result.columns.push(c)
    }
  })
  rows.forEach((row) => {
    const resultRow = []
    columns.forEach((col, indx) => {
      if (col.type === 'money') {
        const moneyArr = parseMoney(row[indx])
        resultRow.push(moneyArr[0])
        resultRow.push(moneyArr[1])
      } else {
        resultRow.push(row[indx])
      }
    })
    result.rows.push(resultRow)
  })
  return result
}

function parseMoney(value) {
  if (value) {
    const normalizeValue = value.trim()
    if (normalizeValue.length === 0) {
      return ['', '']
    } else {
      const moneyArr = normalizeValue.split(' ')
      if (moneyArr.length === 1) {
        return moneyArr[0].match(/^\d/) ? [moneyArr[0], ''] : ['', moneyArr[0]]
      } else {
        const last = moneyArr.length -1
        return moneyArr[0].match(/^\d/) ? [moneyArr[0], moneyArr[last]] : ['', moneyArr[last]]
      }
    }
  } else {
    return ['', '']
  }
}

export function exportData(columns, rows) {
  const result = []
  rows.forEach((row) => {
    if (!emptyRow(row)) {
      const exportRow = []
      let indexCorrection = 0
      columns.forEach((col, indx) => {
        const realIndex = indx + indexCorrection
        if (col.type === 'money') {
          exportRow.push(createMoney(row[realIndex], row[realIndex + 1]))
          indexCorrection += 1
        } else {
          exportRow.push(row[realIndex])
        }
      })
      result.push(exportRow)
    }
  })
  return result
}

function createMoney(amount, currency) {
  return present(amount) && present(currency) ? `${amount} ${currency}` : ''
}
