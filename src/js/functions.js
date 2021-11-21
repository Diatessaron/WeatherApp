export function getCurrentLocation() {
  return fetch('https://get.geojs.io/v1/ip/geo.json')
    .then((rs) => rs.json())
    .then((rs) => rs.city)
    .catch((error) => console.log('Error has occurred during icon request', error));
}

export function displayWeatherData(city, temp, icon) {
  const img = document.createElement('img');
  const iconElement = document.getElementById('icon');
  const cityElement = document.getElementById('city');
  const tempElement = document.getElementById('temperature');

  img.src = URL.createObjectURL(icon);
  document.getElementById('image')?.remove();
  img.id = 'image';
  iconElement.parentNode.insertBefore(img, iconElement.nextSibling);

  cityElement.innerText = `City: ${city}`;
  tempElement.innerText = `Temperature: ${temp}`;
}

export function addToRecentViewed(currentCity) {
  localStorage.setItem(currentCity, new Date().toString());

  if (localStorage.length > 10) {
    let oldest = localStorage.key(0);
    for (let i = 0; i < localStorage.length; i++) {
      const city = localStorage.key(i);
      if (localStorage.getItem(oldest) !== undefined && new Date(localStorage.getItem(oldest)) > new Date(localStorage.getItem(city))) {
        oldest = city;
      }
    }

    localStorage.removeItem(oldest);
  }
}

export function displayRecentViewed() {
  const elements = document.getElementsByClassName('listElement');
  while (elements.length > 0) {
    elements[0].parentNode.removeChild(elements[0]);
  }

  const cities = [];

  for (let i = 0; i < localStorage.length; i++) {
    cities.push(localStorage.key(i));
  }

  cities.sort((el1, el2) => new Date(localStorage.getItem(el1)).getTime() - new Date(localStorage.getItem(el2)).getTime());
  const list = document.getElementById('list');

  for (let i = 0; i < cities.length; i++) {
    const city = cities[i];
    const element = document.createElement('li');
    element.className = 'listElement';
    element.addEventListener('click', () => getWeatherDataAndDisplayIt(city));
    element.innerText = city;

    list.appendChild(element);
  }
}

export async function getWeatherDataAndDisplayIt(city) {
  let response;

  try {
    response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.WEATHER_API_KEY}`, {
      method: 'POST',
    })
      .then((rs) => {
        if (rs.ok) {
          return rs.json();
        }
        throw new Error('Error during request');
      });
  } catch (e) {
    alert('Error has occurred during weather request');
    return;
  }

  const temp = Math.ceil(response.main.temp - 273.15);
  const icon = await fetch(`https://openweathermap.org/img/wn/${response.weather[0].icon}@2x.png`)
    .then((rs) => rs.blob())
    .catch((error) => console.log('Error has occurred during icon request', error));

  document.getElementById('mapImage')?.remove();
  const img = document.createElement('img');
  img.src = `https://static-maps.yandex.ru/1.x/?ll=${response.coord.lon},${response.coord.lat}&size=350,350&z=13&l=map`;
  img.id = 'mapImage';
  document.getElementById('map').appendChild(img);

  displayWeatherData(city, temp, icon);
  addToRecentViewed(city);
  displayRecentViewed();
}
