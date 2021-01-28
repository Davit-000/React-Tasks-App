const STATE = {
  token: null
}

export default function (state = STATE, action) {
  switch (action.type) {
    case 'LOGIN':
      return {...state, token: action.token}
    case 'LOGOUT':
      return {...state, token: null}
    default:
      return state
  }
}
