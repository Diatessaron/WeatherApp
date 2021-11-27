import { getCurrentLocation, getWeatherDataAndDisplayIt } from './functions';

getCurrentLocation()
  .then((rs) => getWeatherDataAndDisplayIt(rs.replace('’', '')));

const button = document.getElementById('button');
button.addEventListener('click', async () => {
  const input = document.getElementById('input');
  const city = input.value.charAt(0).toUpperCase() + input.value.toLowerCase().slice(1);
  input.value = '';
  await getWeatherDataAndDisplayIt(city);
});
