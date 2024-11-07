#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

// Function to convert string to Pascal Case
function toPascalCase(str) {
  return str
    .split(/[\s-_]+/) // Split by spaces, hyphens, or underscores
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize first letter of each word
    .join(""); // Join words back together
}

// Function to convert string to camelCase
function toCamelCase(str) {
  return str
    .split(/[\s-_]+/) // Split by spaces, hyphens, or underscores
    .map((word, index) => {
      if (index === 0) {
        return word.toLowerCase(); // First word is lowercase
      }
      return word.charAt(0).toUpperCase() + word.slice(1); // Capitalize subsequent words
    })
    .join(""); // Join words back together
}

// Function to create template
function createTemplate(name) {
  // Convert the name to lowercase
  const lowerCaseName = name.toLowerCase();

  // Convert the name to Pascal Case and camel Case
  const pascalCaseName = toPascalCase(lowerCaseName);
  const camelCaseName = toCamelCase(lowerCaseName);

  // Define the folder path in the src directory
  const folderPath = path.join(__dirname, "..", "src", pascalCaseName);

  // Create the folder
  fs.mkdirSync(folderPath, { recursive: true });

  // Define the file names using the camelCaseName variable
  const files = [
    `${camelCaseName}.jsx`,
    `${camelCaseName}.spec.jsx`,
    `${camelCaseName}.stories.jsx`,
    "index.js",
  ];

  // Content template for the JSX file
  const jsxContent = `import React from "react";
import PropTypes from "prop-types";

export function PSA${pascalCaseName}({/*Props*/}) {
  return (
    <></>
  );
}

/* Define Props Type */

PSA${pascalCaseName}.propTypes = { };`;

  // Content template for the stories file
  const storiesContent = `import React from "react";
import { PSA${pascalCaseName} } from "./${camelCaseName}"; 

const meta = {
  component: PSA${pascalCaseName},
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
};

export default meta;

export const Default${pascalCaseName} = { 
  args: {
  },
};`;

  // Content template for the index file
  const indexContent = `import { PSA${pascalCaseName} } from "./${camelCaseName}"; 
export default PSA${pascalCaseName};`;

  // Create each file in the folder
  files.forEach((file) => {
    const filePath = path.join(folderPath, file);

    // Check if the file is the JSX file, stories file, or index file to add content
    if (file === `${camelCaseName}.jsx`) {
      fs.writeFileSync(filePath, jsxContent, "utf8");
    } else if (file === `${camelCaseName}.stories.jsx`) {
      fs.writeFileSync(filePath, storiesContent, "utf8");
    } else if (file === "index.js") {
      fs.writeFileSync(filePath, indexContent, "utf8");
    } else {
      fs.writeFileSync(filePath, "", "utf8"); // Create empty files for others
    }
  });

  const indexFilePath = path.join(__dirname, "..", "src", "index.js");
  const writeContent = `export { default as PSA${pascalCaseName} } from "./${pascalCaseName}/index";\n`;
  fs.writeFileSync(indexFilePath, writeContent, "utf8");

  console.log(`Created folder and files for: ${pascalCaseName}`);
}

// Get command line arguments from npm
const args = process.argv.slice(2);

// Extract the name argument
const nameArg = args.find((arg) => arg.startsWith("--name="));
if (!nameArg) {
  console.error("Please provide a name using the --name flag.");
  process.exit(1);
}

// Get the name value
const componentName = nameArg.split("=")[1];
createTemplate(componentName);
