const searcForm = document.querySelector("#search-form");
const movie = document.querySelector("#movies");
const urlPoster = "https://image.tmdb.org/t/p/w500";

function apiSearch(event) {
  event.preventDefault();
  //console.log("event: ", event);
  //console.log("Hello, world!");
  const searchText = document.querySelector(".form-control").value,
    server =
      "https://api.themoviedb.org/3/search/multi?api_key=6f901a307f9152261580666f11e60bb2&language=ru&query=" +
      searchText;
  if (searchText.trim().length === 0) {
    movie.innerHTML =
      '<h2 class="col-12 text-center text-danger">Поле поиска не должно быть пустым...</h2>';
    return;
  }
  movie.innerHTML = '<div class="spinner"></div>';
  //console.log("searchText: ", searchText);
  fetch(server)
    .then((value) => {
      if (value.status !== 200) {
        return Promise.reject(value);
      }
      return value.json();
    })
    .then((output) => {
      console.log(output);
      let inner = "";
      if (output.results.length === 0) {
        inner =
          '<h2 class="col-12 text-center text-info">По Вашему запросу ничего не найдено</h2>';
      }
      output.results.forEach((item) => {
        let nameItem = item.name || item.title;
        //console.log(nameItem);
        const poster = item.poster_path
          ? urlPoster + item.poster_path
          : "../img/no-poster.jpg";
        let dataInfo = "";
        if (item.media_type !== "person") {
          dataInfo = `data-id="${item.id}" data-type="${item.media_type}"`;
        }
        inner += `
          <div class="col-12 col-md-4 col-xl-3 item">
            <img src='${poster}' class='img_poster' alt='${nameItem}' ${dataInfo}'></img>
            <h5>${nameItem}</h5>
          </div>
        `;
      });
      movie.innerHTML = inner;
      addEventMedia();
    })
    .catch((reason) => {
      movie.innerHTML = "Oups ....";
      console.error("error: ", reason.status);
    });
}

searcForm.addEventListener("submit", apiSearch);

// function requestApi(method, url) {
//   return new Promise(function (resolve, reject) {
//     const request = new XMLHttpRequest();
//     request.open(method, url);
//     request.addEventListener("load", () => {
//       if (request.status !== 200) {
//         reject({ status: request.status });
//         return;
//       }
//       resolve(request.response);
//     });
//     request.addEventListener("error", () => {
//       reject({ status: request.status });
//     });
//     request.send();
//   });

//   request.addEventListener("readystatechange", () => {});
// }

function addEventMedia() {
  const media = movie.querySelectorAll("img[data-id]");
  media.forEach((elem) => {
    elem.style.cursor = "pointer";
    elem.addEventListener("click", showFullInfo);
  });
}

function showFullInfo() {
  //console.log(this.dataset.type);
  let url = "";
  if (this.dataset.type === "movie") {
    url =
      "https://api.themoviedb.org/3/movie/" +
      this.dataset.id +
      "?api_key=6f901a307f9152261580666f11e60bb2&language=ru";
  } else if (this.dataset.type === "tv") {
    url =
      "https://api.themoviedb.org/3/tv/" +
      this.dataset.id +
      "?api_key=6f901a307f9152261580666f11e60bb2&language=ru";
  } else {
    movie.innerHTML =
      '<h2 class="col-12 text-center text-danger">Произошла ошибка, повторите позже</h2>';
  }

  fetch(url)
    .then((value) => {
      if (value.status !== 200) {
        return Promise.reject(value);
      }
      return value.json();
    })
    .then((output) => {
      //console.log("output: ", output.homepage);
      movie.innerHTML = `
      <h4 class="col-12 text-center text-info">${
        output.name || output.title
      }</h4>
      
      <div class="col-4">
      <img src='${urlPoster + output.poster_path}' class='img_poster' alt='${
        output.name || output.title
      }'> 
      ${
        output.homepage
          ? `<p class="text-center"><a href="${output.homepage}" target="_blank">Официальный сайт</a></p>`
          : ""
      }  
      ${
        output.imdb_id
          ? `<p class="text-center"><a href="https://imdb.com/title/${output.imdb_id}" target="_blank">На сайте IMDB.com</a></p>`
          : ""
      }        
      </div>
      <div class="col-8">
      <p>Рейтинг: ${output.vote_average}</p>
      <p>Статус: ${output.status}</p>
      <p>Премьера: ${output.first_air_date || output.release_date}</p> 
      ${
        output.last_episode_to_air
          ? `<p class="text-left">${output.number_of_seasons} сезон ${output.last_episode_to_air.episode_number} серий вышло</p>`
          : ""
      }  
      <p>Статус: ${output.overview}</p>   
      <br>   
      <div class='youtube'></div>
      </div>
      `;
    })
    .catch((reason) => {
      movie.innerHTML = "Oups ....";
      console.error(reason || reason.status);
    });
}

document.addEventListener("DOMContentLoaded", () => {
  //console.log("Ура");
  fetch(
    "https://api.themoviedb.org/3/trending/all/week?api_key=6f901a307f9152261580666f11e60bb2&language=ru"
  )
    .then((value) => {
      if (value.status !== 200) {
        return Promise.reject(value);
      }
      return value.json();
    })
    .then((output) => {
      console.log(output);
      let inner =
        '<h4 class="col-12 text-center text-info">Популярное за неделю!</h4>';
      if (output.results.length === 0) {
        inner =
          '<h2 class="col-12 text-center text-info">По Вашему запросу ничего не найдено</h2>';
      }
      output.results.forEach((item) => {
        let nameItem = item.name || item.title;
        //console.log(nameItem);
        let mediaType = item.title ? "movie" : "tv";
        const poster = item.poster_path
          ? urlPoster + item.poster_path
          : "../img/no-poster.jpg";
        let dataInfo = `data-id="${item.id}" data-type="${mediaType}"`;

        inner += `
          <div class="col-12 col-md-4 col-xl-3 item">
            <img src='${poster}' class='img_poster' alt='${nameItem}' ${dataInfo}'></img>
            <h5>${nameItem}</h5>
          </div>
        `;
      });
      movie.innerHTML = inner;
      addEventMedia();
    })
    .catch((reason) => {
      movie.innerHTML = "Oups ....";
      console.error("error: ", reason.status);
    });
});
