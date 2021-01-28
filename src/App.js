import React from 'react'
import {connect} from 'react-redux'
import {makeStyles} from "@material-ui/core/styles";
import {BrowserRouter, Switch, Route, Redirect, Link, NavLink} from 'react-router-dom'
import {AppBar, CssBaseline, Container, Toolbar, Typography, Button} from '@material-ui/core'
import Home from './Views/Home'
import Admin from "./Views/Admin";
import Login from './Views/auth/Login'
import {logout} from './Actions'
import {AuthContext} from './Contexts/AuthContext'

const useStyles = makeStyles(theme => ({
  appBar: {
    marginBottom: theme.spacing(5)
  },
  homeLink: {
    textDecoration: 'none',
    color: 'inherit'
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}))

const App = ({token, dispatch}) => {
  const classes = useStyles()

  const onLogout = () => {
    dispatch(logout())
  }

  return (
    <AuthContext.Provider value={{token}}>
      <BrowserRouter>
        <CssBaseline/>

        <AppBar position="relative" className={classes.appBar}>
          <Toolbar>
            <Typography variant="h6" color="inherit" className={classes.title} noWrap>
              <NavLink className={classes.homeLink} to="/">Todos</NavLink>
            </Typography>

            {!token
              ? <Button component={Link} color="inherit" to="/login">Login</Button>
              : <Button color="inherit" onClick={onLogout}>Logout</Button>
            }
          </Toolbar>
        </AppBar>

        <main>
          <Container maxWidth="sm">
            <Switch>
              <Route path="/login" component={Login}/>

              <Route path="/admin" render={({location}) => (token)
                ? <Admin/>
                : <Redirect to={{pathname: "/login", state: {from: location}}}/>
              }/>

              <Route path="/" component={Home}/>
            </Switch>
          </Container>
        </main>
      </BrowserRouter>
    </AuthContext.Provider>
  )
}

const mapStateToProps = state => ({
  token: state.auth.token
})

export default connect(mapStateToProps, null)(App)
