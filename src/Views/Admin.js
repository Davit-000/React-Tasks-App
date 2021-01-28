import React from 'react'
import qs from "qs";
import {Container} from "@material-ui/core";
import {withRouter} from 'react-router-dom'
import TodosList from "../Components/todos/List";
import {AuthContext} from "../Contexts/AuthContext";

class Admin extends React.Component {
  static contextType = AuthContext

  get queryObject() {
    return qs.parse(this.props.location.search, {
      ignoreQueryPrefix: true,
      strictNullHandling: true,
      plainObjects: true
    })
  }

  constructor(props) {
    super(props);
  }

  render() {
    const {token} = this.context

    return (
      <Container>

      </Container>
    )
  }
}

export default withRouter(props => <Admin {...props}/>)
