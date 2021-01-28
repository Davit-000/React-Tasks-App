import React from 'react'
import {connect} from 'react-redux'
import {withStyles} from '@material-ui/core'
import {LockOutlined} from '@material-ui/icons'
import {Avatar, Button, Container, Typography} from '@material-ui/core'
import {Checkbox, CssBaseline, FormControlLabel, TextField} from '@material-ui/core'
import todos from '../../Api/todos'
import {login} from '../../Actions'

const styles = theme => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%',
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
})

class Login extends React.Component {
  setField = e => {
    const {name, value} = e.target

    this.setState({form: {...this.state.form, [name]: value}})
  }

  submitForm = e => {
    e.preventDefault()

    const {form} = this.state
    const {dispatch, history} = this.props
    const data = new FormData(), config = {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }

    Object.keys(form).forEach(field => data.append(field, form[field]))

    todos.post('/login', data, config)
      .then(res => {
        const {message, status} = res.data

        if (status === 'error') {
          this.setState({errors: message})

          return
        }

        dispatch(login(message.token))

        history.push('/')
      })
  }

  constructor(props) {
    super(props);

    this.state = {
      form: {
        username: '',
        password: ''
      },
      errors: {}
    }
  }

  hasError(field) {
    const {errors} = this.state

    return !!errors[field]
  }

  render() {
    const {classes} = this.props
    const {form, errors} = this.state

    return (
      <Container component="main" maxWidth="xs">
        <CssBaseline/>

        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlined/>
          </Avatar>

          <Typography component="h1" variant="h5">Login</Typography>

          <form onSubmit={this.submitForm} className={classes.form} noValidate>
            <TextField
              error={this.hasError('username')}
              helperText={errors.username}
              onChange={this.setField}
              value={form.username}
              autoComplete="username"
              variant="outlined"
              label="Username"
              margin="normal"
              name="username"
              id="username"
              autoFocus
              fullWidth
              required
            />

            <TextField
              error={this.hasError('password')}
              helperText={errors.password}
              onChange={this.setField}
              value={form.password}
              autoComplete="current-password"
              variant="outlined"
              label="Password"
              name="password"
              type="password"
              id="password"
              margin="normal"
              fullWidth
              required
            />

            <FormControlLabel
              control={<Checkbox value="remember" color="primary"/>}
              label="Remember me"
            />

            <Button
              className={classes.submit}
              variant="contained"
              color="primary"
              type="submit"
              fullWidth
            >
              Sign In
            </Button>
          </form>
        </div>
      </Container>
    )
  }
}

export default withStyles(styles)(connect()(Login))
