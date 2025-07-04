const express = require("express");
const fs = require("fs");
const csv = require("csv-parser");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.static("public"));

// Helper function to parse date
const parseDate = (dateStr) => {
  const [day, month, year] = dateStr.split("/");
  return new Date(`${year}-${month}-${day}`);
};

app.get("/api/fuel-data", (req, res) => {
  const { town, page = 1, limit = 5 } = req.query;
  const results = [];

  fs.createReadStream(path.join(__dirname, "data", "May 2025.csv"))
    .pipe(csv())
    .on("data", (row) => {
      // Apply town filter if provided
      if (town && !row["Town"].toLowerCase().includes(town.toLowerCase()))
        return;

      results.push({
        town: row["Town"],
        fromDate: row["From (Date)"],
        toDate: row["To (Date)"],
        petrol: parseFloat(row["Super (PMS)"]),
        diesel: parseFloat(row["Diesel (AGO)"]),
        kerosene: parseFloat(row["Kerosene (IK)"]),
      });
    })
    .on("end", () => {
      // Calculate pagination
      const totalPages = Math.ceil(results.length / limit);
      const currentPage = Math.min(Math.max(1, parseInt(page)), totalPages);
      const start = (currentPage - 1) * limit;
      const end = start + limit;
      const paginatedResults = results.slice(start, end);

      res.json({
        data: paginatedResults,
        total: results.length,
        page: currentPage,
        limit: parseInt(limit),
        totalPages: totalPages,
        updated: new Date().toLocaleDateString("en-KE", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
      });
    })
    .on("error", (err) => {
      console.error("Error reading CSV:", err);
      res.status(500).json({ error: "Failed to read CSV file." });
    });
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
