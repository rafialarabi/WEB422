import { useParams } from "react-router-dom";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import { useState, useEffect } from "react";
import { Card, CardDeck } from "react-bootstrap";
import Moment from "moment";

function Restaurant() {
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();

  useEffect(() => {
    setLoading(true);
    fetch(`https://fathomless-sea-80652.herokuapp.com/api/restaurants/${id}`)
      .then((res) => res.json())
      .then((result) => {
        if (result.hasOwnProperty("_id")) {
          setRestaurant(result);
        } else {
          setRestaurant(null);
        }
        setLoading(false);
      });
  }, [id]);
  
  function restaurants() {
    if (loading) {
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
      return (
        <div>
          <Card>
            <Card.Header>
              <Card.Title>{restaurant.name}</Card.Title>
              <Card.Subtitle>
                {restaurant.address.building + " " + restaurant.address.street}
              </Card.Subtitle>
            </Card.Header>
          </Card>
          <br />
          <MapContainer
            style={{ height: "400px" }}
            center={[restaurant.address.coord[1], restaurant.address.coord[0]]}
            zoom={13}
            scrollWheelZoom={false}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <Marker
              position={[
                restaurant.address.coord[1],
                restaurant.address.coord[0],
              ]}
            ></Marker>
          </MapContainer>
          <br />
          <CardDeck relative>
            {restaurant.grades.map((res, i) => {
              return (
                <div key={`${i}-${res.score}`}>
                  <Card>
                    <Card.Body>
                      <Card.Text>
                        Grade: {res.grade}
                      </Card.Text>
                    </Card.Body>
                    <Card.Footer>
                      <small className="text-muted">
                        Completed: {Moment(res.date).format("L")}
                      </small>
                    </Card.Footer>
                  </Card>
                </div>
              );
            })}
          </CardDeck>
        </div>
      );
    }
  }

  return restaurants();
}

export default Restaurant;
