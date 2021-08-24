import "./App.css";
import {
  Button,
  Col,
  Container,
  Form,
  FormControl,
  Nav,
  Navbar,
  Row,
} from "react-bootstrap";
import { Redirect, Route, Switch } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";
import { useHistory } from "react-router-dom";
import { useState } from "react";
import About from "./component/About";
import Restaurant from "./component/Restaurant";
import Restaurants from "./component/Restaurants";
import NotFound from "./component/NotFound"

function App() {
  const [searchString, setSearchString] = useState("");

  //adding handleSubmit(e) function to the App
  let history = useHistory();
  function handleSubmit(e) {
    e.preventDefault();
    history.push("/restaurants?borough=" + searchString);
    setSearchString((prevString) => "");
  }

  return (
    <>
      <Navbar bg="light" expand="lg">
        <LinkContainer to="/">
          <Navbar.Brand>New York Restaurants</Navbar.Brand>
        </LinkContainer>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Nav className="mr-auto" navbarScroll>
            <LinkContainer to="/restaurants">
              <Nav.Link>Full List</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/about">
              <Nav.Link>About</Nav.Link>
            </LinkContainer>
          </Nav>
          <Form className='d-flex' onSubmit={handleSubmit}>
            <FormControl
              type="text"
              placeholder="Borough"
              className="mr-2"
              value={searchString}
              onChange={(e) => setSearchString(e.target.value)}
            />
            <Button type="submit" variant="outline-info">
              Search
            </Button>
          </Form>
        </Navbar.Collapse>
      </Navbar>
      <br />
      <Container>
        <Row>
          <Col>
            <Switch>
              <Route exact path="/">
                <Redirect to="/Restaurants" />
              </Route>
              <Route exact path="/about">
                <About />
              </Route>
              <Route exact path="/Restaurants">
                <Restaurants />
              </Route>
              <Route path="/Restaurant/:id">
                <Restaurant />
              </Route>
              <Route>
                <NotFound />
              </Route>
            </Switch>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default App;