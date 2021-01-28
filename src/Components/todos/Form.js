import React from 'react'
import {isEqual} from 'lodash'
import {Button, Grid, TextField, Dialog, DialogTitle, DialogContent, DialogActions} from '@material-ui/core'
import {AuthContext} from "../../Contexts/AuthContext"
import FormComponent from '../FormComponent'
import Home from "../../Views/Home"
import todos from '../../Api/todos'

class TodosCreate extends FormComponent {
  static contextType = AuthContext

  submitForm = e => {
    e.preventDefault()

    if (this.isModeCreate) this.createTodo()

    if (this.isModeUpdate) this.updateTodo()
  }

  closeForm = () => {
    this.resetErrors()
    this.resetForm()

    this.props.onClose()
  }

  get isModeCreate() {
    return this.props.mode === Home.MODE_CREATE
  }

  get isModeUpdate() {
    return this.props.mode === Home.MODE_UPDATE
  }

  get title() {
    switch (this.props.mode) {
      case Home.MODE_CREATE:
        return 'Create'
      case Home.MODE_UPDATE:
        return 'Update'
      case Home.MODE_CLOSE:
        return null
      default:
        return null
    }
  }

  get btnText() {
    switch (this.props.mode) {
      case Home.MODE_CREATE:
        return 'Create Task'
      case Home.MODE_UPDATE:
        return 'Update task'
      default:
        return null
    }
  }

  createTodo() {
    todos.post('/create', this.formData)
      .then(res => {
        if (res.data.status === 'error') {
          this.setState({errors: res.data.message})

          return
        }

        this.props.onCreate(res.data.message)
        this.resetErrors()
        this.resetForm()
      })
      .catch(err => console.log(err))
  }

  updateTodo() {
    const data = new FormData()
    data.append('token', this.context.token)
    data.append('text', this.state.form.text)

    todos.post(`/edit/${this.props.editable.id}/`, data)
      .then(res => {
        if (res.data.status !== 'ok') return

        this.props.onCreate(res.data.message)
        this.resetErrors()
        this.resetForm()
      })
      .catch(err => console.log(err))
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const {editable} = this.props

    if (!isEqual(prevProps.editable, editable)) {
      const {form} = this.state
      const text = editable ? editable.text : ''

      this.setState({form: {...form, text }})
    }
  }

  render() {
    const {mode} = this.props
    const {form, errors} = this.state

    return (
      <Dialog open={!!mode} onClose={this.closeForm} aria-labelledby="form-dialog-title">
        <form onSubmit={this.submitForm} style={{width: '100%'}} noValidate>

          <DialogTitle id="form-dialog-title">{this.title}</DialogTitle>

          <DialogContent>
            {this.isModeCreate ? <Grid container justify="center" spacing={2}>
              <Grid item xs>
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
                  size="small"
                  autoFocus
                  fullWidth
                  required
                />
              </Grid>

              <Grid item xs>
                <TextField
                  error={this.hasError('email')}
                  helperText={errors.email}
                  onChange={this.setField}
                  value={form.email}
                  variant="outlined"
                  margin="normal"
                  label="E-mail"
                  size="small"
                  name="email"
                  type="email"
                  id="email"
                  fullWidth
                  required
                />
              </Grid>
            </Grid> : null}

            <TextField
              error={this.hasError('text')}
              helperText={errors.text}
              onChange={this.setField}
              value={form.text}
              variant="outlined"
              margin="normal"
              label="Text"
              name="text"
              id="text"
              multiline
              rows={3}
              fullWidth
              required
            />
          </DialogContent>

          <DialogActions>
            <Button onClick={this.closeForm}>
              Cancel
            </Button>
            <Button variant="contained" color="primary" type="submit">
              {this.btnText}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    )
  }
}

export default TodosCreate
