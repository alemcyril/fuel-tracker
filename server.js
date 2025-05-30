const express = require("express");
const fs = require("fs");
const csv = require("csv-parser");
const cors = require("cors");
const path = require("path");

const app = express();
const port = process.env.PORT || 3000;

// Enable CORS
app.use(cors());

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, "public")));

// Function to parse dates
function parseDate(dateStr) {
  const [day, month, year] = dateStr.split("/");
  return new Date(year, month - 1, day);
}

// Function to get CSV file path
function getCsvFilePath() {
  // Try different possible locations for the CSV file
  const possiblePaths = [
    path.join(__dirname, "data", "May 2025.csv"),
    path.join(__dirname, "May 2025.csv"),
    path.join(__dirname, "public", "data", "May 2025.csv"),
  ];

  for (const filePath of possiblePaths) {
    if (fs.existsSync(filePath)) {
      return filePath;
    }
  }
  return null;
}

// API endpoint to fetch fuel data
app.get("/api/fuel-prices", (req, res) => {
  const { town, page = 1, limit = 5 } = req.query;
  const results = [];
  let filteredResults = [];

  const csvFilePath = getCsvFilePath();

  if (!csvFilePath) {
    console.error("CSV file not found in any of the expected locations");
    return res.status(500).json({ error: "Fuel price data file not found" });
  }

  fs.createReadStream(csvFilePath)
    .pipe(csv())
    .on("data", (data) => results.push(data))
    .on("end", () => {
      // Filter by town if search term is provided
      if (town) {
        filteredResults = results.filter((item) =>
          item.Town.toLowerCase().includes(town.toLowerCase())
        );
      } else {
        filteredResults = results;
      }

      // Calculate pagination
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + parseInt(limit);
      const paginatedResults = filteredResults.slice(startIndex, endIndex);

      // Get the last updated date from the first record
      const lastUpdated = results[0]
        ? parseDate(results[0]["Date Updated"]).toLocaleDateString()
        : "N/A";

      res.json({
        data: paginatedResults,
        total: filteredResults.length,
        page: parseInt(page),
        limit: parseInt(limit),
        lastUpdated,
      });
    })
    .on("error", (error) => {
      console.error("Error reading CSV file:", error);
      res.status(500).json({ error: "Error reading fuel price data" });
    });
});

// Serve the main HTML file for all other routes
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Start the server
if (require.main === module) {
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
}

module.exports = app;
