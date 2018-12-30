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

export function allowedKeyForAutoEditing(event) {
  const ds = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Up', 'Down', 'Left', 'Right', 'Escape', 'Tab', 'Enter']
  return !ds.includes(event.key) && /[\u0000-\u007A]/.test(event.keyCode)
}

export function defaultCompare(a, b) {
  if (a < b) return -1;
  if (a > b) return 1;
  return 0;
}
