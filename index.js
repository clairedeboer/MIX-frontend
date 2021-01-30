// ******************* Dom Elements *****************

const cocktailCardDiv = document.querySelector(".cocktail-cards");

const verticalMenuDiv = Array.from(
  document.getElementsByClassName("ui vertical fluid tabular menu")
)[0];
let loginForm = document.querySelector("#login-form");
let lIMenu = document.querySelector("#lIMenu");
let menuArea = document.querySelector("#menu-area");
let signUpBtn = menuArea.querySelector("button");
const all = document.querySelector(".all");
let cocktailsJSON;

// ******************* Network Requests *****************
const getCocktails = () => {
  return fetch("http://localhost:3000/cocktails").then((response) =>
    response.json()
  );
};

let categories = [];
const getTastes = () => {
  fetch("http://localhost:3000/categories/")
    .then((res) => res.json())
    .then((categoriesArray) => {
      categories = categoriesArray;
      showSideBar(categoriesArray);
    });
};

getTastes();

let usernameId;
function usernameFetch(input) {
  return fetch(`http://localhost:3000/users/${input}`)
    .then((res) => res.json())
    .then((object) => {
      if (object === null || input === "") {
        return landingView();
      } else {
        usernameId = object.id;
        return loggedInView(input);
      }
    });
}

function postUserFetch(newUser) {
  fetch(`http://localhost:3000/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newUser),
  })
    .then((res) => res.json())
    .then((newObj) => {
      newObj.id ? loggedInView(newObj.name) : renderSignUpForm(false);
    });
}

function deleteFetch() {
  fetch(`http://localhost:3000/users/${loggedInData.loggedInUsername}`, {
    method: "DELETE",
  })
    .then((res) => res.json())
    .then(landingView);
}

//add cocktail show to use for buttons 
// let updatedCocktail;
// function getClickedCocktail(eCocktailId)
//   fetch(`http://localhost:3000/cocktails/${eCocktailId}`)
//   .then(res => res.json())
//   .then ((upCocktail) => {
//   updatedCocktail = upCocktail;
// });

// ******************* Dom Manipulation / functions *****************

const login = (e) => {
  e.preventDefault();
  const usernameInput = e.target.username.value;
  usernameFetch(usernameInput);
};

const showSideBar = (categoriesArray) => {
  categoriesArray.forEach((category) => {
    verticalMenuDiv.innerHTML += `
      <a class="item" id=${category.id}>${category.name}</a>
    `;
  });
};

function filterCocktails(e) {
  let categoryId = e.target.id;
  let relevantCategory = categories.find(
    (category) => parseInt(category.id) === parseInt(categoryId)
  );
  let categoryCocktails = relevantCategory.cocktails;

  Array.from(verticalMenuDiv.children).forEach((child) => {
    child.className = "item";
  });

  e.target.className = "item active";
  // Clear cocktailCardDiv so it's fresh / empty
  cocktailCardDiv.innerHTML = "";

  // Populate cocktailCardDiv with all of the categoryCocktails
  categoryCocktails.forEach((cocktail) => {
    renderCocktail(cocktail);
  });
}
function showAll(e) {
  if (e.target.id === "show-all-btn") {
    getAndRenderCocktails();
  }
}

{
  /* <div class="ui card five wide column">
<div class="image">
  <img src=${cocktail.image}>
</div>
<div class="content">
  <a class="header">${cocktail.name}</a>
  <div class="meta">
    <span class="date">${cocktail.recipe}</span>
  </div>
  <div class="description" id=reviews-${cocktail.id}>
  </div>
  <form class="review-form" id=reviews-form-${cocktail.id}>
  </form>
</div> */
}

const renderCocktail = (cocktail) => {
  cocktailCardDiv.innerHTML += `
  <div class="ui card">
  <div class="ui slide masked reveal image">
    <img src=${cocktail.image} class="visible content">
    <p class="meta hidden content">${cocktail.recipe}</p>
  </div>
  <div class="content">
    <a class="header">${cocktail.name}</a>
  </div>
  <div class="description" id=reviews-${cocktail.id}>
  </div>
  <form class="review-form" id=reviews-form-${cocktail.id}>
  </form>
  ${renderSeeReviewsButton(cocktail)}
  <br>
  ${loggedInData.loggedIn ? renderAddReviewButton(cocktail) : ""}
</div>
`;
  setTimeout(() => {
    handleSeeReviewsEvent(cocktail)
    loggedInData.loggedIn ? handleAddReviewEvent(cocktail): undefined;
  });
};

