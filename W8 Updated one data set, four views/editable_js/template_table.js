
/**
 * TABLE VIEW - STUDENTS IMPLEMENT
 * Display data in sortable rows - good for scanning specific information
 */
function showTable(data) {
  // TODO: Students implement this function
  // Requirements:
  // - Show data in a table format
  // - Include all important fields
  // - Make it easy to scan and compare
  // - Consider adding sorting functionality
  /*html*/ 
 

  const filteredData = data.filter(restaurant => {
    // Only College Park 
    const isCollegePark = restaurant.city && 
                          restaurant.city.toLowerCase() === 'college park';
    
    //  Only 2020 inspections
    let is2020 = false;
    if (restaurant.inspection_date) {
      const inspectionYear = new Date(restaurant.inspection_date).getFullYear();
      is2020 = inspectionYear === 2020;
    }
    
    return isCollegePark && is2020;
  });
  
  console.log(`Filtered: ${filteredData.length} out of ${data.length} establishments`);
  console.log('Filter criteria: College Park, 2020 inspections');
  

  
  //table header 
  const headerRow = `
    <tr>
      <th>Establishment Name</th>
      <th>Category</th>
      <th>City</th>
      <th>Zip Code</th>
      <th>Address</th>
      <th>Inspection Date</th>
    </tr>
  `;

 
  const tableRows = filteredData.map(restaurant => {
    
    const name = restaurant.name || 'Unknown';
    const category = restaurant.category || 'N/A';
    const city = restaurant.city || 'N/A';
    const zip = restaurant.zip || 'N/A';
    const address = restaurant.address_line_1 || 'N/A';
    const inspectionDate = restaurant.inspection_date 
      ? new Date(restaurant.inspection_date).toLocaleDateString() 
      : 'N/A';
    
    return `
      <tr>
        <td>${name}</td>
        <td>${category}</td>
        <td>${city}</td>
        <td>${zip}</td>
        <td>${address}</td>
        <td>${inspectionDate}</td>
      </tr>
    `;
  }).join('');


  const tableContent = filteredData.length > 0 ? `
    <table class="restaurant-table">
      <thead>
        ${headerRow}
      </thead>
      <tbody>
        ${tableRows}
      </tbody>
    </table>
  ` : `
    <div class="todo-implementation">
      <h3>No Results Found</h3>
      <p>No establishments found matching the filter criteria:</p>
      <p><strong>City:</strong> College Park</p>
      <p><strong>Year:</strong> 2020</p>
      <p>Try adjusting the filters in the code.</p>
    </div>
  `;

 
  return `
    <h2 class="view-title">📊 Table View</h2>
    <p class="view-description">College Park establishments inspected in 2020 (${filteredData.length} results)</p>
    ${tableContent}
  `;
}

export default showTable;