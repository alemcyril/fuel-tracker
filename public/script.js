// Global variables
let currentPage = 1;
let limit = 5;

/**
 * Format currency in Kenyan Shillings
 * @param {number} amount - The amount to format
 * @returns {string} Formatted currency string
 */
const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

/**
 * Format date in Kenyan format
 * @param {string} dateStr - Date string in DD/MM/YYYY format
 * @returns {string} Formatted date string
 */
const formatDate = (dateStr) => {
  const [day, month, year] = dateStr.split("/");
  return new Date(`${year}-${month}-${day}`).toLocaleDateString("en-KE", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

/**
 * Update pagination controls based on current data
 * @param {Object} data - Response data from server
 */
const updatePagination = (data) => {
  const prevPageBtn = document.getElementById("prevPage");
  const nextPageBtn = document.getElementById("nextPage");
  const pageInfo = document.getElementById("pageInfo");

  prevPageBtn.disabled = data.page <= 1;
  nextPageBtn.disabled = data.page >= data.totalPages;
  pageInfo.textContent = `Page ${data.page} of ${data.totalPages} (${data.total} entries)`;
  currentPage = data.page;
};

/**
 * Update the UI with fuel prices
 * @param {Object} data - Response data from server
 */
const updateUI = (data) => {
  const pricesDiv = document.getElementById("prices");

  if (data.data.length === 0) {
    pricesDiv.innerHTML = '<div class="error">No results found</div>';
    return;
  }

  const output = data.data
    .map(
      (item) => `
    <div class="fuel">
      <div>
        <span class="fuel-town">${item.town}</span>
        <div class="date-range">Valid from ${formatDate(
          item.fromDate
        )} to ${formatDate(item.toDate)}</div>
        <div class="fuel-prices">
          <span><strong>Petrol</strong> ${formatCurrency(item.petrol)}</span>
          <span><strong>Diesel</strong> ${formatCurrency(item.diesel)}</span>
          <span><strong>Kerosene</strong> ${formatCurrency(
            item.kerosene
          )}</span>
        </div>
      </div>
    </div>
  `
    )
    .join("");

  pricesDiv.innerHTML = output;
  document.getElementById("last-updated").textContent = data.updated;
  updatePagination(data);
};

/**
 * Fetch fuel prices from the server
 * @param {number} page - Page number to fetch
 */
async function fetchFuelPrices(page = 1) {
  try {
    const town = document.getElementById("townSearch").value;
    const params = new URLSearchParams({
      page,
      limit,
      ...(town && { town }),
    });

    const response = await fetch(`/api/fuel-data?${params}`);
    const data = await response.json();
    updateUI(data);
  } catch (error) {
    console.error("Error fetching fuel prices:", error);
    document.getElementById("prices").innerHTML =
      "<p class='error'>Error loading fuel prices. Please try again later.</p>";
  }
}

/**
 * Handle page navigation
 * @param {number} newPage - Page number to navigate to
 */
const changePage = (newPage) => {
  if (newPage < 1) return;
  fetchFuelPrices(newPage);
};

// Initialize the app
document.addEventListener("DOMContentLoaded", () => {
  // Fetch initial data
  fetchFuelPrices();

  // Add search input event listener
  const searchInput = document.getElementById("townSearch");
  let searchTimeout;

  searchInput.addEventListener("input", () => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      currentPage = 1;
      fetchFuelPrices(currentPage);
    }, 300); // Debounce search to avoid too many requests
  });

  // Add entries per page selector event listener
  const entriesSelector = document.getElementById("entriesPerPage");
  entriesSelector.addEventListener("change", () => {
    limit = parseInt(entriesSelector.value);
    currentPage = 1;
    fetchFuelPrices(currentPage);
  });

  // Add pagination button event listeners
  document
    .getElementById("prevPage")
    .addEventListener("click", () => changePage(currentPage - 1));
  document
    .getElementById("nextPage")
    .addEventListener("click", () => changePage(currentPage + 1));
});
