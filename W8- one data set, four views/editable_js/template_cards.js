
/**
 * CARD VIEW - PROVIDED AS EXAMPLE
 * Display data as browsable cards - good for comparing individual items
 */
function showCards(data) {

  const sortedData = data
    .filter(item => item.inspection_date)  // Only include items with dates
    .sort((a, b) => {
      const dateA = new Date(a.inspection_date);
      const dateB = new Date(b.inspection_date);
      return dateB - dateA;  // Newest first
    });
  
  
  const recentSix = sortedData.slice(0, 6);
  
  const cardHTML = recentSix
    .map((restaurant) => {
    
      const name = restaurant.name || 'Unknown';
      const category = restaurant.category || 'N/A';
      const city = restaurant.city || 'N/A';
      const inspectionDate = restaurant.inspection_date 
        ? new Date(restaurant.inspection_date).toLocaleDateString() 
        : 'N/A';
      const results = restaurant.inspection_results || 'N/A';
      
      // Add icon 
      let resultIcon = '';
      if (results.toLowerCase().includes('compliant')) {
        resultIcon = '✓';
      } else if (results.toLowerCase().includes('critical')) {
        resultIcon = '⚠️';
      } else {
        resultIcon = '○';
      }
      
      return `
        <div class="restaurant-card">
          <h3>${name}</h3>
          <p class="card-category">${category}</p>
          <p class="card-city">${city}</p>
          <p class="card-results">${resultIcon} ${results}</p>
          <p class="card-date">Inspected: ${inspectionDate}</p>
        </div>
      `;
    })
    .join("");
  
  return `
    <h2 class="view-title">🃏 Card View</h2>
    <p class="view-description">6 Most Recently Inspected Food Establishments</p>
    <div class="card-grid">
      ${cardHTML}
    </div>
  `;
}

export default showCards;