// <div class="meta">
// <span class="date">Created in Sep 2014</span>
// </div>

const getAndRenderCocktails = () => {
  cocktailCardDiv.innerHTML = "";
  getCocktails().then((cocktailData) => {
    cocktailData.forEach((cocktail) => renderCocktail(cocktail));
    cocktailsJSON = cocktailData;
  });
};

getAndRenderCocktails();

const calculateAverage = (cocktail) => {
  ratingsArray = cocktail.reviews.map((review) => review.rating);
  ratingsSum = ratingsArray.reduce((a, b) => a + b, 0);
  ratingsAve = ratingsSum / ratingsArray.length;
  return renderAve(ratingsAve);
};

const renderAve = (ratingsAve) => {
  return `
  <div class="ratings-average">${ratingsAve.toFixed(1)}</div>
  `;
  //star rating possible solution to use later
  // for (let i=1; i<ratingsAve; i++) {
  //   const starDiv = document.createElement("div");
  //   starDiv.className = "star" //add CSS overflow:hidden for half stars, display: inline-block to show horizontal
  //   starDiv.innerHTML += "&starf;";
  //   cocktailCardDiv.append(starDiv);
  // }
};

const handleSeeReviewsEvent = (cocktail) => {
  const seeReviewsButton = document.querySelector(`#cocktail-${cocktail.id}`);
  const reviewsDiv = document.querySelector(`#reviews-${cocktail.id}`);
  seeReviewsButton.addEventListener("click", (event) => {
    // trying modal
    // modal.modal('show');
 
    // Refetch latest cocktail reviews
  //   newButton.addEventListener('click', event => {
  //     if (event.target.innerText === "Sort by Author") {
  //         event.target.innerText = "Sort by ID"
  //         quotesByAuthor()
  //     } else {
  //         event.target.innerText = "Sort by Author"
  //         initializeQuotes()
  //     }
  
  // })
    
    fetch(`http://localhost:3000/cocktails/${cocktail.id}`)
    .then(res => res.json())
    .then ((upCocktail) => {
      updatedCocktail = upCocktail;
      reviewsDiv.innerHTML = "";
      let rating = `<a class=ui basic label">Average Rating &nbsp; ${calculateAverage(updatedCocktail)}</a>`
      reviewsDiv.innerHTML += `
      ${updatedCocktail.reviews.length === 0 ? '' : rating}
      ${updatedCocktail.reviews.map((review) => renderReview(review)).join("<br>")}
      `;
        updatedCocktail.reviews.forEach((review) => {
          const updateReviewButton = document.querySelector(`#update-review-${review.id}`);
          if (updateReviewButton) {
          updateReviewButton.dataset.id = review.id;
          updateReviewButton.addEventListener("click", renderUpdateReviewForm);
          }
        });
    })
    })
    
    // reviewsDiv.innerHTML = "";
    // reviewsDiv.innerHTML += `
    // ${cocktail.reviews
    //   .map((review) => renderReview(review))
    //   .join("<br>")}
    //   `;

    
    // for each review add an event listener on update review button
    // const reviewsArray = cocktail.reviews;
    // reviewsArray.forEach((review) => {
    //   const updateReviewButton = document.querySelector(`#update-review-${review.id}`);
    //   if (updateReviewButton) {
    //   updateReviewButton.dataset.id = review.id;
    //   updateReviewButton.addEventListener("click", renderUpdateReviewForm);
    //   }
    // });

};

const handleAddReviewEvent = (cocktail) => {
  const addReviewButton = document.querySelector(`#add-review-${cocktail.id}`);
  addReviewButton.dataset.id = cocktail.id;
  addReviewButton.addEventListener("click", renderNewReviewForm);
};

const renderUpdateButton = (review) => {
  return `<button class="update-review-button" id="update-review-${review.id}">
  Update Review
  </button>`;
};

const renderReview = (review) => {
  return `
  <div id="review-${review.id}">
    <div class="rating">${review.rating}</div>
    <div class="review">${review.review_text}</div>
    ${
      loggedInData.loggedInId === review.user_id
        ? renderUpdateButton(review)
        : ""
    } 
  </div>
  `;
};

const renderSeeReviewsButton = (cocktail) => {
  
  return `
  <div class="ui labeled button" tabindex="0">
  <div class="ui button" id="cocktail-${cocktail.id}" >
    See Reviews
  </div>
</div>
`;
{/* <a class="ui basic label"> */}
{/* Average Rating: &nbsp; ${calculateAverage(cocktail)} */}
{/* </a> */}
};

