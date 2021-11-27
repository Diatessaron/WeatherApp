import {
  getCurrentLocation, getWeatherDataAndDisplayIt, displayRecentViewed,
  addToRecentViewed, displayWeatherData,
} from '../js/functions';

describe('getCurrentLocation', () => {
  it('should return not empty string', async () => {
    global.fetch = jest.fn(() => Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ city: 'Kazan`' }),
    }));

    const city = await getCurrentLocation();

    expect(city.length !== 0).toBeTruthy();
  });
  it('should return empty string', async () => {
    global.fetch = jest.fn(() => Promise.reject());
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
    const icon = 'http://asd.com';

    displayWeatherData(city, temp, icon);

    expect(cityElement.innerText).toBe('City: Kazan');
    expect(tempElement.innerText).toBe('Temperature: -1');
    expect(document.getElementById('image').src).toBe('http://asd.com/');
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
    global.fetch = jest.fn(() => Promise.reject());
    window.alert = jest.fn();

    await getWeatherDataAndDisplayIt('Kazan');

    expect(alert).toBeCalledTimes(1);
    expect(alert).toBeCalledWith('Error has occurred during weather request');
  });
});
