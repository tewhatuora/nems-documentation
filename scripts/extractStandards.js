const fs = require("fs");
const path = require("path");
const cheerio = require("cheerio");

const sourceDir = "./build";
const outputFilePath = "./build/assets/api-standards.json";

// Set to store Standards IDs to check uniqueness
const standardsIds = new Set();

// Regular expression to match the desired format (e.g., HNZAS_MUST_NOT_X_NOTATION_HEADERS)
const idFormatRegex = /^HNZAS_(MUST|MUST_NOT|SHOULD|SHOULD_NOT|MAY)_[\w_]+$/;

// extracts the API Standards from the HTML files, generated by the src/components/ApiStandard.jsx components
function extractDataFromHTML(filePath, htmlContent) {
  const $ = cheerio.load(htmlContent);
  const elementsWithDataStandardType = [];

  $("[data-standard-type]").each((index, element) => {
    const $element = $(element);

    if ($element.attr("data-duplicate") === "true") {
      return;
    }

    const standardType = $element.attr("data-standard-type");
    const content = $element.attr("data-extended-text");
    const id = $element.attr("id");

    // Check for duplicate IDs
    if (standardsIds.has(id)) {
      throw new Error(`Duplicate Standards ID found: ${id}`);
    }
    if (!idFormatRegex.test(id)) {
      throw new Error(
        `Invalid ID Standards format found: ${id}. Check the docs for format`
      );
    }

    standardsIds.add(id);
    elementsWithDataStandardType.push({ standardType, content, id, filePath });
  });

  return elementsWithDataStandardType;
}

function processHTMLFile(filePath) {
  const htmlContent = fs.readFileSync(filePath, "utf-8");
  return extractDataFromHTML(filePath, htmlContent);
}

// iterates recursively over the build directory and processes all HTML files
function processDirectory(directoryPath) {
  const fileNames = fs.readdirSync(directoryPath);

  const data = fileNames.flatMap((fileName) => {
    const filePath = path.join(directoryPath, fileName);
    if (fs.statSync(filePath).isDirectory()) {
      return processDirectory(filePath);
    } else if (fileName.endsWith(".html")) {
      return processHTMLFile(filePath);
    }
    return [];
  });

  return data;
}

function main() {
  const data = processDirectory(sourceDir);
  const groupedData = {};

  data.forEach(({ standardType, content, id, filePath }) => {
    if (!groupedData[standardType]) {
      groupedData[standardType] = [];
    }
    // generates a link to the standard in the generated html (including fragment)
    const link =
      filePath.replace("build", "").replace("/index.html", "") + `#${id}`;
    groupedData[standardType].push({ standardType, content, id, link });
  });

  const jsonData = JSON.stringify(groupedData, null, 2);
  fs.writeFileSync(outputFilePath, jsonData);

  console.log(`Standards extracted and grouped. Written to ${outputFilePath}`);
}

main();