const renderAddReviewButton = (cocktail) => {
  return `
<button class="ui button" id="add-review-${cocktail.id}">Add Review</button>
`;
};

const renderNewReviewForm = (event) => {
  const cocktailId = `${event.target.dataset.id}`;
  const reviewForm = document.querySelector(`#reviews-form-${cocktailId}`);
  reviewForm.innerHTML += `
  <div class="ui form">
  <div class="inline fields">
    <div class="field">
      <div class="ui radio checkbox">
        <input type="radio" name="rating" checked="" tabindex="0" class="hidden" value="1">
        <label>1</label>
      </div>
    </div>
    <div class="field">
      <div class="ui radio checkbox">
        <input type="radio" name="rating" tabindex="0" class="hidden" value="2">
        <label>2</label>
      </div>
    </div>
    <div class="field">
      <div class="ui radio checkbox">
        <input type="radio" name="rating" tabindex="0" class="hidden" value="3">
        <label>3</label>
      </div>
    </div>
    <div class="field">
      <div class="ui radio checkbox">
        <input type="radio" name="rating" tabindex="0" class="hidden" value="4">
        <label>4</label>
      </div>
    </div>
    <div class="field">
      <div class="ui radio checkbox">
        <input type="radio" name="rating" tabindex="0" class="hidden" value="5">
        <label>5</label>
    </div>
  </div>
  </div>
  <div class="field">
    <label>Review</label>
    <textarea rows="2" name="review"></textarea>
  </div>
  <button class="mini ui button" type="submit" >
  Submit
  </button>
  `;
  $(".ui.radio.checkbox").checkbox();

  reviewForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const ratingInput = parseInt(event.target.rating.value);
    const reviewInput = event.target.review.value;
    const cocktailIdInput = parseInt(cocktailId);

    const review = {
      user_id: loggedInData.loggedInId,
      cocktail_id: cocktailIdInput,
      rating: ratingInput,
      review_text: reviewInput,
    };
    reviewForm.innerHTML = "";
    postNewReviewForm(review);
  });
};

const postNewReviewForm = (newReview) => {
  return fetch("http://localhost:3000/reviews", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newReview),
  })
    .then((response) => response.json())
    .then((reviewData) => {
      cocktailsJSON[reviewData.cocktail_id - 1].reviews.push(reviewData);
      const reviewsDiv = document.querySelector(
        `#reviews-${newReview.cocktail_id}`
      );
      reviewsDiv.innerHTML += renderReview(reviewData);
      // const updateReviewButton = document.querySelector(`#update-review-${reviewData.id}`);
      // updateReviewButton.dataset.id = reviewData.id;
      // updateReviewButton.addEventlistener("click", renderUpdateReviewForm);
    });
};

const renderUpdateReviewForm = (event) => {
  const reviewId = `${event.target.dataset.id}`;
  const reviewDiv = document.querySelector(`#review-${reviewId}`);

  reviewDiv.innerHTML += `
  <form class="update-review-form">
  <div class="ui form">
  <div class="inline fields">
    <div class="field">
      <div class="ui radio checkbox">
        <input type="radio" name="rating" checked="" tabindex="0" class="hidden" value="1">
        <label>1</label>
      </div>
    </div>
    <div class="field">
      <div class="ui radio checkbox">
        <input type="radio" name="rating" tabindex="0" class="hidden" value="2">
        <label>2</label>
      </div>
    </div>
    <div class="field">
      <div class="ui radio checkbox">
        <input type="radio" name="rating" tabindex="0" class="hidden" value="3">
        <label>3</label>
      </div>
    </div>
    <div class="field">
      <div class="ui radio checkbox">
        <input type="radio" name="rating" tabindex="0" class="hidden" value="4">
        <label>4</label>
      </div>
    </div>
    <div class="field">
      <div class="ui radio checkbox">
        <input type="radio" name="rating" tabindex="0" class="hidden" value="5">
        <label>5</label>
    </div>
  </div>
  </div>
  <div class="field">
    <label>Review</label>
    <textarea rows="2" name="review"></textarea>
  </div>
  <button class="mini ui button" type="submit" >
  Save
  </button>
  </form>
  `;
  $(".ui.radio.checkbox").checkbox();

  const updateReviewForm = document.querySelector(".update-review-form");
  updateReviewForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const ratingInput = parseInt(event.target.rating.value);
    const reviewInput = event.target.review.value;

    const review = {
      id: reviewId,
      rating: ratingInput,
      review_text: reviewInput,
    };
    updateReview(review);
    event.target.reset();
  });
};

