$(function() {
  let lastResult = null;

  function geocode(address, cb) {
    $.get('https://nominatim.openstreetmap.org/search', {
      q: address,
      format: 'json',
      limit: 1
    }, function(data) {
      if (data && data.length) cb(null, { lat: data[0].lat, lon: data[0].lon });
      else cb('Address not found');
    });
  }

  function renderWeather(address, w) {
    // Use OpenWeatherMap icon if available
    const icon = w.weather?.[0]?.icon
      ? `<img class="weather-icon" src="https://openweathermap.org/img/wn/${w.weather[0].icon}@2x.png" alt="icon">`
      : '';
    return `<div class="card"><div class="card-body">
      ${icon}
      <div>
        <h5>${address} (${w.name || ''})</h5>
        <p><b>Temp:</b> ${w.main?.temp ?? 'N/A'}°C (feels like ${w.main?.feels_like ?? 'N/A'}°C)</p>
        <p><b>Weather:</b> ${w.weather?.[0]?.main ?? 'N/A'} - ${w.weather?.[0]?.description ?? 'N/A'}</p>
        <p><b>Humidity:</b> ${w.main?.humidity ?? 'N/A'}% <b>Wind:</b> ${w.wind?.speed ?? 'N/A'} m/s</p>
        <p><b>Pressure:</b> ${w.main?.pressure ?? 'N/A'} hPa <b>Clouds:</b> ${w.clouds?.all ?? 'N/A'}%</p>
        <p><b>Rain (1h):</b> ${w.rain?.['1h'] ? w.rain['1h'] + ' mm' : 'N/A'}</p>
      </div>
    </div></div>`;
  }

  $('#weather-form').on('submit', function(e) {
    e.preventDefault();
    const address = $('#address').val();
    geocode(address, function(err, loc) {
      if (err) return $('#weather-result').html('<div class="alert alert-danger">'+err+'</div>');
      $.post('/weather', { address, lat: loc.lat, lon: loc.lon }, function(resp) {
        if (resp.success) {
          lastResult = { address, lat: loc.lat, lon: loc.lon, weather: resp.data };
          $('#weather-result').html(renderWeather(address, resp.data));
        } else {
          $('#weather-result').html('<div class="alert alert-danger">'+resp.error+'</div>');
        }
      });
    });
  });

  $('#save-btn').on('click', function() {
    if (!lastResult) return alert('No weather data to save!');
    $.post('/save', lastResult, function(resp) {
      alert(resp.success ? 'Saved!' : 'Save failed: ' + resp.error);
    });
  });

  $('#history-btn').on('click', function() {
    $.get('/history', function(resp) {
      if (resp.success) {
        let html = '<h3>History</h3><ul class="list-group">';
        resp.data.forEach(function(row) {
          let w = row.weather_json;
          if (typeof w === 'string') {
            try { w = JSON.parse(w); } catch (e) { w = {}; }
          }
          html += `<li class="list-group-item">${renderWeather(row.address, w)}<div><b>Time:</b> ${row.request_time}</div></li>`;
        });
        html += '</ul>';
        $('#history-list').html(html);
      } else {
        $('#history-list').html('<div class="alert alert-danger">'+resp.error+'</div>');
      }
    });
  });
});
