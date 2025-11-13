/**
 * ENHANCED STATS VIEW with Chart.js
 * Show aggregate statistics with interactive visualizations
 */
function showStats(data) {
  // Calculate all statistics first
  
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
  
  // STAT 3: Category Compliance Analysis
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
  
  // Get top 6 categories by volume (for bar chart)
  const topCategories = Object.entries(categoryCompliance)
    .sort((a, b) => b[1].total - a[1].total)
    .slice(0, 6);
  
  // STAT 4: City Comparison (Top 5 cities)
  const cityCompliance = {};
  
  data.forEach(item => {
    const city = item.city || 'Unknown';
    if (!cityCompliance[city]) {
      cityCompliance[city] = { total: 0, compliant: 0 };
    }
    
    if (item.inspection_results) {
      cityCompliance[city].total++;
      if (item.inspection_results.toLowerCase().includes('compliant')) {
        cityCompliance[city].compliant++;
      }
    }
  });
  
  const topCities = Object.entries(cityCompliance)
    .filter(([_, stats]) => stats.total >= 10) // Only cities with 10+ inspections
    .sort((a, b) => b[1].total - a[1].total)
    .slice(0, 5);
  
  // STAT 5: Monthly Trend (Last 12 months)
  const monthlyData = {};
  const now = new Date();
  const twelveMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 11, 1);
  
  data.forEach(item => {
    if (item.inspection_date) {
      const inspectionDate = new Date(item.inspection_date);
      if (inspectionDate >= twelveMonthsAgo && inspectionDate <= now) {
        const monthKey = `${inspectionDate.getFullYear()}-${String(inspectionDate.getMonth() + 1).padStart(2, '0')}`;
        
        if (!monthlyData[monthKey]) {
          monthlyData[monthKey] = { total: 0, compliant: 0 };
        }
        
        if (item.inspection_results) {
          monthlyData[monthKey].total++;
          if (item.inspection_results.toLowerCase().includes('compliant')) {
            monthlyData[monthKey].compliant++;
          }
        }
      }
    }
  });
  
  // Sort months chronologically
  const sortedMonths = Object.keys(monthlyData).sort();
  
  // Generate HTML with chart canvases
  const html = `
    <h2 class="view-title">📊 Food Safety Statistics</h2>
    <p class="view-description">Interactive visualizations of PG County food inspection data</p>
    
    <div class="stats-section">
      <h3 style="color: #0e6505; margin-bottom: 1rem;">🎯 Overall Safety Overview</h3>
      <div class="chart-container" style="position: relative; height: 300px; margin-bottom: 2rem;">
        <canvas id="complianceDonutChart"></canvas>
      </div>
    </div>
    
    <div class="stats-section">
      <h3 style="color: #0e6505; margin-bottom: 1rem;">🏪 Compliance by Category</h3>
      <div class="chart-container" style="position: relative; height: 350px; margin-bottom: 2rem;">
        <canvas id="categoryBarChart"></canvas>
      </div>
    </div>
    
    <div class="safety-tip">
      <strong>💡 Interactive Charts:</strong> Hover over charts to see detailed information. 
      ${cpSafetyScore >= 70 ? 'College Park shows strong food safety compliance!' : 'Exercise caution and check recent inspection results.'}
    </div>
  `;
  
  // Use setTimeout to ensure DOM is ready before creating charts
  setTimeout(() => {
    createCharts(data, {
      compliantCount,
      criticalCount,
      totalWithResults,
      topCategories,
      topCities,
      sortedMonths,
      monthlyData,
      cpSafetyScore
    });
  }, 0);
  
  return html;
}

/**
 * Create all Chart.js visualizations
 */
