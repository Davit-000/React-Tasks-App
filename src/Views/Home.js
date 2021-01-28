import React from 'react'
import qs from 'qs'
import axios from 'axios'
import {Container, CssBaseline} from '@material-ui/core'
import todos from '../Api/todos'
import TodosList from '../Components/todos/List'
import TodosFrom from '../Components/todos/Form'

const form = {
  username: '',
  email: '',
  text: ''
}

class Home extends React.Component {
  static MODE_CREATE = 1

  static MODE_UPDATE = 2

  static MODE_CLOSE = 0

  get queryObject() {
    return qs.parse(this.props.location.search, {
      ignoreQueryPrefix: true,
      strictNullHandling: true,
      plainObjects: true
    })
  }

  constructor(props) {
    super(props);

    this.state = {todos: [], count: 1, mode: Home.MODE_CLOSE, editable: null}
    this.source = axios.CancelToken.source()

    props.history.listen((location) => {
      const query = qs.parse(location.search, {
        ignoreQueryPrefix: true,
        strictNullHandling: true,
        plainObjects: true
      })

      this.getTodos(query)
    })
  }

  onTodoCreateOrUpdate = () => {
    this.getTodos(this.queryObject)

    this.setState({mode: Home.MODE_CLOSE, editable: null})
  }

  onTodoToggle = todo => {
    const todos = this.state.todos.map(item => ({...item}))
    const index = todos.findIndex(item => item.id === todo.id)

    todo.status = todo.status ? 0 : 1
    todos.splice(index, 1, todo)

    this.setState({todos})
  }

  getTodos = filters => {
    todos.get('/', {
      cancelToken: this.source.token,
      params: filters
    })
      .then(res => this.setState({
        todos: res.data.message.tasks,
        count: +res.data.message.total_task_count
      }))
      .catch(err => console.log(err))
  }

  setFilters = filter => {
    const query = Object.assign({}, this.queryObject, filter)

    this.props.history.replace(`/?${qs.stringify(query)}`)
  }

  showForm = ({mode, todo}) => this.setState({mode, editable: todo})

  componentDidMount() {
    this.getTodos(this.queryObject)
  }

  componentWillUnmount() {
    this.source.cancel()
  }

  render() {
    const {todos, count, mode, editable} = this.state

    return (
      <Container component="main" maxWidth="sm">
        <CssBaseline/>

        <TodosFrom
          form={form}
          mode={mode}
          editable={editable}
          onCreate={this.onTodoCreateOrUpdate}
          onUpdate={this.onTodoCreateOrUpdate}
          onClose={() => this.setState({mode: Home.MODE_CLOSE})}
        />

        <TodosList
          items={todos}
          count={count}
          onShowForm={this.showForm}
          filters={this.queryObject}
          onToggle={this.onTodoToggle}
          onPageChange={this.setFilters}
          onSortFieldChange={this.setFilters}
          onSortDirectionChange={this.setFilters}
        />
      </Container>
    )
  }
}

export default Home
