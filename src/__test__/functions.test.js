import fetchMock from 'jest-fetch-mock';
import {
  getCurrentLocation, getWeatherDataAndDisplayIt, displayRecentViewed,
  addToRecentViewed, displayWeatherData,
} from '../js/functions';

require('jest-fetch-mock').enableMocks();

describe('getCurrentLocation', () => {
  it('should return not empty string', async () => {
    fetchMock.mockOnce('{"city":"Kazan’"}');

    const city = await getCurrentLocation();

    expect(city.length !== 0).toBeTruthy();
  });
  it('should return empty string', async () => {
    fetchMock.mockRejectOnce();
    console.log = jest.fn();

    const city = await getCurrentLocation();

    expect(city === undefined).toBeTruthy();
    expect(console.log).toBeCalledWith('Error has occurred during icon request', undefined);
  });
});

describe('displayWeatherData', () => {
  it('should set new data to HTML', () => {
    document.body.innerHTML = '<p style="display:inline" id="city">City: </p>\n'
            + '<p style="display:inline;margin-left: 190px" id="temperature">Temperature: </p>\n'
            + '<p style="display:inline;margin-left: 190px" id="icon">Icon: </p>';

    const cityElement = document.getElementById('city');
    const tempElement = document.getElementById('temperature');

    const city = 'Kazan';
    const temp = '-1';
    const icon = new Blob(new Uint8Array([123]), { type: 'image/png' });
    window.URL.createObjectURL = jest.fn();

    displayWeatherData(city, temp, icon);

    expect(cityElement.innerText).toBe('City: Kazan');
    expect(tempElement.innerText).toBe('Temperature: -1');
    expect(window.URL.createObjectURL).toBeCalledWith(icon);
  });
});

describe('addToRecentViewed', () => {
  it('should set city to local storage', () => {
    addToRecentViewed('Kazan');

    expect(localStorage.getItem('Kazan') !== undefined).toBeTruthy();
  });
  it('should delete oldest city in local storage', () => {
    for (let i = 0; i < 10; i++) {
      addToRecentViewed(`asd${i}`);
    }

    addToRecentViewed('Kazan');

    expect(localStorage.length).toBe(10);
    expect(localStorage.getItem('asd0') === null).toBeTruthy();
    expect(localStorage.getItem('Kazan') !== null).toBeTruthy();
    for (let i = 1; i <= 9; i++) {
      expect(localStorage.getItem(`asd${i}`) !== null).toBeTruthy();
    }
  });
});

describe('displayRecentViewed', () => {
  it('should clear list and correctly edit html', () => {
    document.body.innerHTML = '<ul id="list">'
            + "<li id='listElement'></li>"
            + '</ul>';

    for (let i = 0; i < 10; i++) {
      addToRecentViewed(`asd${i}`);
    }

    displayRecentViewed();
    const actual = document.getElementsByClassName('listElement');

    expect(actual.length).toBe(10);
    for (let i = 0; i < 10; i++) {
      expect(actual[i].innerText).toBe(`asd${i}`);
    }
  });
});

describe('getWeatherDataAndDisplayIt', () => {
  it('should clear list and correctly edit html', async () => {
    fetchMock.mockOnce('{\n'
            + '   "main":{\n'
            + '      "temp":273.51,\n'
            + '   },\n'
            + '}');
    window.alert = jest.fn();

    await getWeatherDataAndDisplayIt('Kazan');

    expect(alert).toBeCalledTimes(1);
    expect(alert).toBeCalledWith('Error has occurred during weather request');
  });
});
