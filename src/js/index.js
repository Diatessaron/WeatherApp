import { getCurrentLocation, getWeatherDataAndDisplayIt } from './functions';

window.localStorage.clear();

getCurrentLocation()
  .then((rs) => getWeatherDataAndDisplayIt(rs.replace('’', '')));

const button = document.getElementById('button');
button.addEventListener('click', async () => {
  const input = document.getElementById('input');
  const city = input.value;
  input.value = '';
  await getWeatherDataAndDisplayIt(city);
});
