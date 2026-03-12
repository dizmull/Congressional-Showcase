/* Map — renders Leaflet map with participant markers */
(function () {
  var container = document.getElementById('map-container');
  if (!container || typeof L === 'undefined') return;

  var map = L.map('map-container').setView([39.8283, -98.5795], 4);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 18
  }).addTo(map);

  // Custom marker icon — CAC navy circle
  var markerIcon = L.divIcon({
    className: 'custom-marker',
    html: '<div style="width:14px;height:14px;background:#000f63;border:2px solid #fff;border-radius:50%;box-shadow:0 2px 6px rgba(0,0,0,0.3);"></div>',
    iconSize: [14, 14],
    iconAnchor: [7, 7],
    popupAnchor: [0, -10]
  });

  fetch('./projects.json')
    .then(function (res) { return res.json(); })
    .then(function (projects) {
      if (!Array.isArray(projects)) return;

      var markers = [];

      projects.forEach(function (project) {
        if (!project.location || !project.location.lat || !project.location.lng) return;

        var marker = L.marker([project.location.lat, project.location.lng], { icon: markerIcon })
          .addTo(map);

        var popupContent = document.createElement('div');
        popupContent.style.textAlign = 'center';
        popupContent.style.fontFamily = 'system-ui, sans-serif';

        var nameEl = document.createElement('strong');
        nameEl.textContent = project.name || 'Unknown';

        var appEl = document.createElement('div');
        appEl.style.fontSize = '0.9em';
        appEl.style.color = '#666';
        appEl.textContent = project.appName || '';

        var link = document.createElement('a');
        link.href = 'sites/' + project.slug + '/';
        link.textContent = 'View Project \u2192';
        link.style.display = 'block';
        link.style.marginTop = '0.4em';
        link.style.fontWeight = '600';
        link.style.color = '#a53535';

        popupContent.appendChild(nameEl);
        if (project.appName) popupContent.appendChild(appEl);
        popupContent.appendChild(link);

        marker.bindPopup(popupContent);
        markers.push(marker);
      });

      if (markers.length > 0) {
        var group = L.featureGroup(markers);
        map.fitBounds(group.getBounds().pad(0.15));
      }
    })
    .catch(function () {
      // Failed to load projects — map stays at default view
    });
})();
