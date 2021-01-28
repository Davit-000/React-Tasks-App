import React from 'react'
import PropTypes from 'prop-types'

class FormComponent extends React.Component {
  get formData() {
    const {form} = this.state
    const data = new FormData()

    Object.keys(form).forEach(field => data.append(field, form[field]))

    return data
  }

  setField = e => {
    const {name, value} = e.target

    this.setState({form: {...this.state.form, [name]: value}})
  }

  submitForm = e => {
    e.preventDefault()
  }

  constructor(props) {
    super(props)

    this.state = {form: props.form, errors: {}}
  }

  resetForm() {
    const {form} = this.state

    Object.keys(form).forEach(field => form[field] = '')

    this.setState({form})
  }

  resetErrors() {
    this.setState({errors: {}})
  }

  hasError(field) {
    const {errors} = this.state

    return !!errors[field]
  }

  anyErrors() {
    return !!Object.keys(this.state.error).length
  }

  errors() {
    return {...this.state.errors}
  }
}

FormComponent.propTypes = {
  form: PropTypes.object.isRequired
}

export default FormComponent
