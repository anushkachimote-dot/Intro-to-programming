// ============================================
// TUTORIAL 6: LOAD REAL DATA
// From static data to async data loading
// ============================================

let restaurants = [];

document.addEventListener('DOMContentLoaded', () => {
  console.log('Tutorial 6: Async data loading ready!');

  const loadButton = document.querySelector('#load-data-button');
  const statusDisplay = document.querySelector('#loading-status');

  const displayButton = document.querySelector('#display-button');
  const filterButton = document.querySelector('#filter-button');
  const mapButton = document.querySelector('#map-button');
  const errorButton = document.querySelector('#error-button');

  // Reusable loader so recovery buttons can call the same logic
  async function loadRestaurants() {
    updateStatus('loading', 'Loading restaurant data...');
    toggleMethodButtons(false);
    loadButton.disabled = true;

    try {
      // Make URL robust to different hosting bases
      const url = new URL('./restaurants.json', window.location.href);

      const response = await fetch(url, { cache: 'no-store' });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      if (!Array.isArray(data)) throw new Error('Unexpected data format (expected an array)');
      restaurants = data;

      updateStatus('success', `Successfully loaded ${restaurants.length} restaurants`);
      toggleMethodButtons(true);
      loadButton.textContent = 'Reload Restaurant Data';
    } catch (error) {
      console.error('Load failed:', error);
      let tip = '';
      if (location.protocol === 'file:') {
        tip = `<p style="font-size:.9rem;color:#555">Tip: Because this page is opened via <code>file://</code>, many browsers block <code>fetch()</code> for local files. Start a local server (e.g., VS Code “Live Server”).</p>`;
      }
      updateStatus('error', 'Failed to load data. Please check your internet/server and try again.');
      const prev = document.querySelector('#load-error-msg');
      prev?.remove();
      statusDisplay.insertAdjacentHTML(
        'beforeend',
        `<div class="error-message" id="load-error-msg" role="alert">
          <p><strong>Uh-oh!</strong> We couldn’t fetch <code>restaurants.json</code>.</p>
          <p>
            <button id="retry-load" class="error-button" type="button">Retry</button>
          </p>
          ${tip}
        </div>`
      );
      document.querySelector('#retry-load')?.addEventListener('click', () => {
        document.querySelector('#load-error-msg')?.remove();
        loadRestaurants();
      });
    } finally {
      loadButton.disabled = false;
    }
  }

  // Wire main button
  loadButton.addEventListener('click', loadRestaurants);

  // ========== Array method demos ==========
  displayButton.addEventListener('click', () => {
    const restaurantList = document.querySelector('#restaurant-list');
    if (restaurants.length === 0) {
      restaurantList.innerHTML = '<p class="placeholder">No data loaded yet</p>';
      return;
    }
    restaurantList.innerHTML = '';
    restaurants.forEach(({ name, cuisine, rating, priceRange, neighborhood, hours, phoneNumber }) => {
      const item = document.createElement('div');
      item.className = 'restaurant-item';
      item.innerHTML = `
        <div class="restaurant-name">${name}</div>
        <div class="restaurant-cuisine">${cuisine} • ${neighborhood} • <span class="restaurant-price">${priceRange}</span></div>
        <div>Hours: ${hours}</div>
        <div>Rating: <span class="restaurant-rating">${rating.toFixed(1)}</span></div>
        <div>Phone: <a href="tel:${phoneNumber.replace(/[^0-9]/g, '')}">${phoneNumber}</a></div>
      `;
      restaurantList.appendChild(item);
    });
  });

  filterButton.addEventListener('click', () => {
    const filteredList = document.querySelector('#filtered-list');
    if (restaurants.length === 0) {
      filteredList.innerHTML = '<p class="placeholder">No data loaded yet</p>';
      return;
    }
    const cheapRestaurants = restaurants.filter(r => r.priceRange === '$');
    if (cheapRestaurants.length === 0) {
      filteredList.innerHTML = '<p class="placeholder">No matching restaurants</p>';
      return;
    }
    filteredList.innerHTML = '';
    cheapRestaurants.forEach(({ name, cuisine, priceRange }) => {
      const item = document.createElement('div');
      item.className = 'restaurant-item';
      item.innerHTML = `
        <div class="restaurant-name">${name}</div>
        <div class="restaurant-cuisine">${cuisine} • <span class="restaurant-price">${priceRange}</span></div>
      `;
      filteredList.appendChild(item);
    });
  });

  mapButton.addEventListener('click', () => {
    const mappedList = document.querySelector('#mapped-list');
    if (restaurants.length === 0) {
      mappedList.innerHTML = '<p class="placeholder">No data loaded yet</p>';
      return;
    }
    const names = restaurants.map(r => r.name);
    const top = restaurants.reduce((best, r) => (r.rating > (best?.rating ?? -Infinity) ? r : best), null);
    const topName = top?.name ?? 'N/A';
    mappedList.innerHTML = `
      <ul class="name-list">
        ${names.map(n => `<li>${n}</li>`).join('')}
      </ul>
      <p class="explanation"><em>Top-rated in this dataset:</em> <strong>${topName}</strong></p>
    `;
  });

  // ========== Error demo ==========
  errorButton.addEventListener('click', async () => {
    const errorDisplay = document.querySelector('#error-display');
    errorDisplay.innerHTML = '<div class="status-display loading"><p class="status-message">Trying to load from bad URL...</p></div>';
    try {
      const response = await fetch('nonexistent-file.json', { cache: 'no-store' });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      await response.json();
      errorDisplay.innerHTML = '<p class="placeholder">This should not appear</p>';
    } catch (error) {
      console.error('Demonstrated error:', error);
      errorDisplay.innerHTML = `
        <div class="error-message" role="alert">
          <p><strong>We tried a broken URL on purpose.</strong></p>
          <p>The request failed gracefully. You can retry the broken request or recover by loading the real data.</p>
          <p>
            <button id="retry-bad" class="error-button" type="button">Retry Broken Request</button>
            <button id="recover-load" class="method-button" type="button">Load Real Data Instead</button>
          </p>
        </div>
      `;
     document.querySelector('#retry-bad')?.addEventListener('click', () => {
  alert('Retry failed again! (This is just a demo message)');
});

      document.querySelector('#recover-load')?.addEventListener('click', () => {
        // Call the shared loader directly (was previously triggering a click)
        loadRestaurants();
      });
    }
  });
});

function toggleMethodButtons(enabled) {
  const buttons = [
    document.querySelector('#display-button'),
    document.querySelector('#filter-button'),
    document.querySelector('#map-button')
  ];
  buttons.forEach(button => {
    if (button) button.disabled = !enabled;
  });
}

function updateStatus(state, message) {
  const statusDisplay = document.querySelector('#loading-status');
  const statusMessage = statusDisplay.querySelector('.status-message');
  statusDisplay.classList.remove('loading', 'success', 'error');
  if (state !== 'ready') statusDisplay.classList.add(state);
  statusMessage.textContent = message;
}