function createCharts(data, stats) {
  // Destroy existing charts if they exist
  if (window.statsCharts) {
    window.statsCharts.forEach(chart => chart.destroy());
  }
  window.statsCharts = [];
  
  // 1. DONUT CHART - Overall Compliance
  const donutCtx = document.getElementById('complianceDonutChart');
  if (donutCtx) {
    const nonCritical = stats.compliantCount;
    const critical = stats.criticalCount;
    const other = stats.totalWithResults - stats.compliantCount - stats.criticalCount;
    
    const donutChart = new Chart(donutCtx, {
      type: 'doughnut',
      data: {
        labels: ['Compliant', 'Critical Violations', 'Other'],
        datasets: [{
          data: [nonCritical, critical, other],
          backgroundColor: [
            '#28a745',  // Green for compliant
            '#dc3545',  // Red for critical
            '#ffc107'   // Yellow for other
          ],
          borderWidth: 3,
          borderColor: '#fff'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              font: { size: 14 },
              padding: 15
            }
          },
          title: {
            display: true,
            text: 'Overall Inspection Results Distribution',
            font: { size: 16, weight: 'bold' }
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                const label = context.label || '';
                const value = context.parsed || 0;
                const percentage = ((value / stats.totalWithResults) * 100).toFixed(1);
                return `${label}: ${value} (${percentage}%)`;
              }
            }
          }
        }
      }
    });
    window.statsCharts.push(donutChart);
  }
  
  // 2. BAR CHART - Category Compliance
  const barCtx = document.getElementById('categoryBarChart');
  if (barCtx) {
    const categoryLabels = stats.topCategories.map(([cat, _]) => cat);
    const categoryCompliant = stats.topCategories.map(([_, stats]) => stats.compliant);
    const categoryNonCompliant = stats.topCategories.map(([_, stats]) => stats.total - stats.compliant);
    
    const barChart = new Chart(barCtx, {
      type: 'bar',
      data: {
        labels: categoryLabels,
        datasets: [
          {
            label: 'Compliant',
            data: categoryCompliant,
            backgroundColor: '#28a745',
            borderColor: '#1e7e34',
            borderWidth: 2
          },
          {
            label: 'Non-Compliant',
            data: categoryNonCompliant,
            backgroundColor: '#dc3545',
            borderColor: '#bd2130',
            borderWidth: 2
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            stacked: true,
            ticks: {
              font: { size: 11 },
              maxRotation: 45,
              minRotation: 45
            }
          },
          y: {
            stacked: true,
            beginAtZero: true,
            title: {
              display: true,
              text: 'Number of Inspections'
            }
          }
        },
        plugins: {
          legend: {
            position: 'top'
          },
          title: {
            display: true,
            text: 'Top 6 Categories by Inspection Volume',
            font: { size: 16, weight: 'bold' }
          },
          tooltip: {
            callbacks: {
              afterLabel: function(context) {
                const total = stats.topCategories[context.dataIndex][1].total;
                const percentage = ((context.parsed.y / total) * 100).toFixed(1);
                return `${percentage}% of category`;
              }
            }
          }
        }
      }
    });
    window.statsCharts.push(barChart);
  }
  
  // 3. HORIZONTAL BAR CHART - City Comparison
  const cityCtx = document.getElementById('cityComparisonChart');
  if (cityCtx) {
    const cityLabels = stats.topCities.map(([city, _]) => city);
    const cityRates = stats.topCities.map(([_, stats]) => 
      ((stats.compliant / stats.total) * 100).toFixed(1)
    );
    const cityTotals = stats.topCities.map(([_, stats]) => stats.total);
    
    const cityChart = new Chart(cityCtx, {
      type: 'bar',
      data: {
        labels: cityLabels,
        datasets: [{
          label: 'Compliance Rate (%)',
          data: cityRates,
          backgroundColor: cityRates.map(rate => 
            rate >= 70 ? '#28a745' : rate >= 50 ? '#ffc107' : '#dc3545'
          ),
          borderColor: '#0e6505',
          borderWidth: 2
        }]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            beginAtZero: true,
            max: 100,
            title: {
              display: true,
              text: 'Compliance Rate (%)'
            }
          }
        },
        plugins: {
          legend: {
            display: false
          },
          title: {
            display: true,
            text: 'Compliance Rates by City (10+ Inspections)',
            font: { size: 16, weight: 'bold' }
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                const cityIndex = context.dataIndex;
                const total = cityTotals[cityIndex];
                const rate = context.parsed.x;
                return [
                  `Compliance Rate: ${rate}%`,
                  `Total Inspections: ${total}`
                ];
              }
            }
          }
        }
      }
    });
    window.statsCharts.push(cityChart);
  }
  
  // 4. LINE CHART - 12-Month Trend
  const lineCtx = document.getElementById('trendLineChart');
  if (lineCtx) {
    const monthLabels = stats.sortedMonths.map(month => {
      const [year, monthNum] = month.split('-');
      const date = new Date(year, parseInt(monthNum) - 1);
      return date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
    });
    
    const complianceRates = stats.sortedMonths.map(month => {
      const monthStats = stats.monthlyData[month];
      return monthStats.total > 0 
        ? ((monthStats.compliant / monthStats.total) * 100).toFixed(1)
        : 0;
    });
    
    const inspectionCounts = stats.sortedMonths.map(month => {
      return stats.monthlyData[month].total;
    });
    
    const lineChart = new Chart(lineCtx, {
      type: 'line',
      data: {
        labels: monthLabels,
        datasets: [
          {
            label: 'Compliance Rate (%)',
            data: complianceRates,
            borderColor: '#0e6505',
            backgroundColor: 'rgba(14, 101, 5, 0.1)',
            tension: 0.3,
            fill: true,
            yAxisID: 'y'
          },
          {
            label: 'Total Inspections',
            data: inspectionCounts,
            borderColor: '#007cba',
            backgroundColor: 'rgba(0, 124, 186, 0.1)',
            tension: 0.3,
            fill: true,
            yAxisID: 'y1'
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: 'index',
          intersect: false
        },
        scales: {
          y: {
            type: 'linear',
            display: true,
            position: 'left',
            beginAtZero: true,
            max: 100,
            title: {
              display: true,
              text: 'Compliance Rate (%)'
            }
          },
          y1: {
            type: 'linear',
            display: true,
            position: 'right',
            beginAtZero: true,
            title: {
              display: true,
              text: 'Number of Inspections'
            },
            grid: {
              drawOnChartArea: false
            }
          }
        },
        plugins: {
          legend: {
            position: 'top'
          },
          title: {
            display: true,
            text: 'Inspection Trends Over Last 12 Months',
            font: { size: 16, weight: 'bold' }
          },
          tooltip: {
            callbacks: {
              afterBody: function(context) {
                const index = context[0].dataIndex;
                const month = stats.sortedMonths[index];
                const monthStats = stats.monthlyData[month];
                return `\nCompliant: ${monthStats.compliant}\nTotal: ${monthStats.total}`;
              }
            }
          }
        }
      }
    });
    window.statsCharts.push(lineChart);
  }
}

export default showStats;