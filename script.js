document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      const searchInput = document.querySelector('input[type="search"]');
      const searchTerm = searchInput.value.trim();
      if (searchTerm) {
        const searchUrl = `search-results.html?q=${encodeURIComponent(searchTerm)}`;
        window.location.href = searchUrl;
      }
    });
  });
  document.addEventListener('DOMContentLoaded', () => {
    const categoryButtons = document.querySelectorAll('.mycategory-btn');
    categoryButtons.forEach(button => {
      button.addEventListener('click', () => {
        const searchTerm = button.dataset.category;
        window.location.href = `search-results.html?q=${encodeURIComponent(searchTerm)}`;
      });
    });
  });
  
  const params = new URLSearchParams(window.location.search);
  const searchTerm = params.get('q');
  
  if (searchTerm) {
    document.getElementById('searchTerm').textContent = searchTerm;
    const searchUrl = `https://www.themealdb.com/api/json/v1/1/search.php?s=${searchTerm}`;
    fetch(searchUrl)
      .then(response => response.json())
      .then(data => displaySearchResults(data))
      .catch(error => console.error('Error fetching data:', error));
  }
  
  function displaySearchResults(data) {
    const searchResultsContainer = document.getElementById('searchResults');
    if (data.meals === null) {
      searchResultsContainer.innerHTML = '<p>No meals found. Please try again.</p>';
    } else {
      const meals = data.meals.slice(0, 5);
      meals.forEach(meal => {
        const mealCard = `
          <div class="col-12 col-md-4 mb-4">
            <div class="card text-center h-100">
              <div class="card-header">
                <img src="${meal.strMealThumb}" class="card-img-top" alt="${meal.strMeal}">
              </div>
              <div class="card-body">
                <h5 class="card-title">${meal.strMeal}</h5>
                <p class="card-text"><strong>Meal ID:</strong> ${meal.idMeal}</p>
                <button class="btn btn-primary view-details-btn" data-id="${meal.idMeal}">View Details</button>
              </div>
            </div>
          </div>
        `;
        searchResultsContainer.innerHTML += mealCard;
      });
      if (data.meals.length > 5) {
        const showAllButtonDiv = document.getElementById('showAllButtonDiv');
        showAllButtonDiv.style.display = 'block';
        const showAllButton = document.getElementById('showAllButton');
        showAllButton.addEventListener('click', () => {
          displayAllSearchResults(data.meals.slice(5));
          showAllButtonDiv.style.display = 'none'; 
        });
      }
    }
  }
  
  function displayAllSearchResults(meals) {
    const searchResultsContainer = document.getElementById('searchResults');
    meals.forEach(meal => {
      const mealCard = `
        <div class="col-md-4 mb-4">
          <div class="card text-center h-100">
            <img src="${meal.strMealThumb}" class="card-img-top" alt="${meal.strMeal}">
            <div class="card-body">
              <h5 class="card-title">${meal.strMeal}</h5>
              <p class="card-text"><strong>Meal ID:</strong> ${meal.idMeal}</p>
              <button class="btn btn-primary view-details-btn" data-id="${meal.idMeal}">View Details</button>
            </div>
          </div>
        </div>
      `;
      searchResultsContainer.innerHTML += mealCard;
    });
  }
  
  const modal = document.getElementById('detailsModal');
  const modalContent = document.querySelector('.modal-content');
  const closeBtn = document.querySelector('.close');
  
  document.addEventListener('click', function (e) {
    if (e.target.classList.contains('view-details-btn')) {
      const mealId = e.target.getAttribute('data-id');
      const mealDetailsUrl = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`;
      fetch(mealDetailsUrl)
        .then(response => response.json())
        .then(data => {
          const meal = data.meals[0];
          const detailsHtml = `
          <div class="container meal-details text-center">
            <h2 class="meal-name">${meal.strMeal}</h2>
            <div class="row">
              <div class="col-md-12 ">
                <img src="${meal.strMealThumb}" class="img-fluid" alt="${meal.strMeal}">
              </div>
              <div class="col-md-12 mt-3">
                <p class="text-dark font-weight-bold">${meal.strCategory} | ${meal.strArea}</p>
              </div>
            </div>
            <div class="container">
              <div class="ingradients mt-3">
                <h3>Ingredients:</h3>
                <ul class= "row d-flex justify-content-center list-unstyled p-1">
                  ${getIngredientsList(meal)}
                </ul>
              </div>
              <div class="row">
                <div class="col-md-12">
                  <h3>Instructions:</h3>
                  <p class="border border-dark rounded p-1">${meal.strInstructions.replace(/STEP/g, "<strong>STEP</strong>")}</p>
                </div>
              </div>
            </div>
          `;
          document.getElementById('mealDetails').innerHTML = detailsHtml;
          modal.style.display = 'block';
        })
        .catch(error => console.error('Error fetching meal details:', error));
    }
  });
  
  closeBtn.onclick = function () {
    modal.style.display = 'none';
  };
  
  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = 'none';
    }
  };
  
  function getIngredientsList(meal) {
    let ingredientsList = '';
    for (let i = 1; i <= 20; i++) {
      if (meal[`strIngredient${i}`]) {
        ingredientsList += `<li class="col-6 col-md-4 col-lg-3 p-2"><span class="border border-info btn-block p-1 text-dark font-weight-bold bg-light">${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}</span></li>`;
      }
    }
    return ingredientsList;
  }
  