/*********************************************************************************
*  WEB422 – Assignment 2
*  I declare that this assignment is my own work in accordance with Seneca Academic Policy.  
*  No part of this assignment has been copied manually or electronically from any other source
*  (including web sites) or distributed to other students.
* 
*  Name: Md Rafi Al Arabi Bhuiyan Student ID: 147307193 Date: 2021-06-11
*
*
********************************************************************************/ 


//Restaurant data
let restaurantData = [];
let currentRestaurant = [];

//For pagination
let page = 1;
const perPage = 10; // will be same

//for leaflet Map
let map = null;

//Function avg(grades) which will calculate the average score for a restaurant

function avg(grades) {
  let total = 0;
  for (let i = 0; i < grades.length; i++) {
    total += grades[i].score;
  }

  return (total / grades.length).toFixed(2);
}

//this function creates the template using lodash.
let tableRows = _.template(
  `<% _.forEach(restaurants, function(restaurant) { %>
        <tr data-id=<%- restaurant._id %>>
        <td><%- restaurant.name %></td>
        <td><%- restaurant.cuisine %></td>
        <td><%- restaurant.address.building %> <%- restaurant.address.street %></td>
        <td><%-avg(restaurant.grades) %></td>
        </tr>
   <% }); %>`
);

//this function will populate the restaurantData array.
function loadRestaurantData() {
  fetch(
    `https://fathomless-sea-80652.herokuapp.com/api/restaurants?page=${page}&perPage=${perPage}`
  )
    .then((res) => res.json())
    .then((restaurants) => {
      restaurantData = restaurants;
      let rows = tableRows({ restaurants: restaurantData });
      $("#restaurant-table tbody").html(rows);
      $("#current-page").html(page);
    });
}

//invoking the loadRestaurantData() function to populate our table with data and set the current working page
$(function () {
  loadRestaurantData();

  //first event(tr elements)
  $("#restaurant-table tbody").on("click", "tr", function () {
    let dataID = $(this).attr("data-id");

    for (let i = 0; i < restaurantData.length; i++) {
      if (restaurantData[i]._id === dataID) {
        currentRestaurant = _.cloneDeep(restaurantData[i]);
      }
    }

    $("#restaurant-modal .modal-title").html(currentRestaurant.name);
    $("#restaurant-address").html(
      `${currentRestaurant.address.building} ${currentRestaurant.address.street}`
    );
    $("#restaurant-modal").modal("show");
  });


  //Second event(previous page)
  //this function will help the client to access to the previous pages
  $("#previous-page").on("click", function () {
    if (page > 1) {
      page--;
      loadRestaurantData();
    }
  });

  //Third event(next page)
  //this function will help the client to access to the next pages
  $("#next-page").on("click", function () {
    page++;
    loadRestaurantData();
  });

  //Fourth event("Restaurant" modal) for shown.bs.modal
  //this event triggers a modal window when it is fully shown.
  $("#restaurant-modal").on("shown.bs.modal", function () {
    map = new L.Map("leaflet", {
      center: [
        currentRestaurant.address.coord[1],
        currentRestaurant.address.coord[0]
      ],
      zoom: 18,
      layers: [
        new L.TileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png")
      ]
    });

    L.marker([
      currentRestaurant.address.coord[1],
      currentRestaurant.address.coord[0],
    ]).addTo(map);
  });

  //Fifth event("Restaurant" modal) for hidden.bs.modal
  //This function remove the initialized leaflet map so that new maps can be loaded.
  $("#restaurant-modal").on("hidden.bs.modal", function () {
    map.remove();
  });
});
