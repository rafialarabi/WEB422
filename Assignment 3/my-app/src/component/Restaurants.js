import { useLocation } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Card, Table, Pagination } from "react-bootstrap";
import queryString from "query-string";

function Restaurants(props) {
  const [restaurants, setRestaurants] = useState(null);
  const [page, setPage] = useState(1);
  const perPage = 10;

  let history = useHistory();
  let query = queryString.parse(useLocation().search);
  let location = query.borough;

  useEffect(() => {
    let url;
    if (location) {
      url = `https://fathomless-sea-80652.herokuapp.com/api/restaurants?page=${page}&perPage=${perPage}&borough=${location}`;
    }else {
      url = `https://fathomless-sea-80652.herokuapp.com/api/restaurants?page=${page}&perPage=${perPage}`;
    }
    fetch(
      url
    )
      .then((res) => res.json())
      .then((result) => {
        setRestaurants(result);
      });
  }, [page, location]);

  function previousPage() {
    if (page > 1) {
      setPage(page - 1);
    }
  }

  function nextPage() {
    setPage(page + 1);
  };

  if (!restaurants) {
    return (
      <div>
        <Card>
          <Card.Body>
            <Card.Text>Loading Restaurants...</Card.Text>
          </Card.Body>
        </Card>
      </div>
    );
  } else {
    if (restaurants.length > 0) {
      return (
        <div>
          <Card>
            <Card.Body>
              <Card.Title>Restaurant List</Card.Title>
              <Card.Text>
                Full list of restaurants. Optionally sorted by borough
              </Card.Text>
            </Card.Body>
          </Card>
          <br />
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Name</th>
                <th>Address</th>
                <th>Borough</th>
                <th>Cuisine</th>
              </tr>
            </thead>
            <tbody>
              {restaurants.map((restaurant) => (
                <tr
                  onClick={() => {
                    history.push(`/restaurant/${restaurant._id}`);
                  }}
                  key={restaurant._id}
                >
                  <td>{restaurant.name}</td>
                  <td>
                    {restaurant.address.building} {restaurant.address.street}
                  </td>
                  <td>{restaurant.borough}</td>
                  <td>{restaurant.cuisine}</td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Pagination>
            <Pagination.Prev onClick={() => previousPage()} />
            <Pagination.Item>{page}</Pagination.Item>
            <Pagination.Next onClick={() => nextPage()} />
          </Pagination>
        </div>
      );
    } else {
      return (
        <div>
          <Card>
            <Card.Body>
              <Card.Text>No Restaurants Found</Card.Text>
            </Card.Body>
          </Card>
        </div>
      );
    }
  }
}

export default Restaurants;