const updateReview = (updatedReview) => {
  return fetch(`http://localhost:3000/reviews/${updatedReview.id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      rating: updatedReview.rating,
      review_text: updatedReview.review_text,
    }),
  }).then((response) => response.json())
    .then((updatedReviewData) => {
    const reviewsDiv = document.querySelector(
      `#reviews-${updatedReviewData.cocktail_id}`
    );
    const reviewDiv = document.querySelector(`#review-${updatedReview.id}`)
    reviewDiv.remove()
    reviewsDiv.innerHTML += renderReview(updatedReviewData);
    const updateReviewButton = document.querySelector(`#update-review-${updatedReview.id}`);
      updateReviewButton.dataset.id = updatedReview.id;
      updateReviewButton.addEventListener("click", renderUpdateReviewForm);
    
  });
};

let loggedInData = {
  loggedIn: false,
  loggedInUsername: undefined,
  loggedInId: undefined,
};

function loggedInView(name) {
  // all.innerHTML = "";
  lIMenu.innerHTML = "";
  menuArea.innerHTML = `
    <a class="item">Logout</a> 
    <a class="item" id="delete">Delete Account</a> 
    <class = "inline field"><h5 class="ui yellow inverted header">Hello ${name}!</h5>
    `;
  loggedInData = {
    loggedIn: true,
    loggedInUsername: name,
    loggedInId: usernameId,
  };

  getAndRenderCocktails();
  let logoutBtn = menuArea.querySelector("a");
  logoutBtn.addEventListener("click", landingView);

  let deleteAccounteBtn = menuArea.querySelector("#delete");
  deleteAccounteBtn.addEventListener("click", deleteFetch);
}

function landingView() {
  // console.log("not a user");
  loggedInData = {
    loggedIn: false,
    loggedInUsername: undefined,
    loggedInId: undefined,
  };
  renderBarBack();
  getAndRenderCocktails();
}

function renderBarBack() {
  lIMenu.innerHTML = `
  <form id="login-form">
  <div class="ui form">
    <div class="inline field">
      <br>
      <input type="text" name="username" placeholder="Username">
      <button class="ui button" type="submit">Login</button>
    </div>
  </div>
  </form>
`;
  menuArea.innerHTML = `
  <br>
  <button class="ui animated button" tabindex="0">
    <div class="visible content">Sign-up</div>
    <div class="hidden content">
      <i class="right arrow icon"></i>
    </div>
  </button>
`;
  let signUpBtn = menuArea.querySelector("button");
  signUpBtn.addEventListener("click", renderSignUpForm);
}

let signUpForm;
function renderSignUpForm(result) {
  // e.preventDefault();
  // menuArea.innerHTML = "";
  // all.innerHTML = "";
  cocktailCardDiv.innerHTML = "";
  cocktailCardDiv.innerHTML = `
    <br><br><br><br>
    <div class="ui inverted segment container">
    <div class="ui inverted form">
    <form> 
      <div class="two fields">
        <div class="field">
          <label>Username</label>
          <input type="text" name="username" placeholder="Please Enter a Valid Username">
        </div>
        <div class="field">
        <label>Age</label>
        <input type="number" name="age" min="21" max="120" required placeholder="Must Be >20">
        </div>
        <button class="ui button" type="submit">Submit</button>
      </div>
    </form> 
    <span> ${result ? "" : "Invalid Username!"}</span>
    </div>
  </div>
    `;
  signUpForm = all.querySelector("form");

  signUpForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let userObj = {
      name: e.target.username.value,
      age: parseInt(e.target.age.value),
    };
    postUserFetch(userObj);
  });
}

// ******************* Events Listeners *****************
verticalMenuDiv.addEventListener("click", filterCocktails);
document.addEventListener("click", showAll);

//prepopulate update review form
//seeding
//X if no reviews for cocktail don't show average
//X new forms should disappear/clear? after you submit
//X user_id is dynamic
//X only show update review button for reviews user wrote
//data is stale when you click see reviews after adding/updating, have to reload, state issue
//averages aren't updated until after reload, same issue as above, stale data

//styling
//align review buttons at bottom of cards
//star rating
//flip cards
//background

verticalMenuDiv.addEventListener("click", filterCocktails);
document.addEventListener("click", showAll);
loginForm.addEventListener("submit", login);
signUpBtn.addEventListener("click", renderSignUpForm);
