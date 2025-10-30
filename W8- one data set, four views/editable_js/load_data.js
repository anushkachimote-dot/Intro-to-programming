// ============================================
// DATA LOADING - Students modify this
// ============================================
/**
 * Load data from API - Students replace with their chosen endpoint
 */
async function loadData() {
  try {
    // TODO: Replace with student's chosen API
    // Examples:
    // const response = await fetch('https://data.princegeorgescountymd.gov/resource/xxxx.json');
    // const response = await fetch('https://api.nasa.gov/neo/rest/v1/feed?api_key=DEMO_KEY');
    // const data = await response.json();

    
    // PG County Restaurants API endpoint
    const apiUrl = 'https://data.princegeorgescountymd.gov/resource/umjn-t2iz.json';
    
    console.log("Fetching data from PG County API...");
    
    // Fetch data from the API
    const response = await fetch(apiUrl);
    
    // Check if the request was successful
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    // Parse the JSON data
    const data = await response.json();
    
    console.log("Data loaded successfully:", data);
    console.log("Number of restaurants:", data.length);
    
    // Optional: Log the first item to see what fields are available
    if (data.length > 0) {
      console.log("Sample restaurant data:", data[0]);
    }
    
    return data;
    
  } catch (error) {
    console.error("Failed to load data:", error);
    throw new Error("Could not load data from PG County API: " + error.message);
  }
}

export default loadData;
    
    // Simulate API delay
    // await new Promise((resolve) => setTimeout(resolve, 1000));
    // return mockRestaurantData;
 


