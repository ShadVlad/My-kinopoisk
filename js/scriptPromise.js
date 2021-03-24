const searchForm = document.querySelector("#search-form");
const movie = document.querySelector("#movies");

function apiSearch(event) {
  event.preventDefault();
  //console.log("event: ", event);
  //console.log("Hello, world!");
  const searchText = document.querySelector(".form-control").value,
    server =
      "https://api.themoviedb.org/3/search/multi?api_key=c51d3f0070448d84fa60e1341dd94608&language=ru&query=" +
      searchText;
  movie.innerHTML = "Download...";
  //console.log("searchText: ", searchText);
  requestApi("GET", server)
    .then(function (result) {
      const output = JSON.parse(result);
      let inner = "";
      output.results.forEach((item) => {
        let nameItem = item.name || item.title;
        //console.log(nameItem);
        inner += `<div class="col-12 col-md-4 col-xl3">${nameItem}</div>`;
      });
      movie.innerHTML = inner;
      //console.log(output);
    })
    .catch((reason) => {
      movie.innerHTML = "Oups ....";
      console.log("error: ", reason.status);
    });
}

searchForm.addEventListener("submit", apiSearch);

function requestApi(method, url) {
  return new Promise(function (resolve, reject) {
    const request = new XMLHttpRequest();
    request.open(method, url);
    request.addEventListener("load", () => {
      if (request.status !== 200) {
        reject({ status: request.status });
        return;
      }
      resolve(request.response);
    });
    request.addEventListener("error", () => {
      reject({ status: request.status });
    });
    request.send();
  });

  request.addEventListener("readystatechange", () => {
    if (request.readyState !== 4) {
      movie.innerHTML = "Download...";
      //console.log("Download: ", movie.innerHTML);
      return;
    }

    // if (request.status !== 200) {
    //   movie.innerHTML = "Oups ....";
    //   //console.log("error: ", request.status);
    //   return;
    // }

    // const output = JSON.parse(request.responseText);

    // let inner = "";

    // output.results.forEach((item) => {
    //   let nameItem = item.name || item.title;
    //   //console.log(nameItem);
    //   inner += `<div class="col-12 col-md-4 col-xl3">${nameItem}</div>`;
    // });

    // movie.innerHTML = inner;
    // //console.log(output);
  });
}
