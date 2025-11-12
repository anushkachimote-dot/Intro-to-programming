/**
 * CATEGORY VIEW - STUDENTS IMPLEMENT
 * Group data by categories - good for understanding relationships and patterns
 */
function showCategories(data) {
  // TODO: Students implement this function
  // Requirements:
  // - Group data by a meaningful category (cuisine, neighborhood, price, etc.)
  // - Show items within each group
  // - Make relationships between groups clear
  // - Consider showing group statistics
  /*html*/
 
 

  
  // Filter for College Park only
  const collegeParkData = data.filter(item => {
    return item.city && item.city.toLowerCase() === 'college park';
  });
  
  // Filter for compliant establishments
  const compliantData = collegeParkData.filter(item => {
    const results = item.inspection_results || '';
    return results.toLowerCase().includes('compliant');
  });
  
  
  
  const restaurants = compliantData.filter(item => {
    const category = item.category || '';
    return category.toLowerCase().includes('restaurant');
  });
  
  const restaurantHTML = restaurants.length > 0 
    ? restaurants.map(item => `
        <div class="category-item">
          <span><strong>${item.name || 'Unknown'}</strong></span>
          <span>${new Date(item.inspection_date).toLocaleDateString()}</span>
        </div>
      `).join('')
    : '<div class="category-item"><span>No compliant restaurants found</span></div>';
  
  
  
 //Compliant Fast Food Chains in College Park

  
  const fastFood = compliantData.filter(item => {
    const category = item.category || '';
    return category.toLowerCase().includes('fast food');
  });
  
  const fastFoodHTML = fastFood.length > 0 
    ? fastFood.map(item => `
        <div class="category-item">
          <span><strong>${item.name || 'Unknown'}</strong></span>
          <span>${new Date(item.inspection_date).toLocaleDateString()}</span>
        </div>
      `).join('')
    : '<div class="category-item"><span>No compliant fast food chains found</span></div>';
  
  

  // Compliant Convenience Stores in College Park

  
  const convenienceStores = compliantData.filter(item => {
    const category = item.category || '';
    return category.toLowerCase().includes('convenience') || 
           category.toLowerCase().includes('store');
  });
  
  const storesHTML = convenienceStores.length > 0 
    ? convenienceStores.map(item => `
        <div class="category-item">
          <span><strong>${item.name || 'Unknown'}</strong></span>
          <span>${new Date(item.inspection_date).toLocaleDateString()}</span>
        </div>
      `).join('')
    : '<div class="category-item"><span>No compliant convenience stores found</span></div>';
  
  
 
  
  const html = `
    <h2 class="view-title">📂 Category View</h2>
    <p class="view-description">Compliant Food Establishments in College Park (Click to expand)</p>
    
    <!-- CATEGORY 1: Compliant Restaurants -->
    <div class="category-section">
      <h3 class="category-header category-toggle" onclick="
        const items = document.getElementById('restaurants');
        const icon = this.querySelector('.toggle-icon');
        if (items.style.maxHeight === '0px' || items.style.maxHeight === '') {
          items.style.maxHeight = '2000px';
          icon.textContent = '▲';
        } else {
          items.style.maxHeight = '0px';
          icon.textContent = '▼';
        }
      ">
        🍽️ Compliant Restaurants (${restaurants.length}) <span class="toggle-icon">▼</span>
      </h3>
      <div class="category-items" id="restaurants" style="max-height: 0px; overflow: hidden; transition: max-height 0.3s ease-out;">
        ${restaurantHTML}
      </div>
    </div>
    
    <!-- CATEGORY 2: Compliant Fast Food Chains -->
    <div class="category-section">
      <h3 class="category-header category-toggle" onclick="
        const items = document.getElementById('fastfood');
        const icon = this.querySelector('.toggle-icon');
        if (items.style.maxHeight === '0px' || items.style.maxHeight === '') {
          items.style.maxHeight = '2000px';
          icon.textContent = '▲';
        } else {
          items.style.maxHeight = '0px';
          icon.textContent = '▼';
        }
      ">
        🍔 Compliant Fast Food Chains (${fastFood.length}) <span class="toggle-icon">▼</span>
      </h3>
      <div class="category-items" id="fastfood" style="max-height: 0px; overflow: hidden; transition: max-height 0.3s ease-out;">
        ${fastFoodHTML}
      </div>
    </div>
    
    <!-- CATEGORY 3: Compliant Convenience Stores -->
    <div class="category-section">
      <h3 class="category-header category-toggle" onclick="
        const items = document.getElementById('stores');
        const icon = this.querySelector('.toggle-icon');
        if (items.style.maxHeight === '0px' || items.style.maxHeight === '') {
          items.style.maxHeight = '2000px';
          icon.textContent = '▲';
        } else {
          items.style.maxHeight = '0px';
          icon.textContent = '▼';
        }
      ">
        🏪 Compliant Convenience Stores (${convenienceStores.length}) <span class="toggle-icon">▼</span>
      </h3>
      <div class="category-items" id="stores" style="max-height: 0px; overflow: hidden; transition: max-height 0.3s ease-out;">
        ${storesHTML}
      </div>
    </div>
  `;
  
  return html;
}

export default showCategories;