import React from 'react'
import PropTypes from 'prop-types'
import {Pagination} from '@material-ui/lab'
import {Add, Edit, CheckBox, CheckBoxOutlineBlank} from '@material-ui/icons'
import {withStyles, InputLabel, Button, ListItemSecondaryAction} from '@material-ui/core'
import {Card, CardActions, Checkbox, ListItemText, ListItemIcon, Select} from '@material-ui/core'
import {List, ListItem, CardContent, IconButton, MenuItem, FormControl, Grid, SvgIcon} from '@material-ui/core'
import todos from "../../Api/todos";
import {AuthContext} from "../../Contexts/AuthContext";
import Home from "../../Views/Home";

const styles = theme => ({
  root: {
    width: '100%',
    backgroundColor: theme.palette.background.paper,
  },
  inline: {
    display: 'inline',
  },
  formControl: {
    minWidth: 120,
  },
  cardActions: {
    justifyContent: 'center'
  }
})

const SortIcon = props =>
  <SvgIcon {...props}>
    <path fill="currentColor" d="M18 21L14 17H17V7H14L18 3L22 7H19V17H22M2 19V17H12V19M2 13V11H9V13M2 7V5H6V7H2Z"/>
  </SvgIcon>

const SortAscIcon = props =>
  <SvgIcon {...props}>
    <path d="M19 17H22L18 21L14 17H17V3H19M2 17H12V19H2M6 5V7H2V5M2 11H9V13H2V11Z"/>
  </SvgIcon>

const SortDescIcon = props =>
  <SvgIcon {...props}>
    <path d="M19 7H22L18 3L14 7H17V21H19M2 17H12V19H2M6 5V7H2V5M2 11H9V13H2V11Z"/>
  </SvgIcon>

class TodosList extends React.Component {
  static PER_PAGE = 3

  static contextType = AuthContext

  get isAuth() {
    return !!this.context.token
  }

  get count() {
    return Math.round(this.props.count / TodosList.PER_PAGE)
  }

  changeSortDirection = () => {
    let direction;
    const {sort_direction} = this.state

    switch (sort_direction) {
      case 'asc':
        direction = 'desc'
        break
      case 'desc':
        direction = undefined
        break
      default:
        direction = 'asc'
        break
    }

    this.setState(
      {sort_direction: direction},
      () => this.props.onSortDirectionChange({sort_direction: direction})
    )
  }

  changeSortField = e => {
    const {value} = e.target

    this.setState(
      {sort_field: value},
      () => this.props.onSortFieldChange({sort_field: value || undefined})
    )
  }

  changePage = (e, value) => {
    this.setState(
      {page: value},
      () => this.props.onPageChange({page: value})
    )
  }

  toggleTodo = id => () => {
    if (!this.isAuth) return

    const {items} = this.props
    const {token} = this.context
    const data = new FormData()
    const todo = items.find(todo => todo.id === id)
    const status = todo.status ? '0' : '1'

    data.append('token', token)
    data.append('status', status)

    todos.post(`/edit/${id}`, data)
      .then(() => this.props.onToggle({...todo}))
      .catch(err => console.log(err))
  }

  constructor(props) {
    super(props);

    this.state = Object.assign({}, {
      page: 1,
      sort_field: '',
      sort_direction: null
    }, props.filters)
  }

  render() {
    const {items, classes, onShowForm} = this.props
    const {page, sort_field, sort_direction} = this.state

    return (
      <Card>
        <CardContent>
          <Grid justify="space-between" alignItems="center" container>
            <Button
              variant="outlined"
              color="secondary"
              size="medium"
              startIcon={<Add/>}
              onClick={() => onShowForm({mode: Home.MODE_CREATE, todo: null})}
            >
              Add
            </Button>

            <FormControl className={classes.formControl} variant="outlined" size="small">
              <InputLabel id="sort">Sort By</InputLabel>

              <Select
                onChange={this.changeSortField}
                value={sort_field}
                labelId="sort"
              >
                <MenuItem value=""><em>None</em></MenuItem>
                <MenuItem value="username">Username</MenuItem>
                <MenuItem value="email">Email</MenuItem>
                <MenuItem value="status">Status</MenuItem>
              </Select>
            </FormControl>

            <IconButton onClick={this.changeSortDirection} aria-label="sort">
              {!sort_direction ? <SortIcon/> : null}
              {sort_direction === 'asc' ? <SortAscIcon/> : null}
              {sort_direction === 'desc' ? <SortDescIcon/> : null}
            </IconButton>
          </Grid>

          <List className={classes.root}>
            {items.map(todo => (
              <ListItem
                onClick={this.toggleTodo(todo.id)}
                alignItems="flex-start"
                key={`todos-${todo.id}`}
                button={this.isAuth}
              >
                <ListItemIcon>
                  {this.isAuth ?
                    <Checkbox
                      checked={!!todo.status}
                      tabIndex={-1}
                      edge="start"
                      disableRipple
                    />
                    : !!todo.status ? <CheckBox/> : <CheckBoxOutlineBlank/>}
                </ListItemIcon>

                <ListItemText
                  primary={`Username: ${todo.username}, E-mail: ${todo.email}`}
                  secondary={todo.text}
                />

                {this.isAuth ? <ListItemSecondaryAction>
                  <IconButton
                    onClick={() => onShowForm({mode: Home.MODE_UPDATE, todo})}
                    aria-label="edit"
                    edge="end"
                  >
                    <Edit/>
                  </IconButton>
                </ListItemSecondaryAction> : null}
              </ListItem>
            ))}
          </List>
        </CardContent>

        <CardActions className={classes.cardActions}>
          <Pagination
            page={+page}
            count={this.count}
            onChange={this.changePage}
          />
        </CardActions>
      </Card>
    )
  }
}

TodosList.propTypes = {
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
  count: PropTypes.number.isRequired,
  filters: PropTypes.object.isRequired
}

export default withStyles(styles)(TodosList)
