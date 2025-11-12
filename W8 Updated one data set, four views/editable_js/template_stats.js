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
  
 
  // STAT 1: Overall Compliance Rate
  let compliantCount = 0;
  let criticalCount = 0;
  let totalWithResults = 0;
  
  data.forEach(item => {
    if (item.inspection_results) {
      totalWithResults++;
      const results = item.inspection_results.toLowerCase();
      if (results.includes('compliant')) {
        compliantCount++;
      }
      if (results.includes('critical')) {
        criticalCount++;
      }
    }
  });
  
  const complianceRate = totalWithResults > 0 
    ? ((compliantCount / totalWithResults) * 100).toFixed(1) 
    : 0;
  const criticalRate = totalWithResults > 0
    ? ((criticalCount / totalWithResults) * 100).toFixed(1)
    : 0;
  
  // STAT 2: College Park Safety Score
  const collegeParkData = data.filter(item => 
    item.city && item.city.toLowerCase() === 'college park'
  );
  
  let cpCompliant = 0;
  let cpTotal = 0;
  collegeParkData.forEach(item => {
    if (item.inspection_results) {
      cpTotal++;
      if (item.inspection_results.toLowerCase().includes('compliant')) {
        cpCompliant++;
      }
    }
  });
  
  const cpSafetyScore = cpTotal > 0 
    ? ((cpCompliant / cpTotal) * 100).toFixed(1) 
    : 0;
  
  // STAT 3: Safest Food Category
  const categoryCompliance = {};
  
  data.forEach(item => {
    const category = item.category || 'Unknown';
    if (!categoryCompliance[category]) {
      categoryCompliance[category] = { total: 0, compliant: 0 };
    }
    
    if (item.inspection_results) {
      categoryCompliance[category].total++;
      if (item.inspection_results.toLowerCase().includes('compliant')) {
        categoryCompliance[category].compliant++;
      }
    }
  });
  
  // Find category with highest compliance rate (minimum 10 inspections)
  let safestCategory = 'N/A';
  let safestRate = 0;
  
  Object.entries(categoryCompliance).forEach(([category, stats]) => {
    if (stats.total >= 10) {
      const rate = (stats.compliant / stats.total) * 100;
      if (rate > safestRate) {
        safestRate = rate;
        safestCategory = category;
      }
    }
  });
  
  // STAT 4: Recent Inspection Trend (Last 12 months)
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
  
  let recentCompliant = 0;
  let recentTotal = 0;
  
  data.forEach(item => {
    if (item.inspection_date) {
      const inspectionDate = new Date(item.inspection_date);
      if (inspectionDate >= oneYearAgo && item.inspection_results) {
        recentTotal++;
        if (item.inspection_results.toLowerCase().includes('compliant')) {
          recentCompliant++;
        }
      }
    }
  });
  
  const recentComplianceRate = recentTotal > 0
    ? ((recentCompliant / recentTotal) * 100).toFixed(1)
    : 0;
  
  // STAT 5: Total Establishments & Cities
  const uniqueCities = new Set();
  data.forEach(item => {
    if (item.city) {
      uniqueCities.add(item.city);
    }
  });
  
  // STAT 6: Most Inspected Locations
  const cityCounts = {};
  data.forEach(item => {
    if (item.city) {
      cityCounts[item.city] = (cityCounts[item.city] || 0) + 1;
    }
  });
  
  const topCity = Object.entries(cityCounts).sort((a, b) => b[1] - a[1])[0];
  const topCityName = topCity ? topCity[0] : 'N/A';
  const topCityCount = topCity ? topCity[1] : 0;
  
  return `
    <h2 class="view-title">📊 Food Safety Statistics</h2>
    <p class="view-description">Make informed dining decisions with these safety insights</p>
    
    <div class="stats-section">
      <h3 style="color: #0e6505; margin-bottom: 1rem;">🎯 Overall Safety Metrics</h3>
      <div class="stats-grid">
        <div class="stat-card ${complianceRate >= 70 ? 'stat-good' : complianceRate >= 50 ? 'stat-warning' : 'stat-poor'}">
          <div class="stat-label">Overall Compliance Rate</div>
          <div class="stat-number">${complianceRate}%</div>
          <div class="stat-sublabel">${compliantCount} of ${totalWithResults} establishments</div>
        </div>
        
        <div class="stat-card ${criticalRate <= 10 ? 'stat-good' : criticalRate <= 20 ? 'stat-warning' : 'stat-poor'}">
          <div class="stat-label">Critical Violations</div>
          <div class="stat-number">${criticalRate}%</div>
          <div class="stat-sublabel">${criticalCount} establishments with issues</div>
        </div>
        
        <div class="stat-card">
          <div class="stat-label">Total Establishments</div>
          <div class="stat-number">${data.length}</div>
          <div class="stat-sublabel">Across ${uniqueCities.size} cities</div>
        </div>
      </div>
    </div>
    
    <div class="stats-section">
      <h3 style="color: #0e6505; margin-bottom: 1rem;">🏫 College Park Focus</h3>
      <div class="stats-grid">
        <div class="stat-card ${cpSafetyScore >= 70 ? 'stat-good' : cpSafetyScore >= 50 ? 'stat-warning' : 'stat-poor'}">
          <div class="stat-label">College Park Safety Score</div>
          <div class="stat-number">${cpSafetyScore}%</div>
          <div class="stat-sublabel">${cpCompliant} of ${cpTotal} pass inspections</div>
        </div>
        
        <div class="stat-card">
          <div class="stat-label">Safest Food Category</div>
          <div class="stat-number stat-text">${safestCategory}</div>
          <div class="stat-sublabel">${safestRate.toFixed(1)}% compliance rate</div>
        </div>
      </div>
    </div>
    
    <div class="safety-tip">
      <strong>💡 Safety Tip:</strong> Look for establishments with recent inspections and "compliant" status. 
      ${cpSafetyScore >= 70 ? 'College Park shows strong food safety compliance!' : 'Exercise caution and check recent inspection results.'}
    </div>
  `;
}

export default showStats;