/**
 * STATS VIEW - STUDENTS IMPLEMENT
 * Show aggregate statistics and insights - good for understanding the big picture
 */
function showStats(data) {
  // TODO: Students implement this function
  // Requirements:
  // - Calculate meaningful statistics from the dataset
  // - Present insights visually
  // - Show distributions, averages, counts, etc.
  // - Help users understand patterns in the data
  /*html*/
  
  
  // cities
  const cityList = [];
  data.forEach(item => {
    if (item.city && !cityList.includes(item.city)) {
      cityList.push(item.city);
    }
  });
  const totalCities = cityList.length;
  
  // Average inspections per city
  const avgInspectionsPerCity = (data.length / totalCities).toFixed(1);
  
  // Most common food type
  const typeCounts = {};
  data.forEach(item => {
    const type = item.category || 'Unknown';
    typeCounts[type] = (typeCounts[type] || 0) + 1;
  });
  
  const sortedTypes = Object.entries(typeCounts).sort((a, b) => b[1] - a[1]);
  const mostCommonType = sortedTypes[0][0];
  const mostCommonTypeCount = sortedTypes[0][1];
  
  // Most active inspection year
  const yearCounts = {};
  data.forEach(item => {
    if (item.inspection_date) {
      const year = new Date(item.inspection_date).getFullYear();
      if (!isNaN(year)) {
        yearCounts[year] = (yearCounts[year] || 0) + 1;
      }
    }
  });
  
  const sortedYears = Object.entries(yearCounts).sort((a, b) => b[1] - a[1]);
  const mostActiveYear = sortedYears[0][0];
  const mostActiveYearCount = sortedYears[0][1];
  
  // Inspection trend
  const years = Object.keys(yearCounts).map(Number).sort();
  const minYear = Math.min(...years);
  const maxYear = Math.max(...years);
  const midYear = Math.floor((minYear + maxYear) / 2);
  
  let earlyYearsCount = 0;
  let recentYearsCount = 0;
  
  Object.entries(yearCounts).forEach(([year, count]) => {
    if (parseInt(year) <= midYear) {
      earlyYearsCount += count;
    } else {
      recentYearsCount += count;
    }
  });
  
 
  //  Least Inspected Type
  
  const leastCommonType = sortedTypes[sortedTypes.length - 1][0];
  const leastCommonTypeCount = sortedTypes[sortedTypes.length - 1][1];
  return `
    <h2 class="view-title">📈 Statistics View</h2>
    <p class="view-description">Key insights and trends from PG County food inspection data</p>
    
    <div class="stats-grid">
      
      <div class="stat-card">
        <div class="stat-label">Cities Covered</div>
        <div class="stat-number">${totalCities}</div>
        <div class="stat-sublabel">Across PG County</div>
      </div>
      
      <div class="stat-card">
        <div class="stat-label">Average Per City</div>
        <div class="stat-number">${avgInspectionsPerCity}</div>
        <div class="stat-sublabel">Inspections</div>
      </div>
      
      <div class="stat-card">
        <div class="stat-label">Most Common Type</div>
        <div class="stat-number stat-text">${mostCommonType}</div>
        <div class="stat-sublabel">${mostCommonTypeCount} establishments</div>
      </div>
      
      <div class="stat-card">
        <div class="stat-label">Most Active Year</div>
        <div class="stat-number">${mostActiveYear}</div>
        <div class="stat-sublabel">${mostActiveYearCount} inspections</div>
      </div>
      
      <div class="stat-card">
        <div class="stat-label">Least Inspected Type</div>
        <div class="stat-number stat-text">${leastCommonType}</div>
        <div class="stat-sublabel">${leastCommonTypeCount} establishments</div>
      </div>
      
    </div>
    
      </div>
    </div>
  `;
}

export default showStats;
                