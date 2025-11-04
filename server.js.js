const express = require("express");
const fs = require("fs");
const app = express();

function now() {
  return new Date().toISOString();
}

/**
 * Load valid scancodes:
 * 1) If ENV variable VALID_SCANCODES exists → use that
 *    Example: VALID_SCANCODES=ABC12,A123,XYZ
 * 2) Else → fallback to valid-scancodes.json
 */
function loadCodes() {

  if (process.env.VALID_SCANCODES) {
    console.log(`${now()} Using VALID_SCANCODES from ENV`);
    return process.env.VALID_SCANCODES
      .split(",")
      .map(x => x.trim().toUpperCase())
      .filter(x => x.length > 0);
  }

  try {
    const raw = fs.readFileSync("valid-scancodes.json", "utf8");
    const parsed = JSON.parse(raw);

    if (!Array.isArray(parsed)) {
      console.error(`${now()} JSON file is not an array`);
      return [];
    }

    console.log(`${now()} Using valid-scancodes.json`);
    return parsed.map(x => String(x).trim().toUpperCase());
  } catch (err) {
    console.error(`${now()} Cannot read valid-scancodes.json: ${err.message}`);
    return [];
  }
}

// eManager endpoint — GET and POST supported
const route = "/api/v1/extproductids/:ExtProductId/serials/:ScanCode/owners/:OwnerCode/extpicklistids/:ExtPicklistId/extpicklistlineids/:ExtPicklistLineId";

app.all(route, (req, res) => {
  const scan = (req.params.ScanCode || "").trim().toUpperCase();
  const validList = loadCodes();

  console.log(`${now()} REQUEST ${req.method} ${req
