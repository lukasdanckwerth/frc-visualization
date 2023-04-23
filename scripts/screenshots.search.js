const puppeteer = require("puppeteer");
const fileAccess = require("./file.access");
const fs = require("fs");
const path = require("path");
const innovationLists = require("../data/innovation-lists.json");
const { exit } = require("process");
const searchesPath = "data/searches";
const targetDirPath = "generated/searches";
const targetWordlistDirPath = "generated/searches-wordlists";
const url = "http://127.0.0.1:8080/resources/search.html";

if (!innovationLists) {
  throw new Error("no innovation lists found.");
}

function echo(...args) {
  console.log("[screenshots:search]  ", ...args);
}

function createDirectory(path) {
  return fs.mkdirSync(path, { recursive: true });
}

function createTargetDirectory() {
  return createDirectory(targetDirPath);
}

function getSubdirectories() {
  return fs
    .readdirSync(searchesPath)
    .filter((name) => fs.lstatSync(searchesPath + "/" + name).isDirectory());
}

function getTxtFiles(directoryPath) {
  return fs
    .readdirSync(directoryPath)
    .filter((name) => name.endsWith(".txt"))
    .map((name) => path.join(directoryPath, name));
}

function getSearchesFiles() {
  return getTxtFiles("data/searches-files");
}

function readConfig(directoryPath) {
  const configPath = path.join(directoryPath, "config.json");
  const defaultConfig = {
    combined: true,
    relatived: true,
    labels: true,
  };

  if (fs.existsSync(configPath)) {
    return JSON.parse(fs.readFileSync(configPath));
  } else {
    return defaultConfig;
  }
}

echo("start");
echo("innovationLists", innovationLists);

async function handleSubdirectory(subdirectoryPath) {
  let targetSubdirName = path.basename(subdirectoryPath);
  let targetSubdirPath = path.join(targetDirPath, targetSubdirName);
  createDirectory(targetSubdirPath);

  let config = readConfig(subdirectoryPath);

  let txtFiles = getTxtFiles(subdirectoryPath);
  for (const txtFile of txtFiles) {
    await handleTxtFile(txtFile, targetSubdirPath, config);
  }
}

async function handleTxtFile(txtFilePath, targetSubdirPath, config) {
  let txtFileName = path.basename(txtFilePath);
  let targetDirName = txtFileName.replaceAll(".txt", "");
  let targetDirPath = path.join(targetSubdirPath, targetDirName);

  if (fs.existsSync(targetDirPath)) {
    // return;
  }

  createDirectory(targetDirPath);

  let content = fs
    .readFileSync(txtFilePath)
    .toString()
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .join(", ");

  await handlePromt(content, targetDirPath, config);
}

async function handleWordlistFile(txtFilePath) {
  console.log("handleWordlistFile", txtFilePath);

  let txtFileName = path.basename(txtFilePath);
  let targetDirName = txtFileName.replaceAll(".txt", "");
  let targetWordlistPath = path.join(targetWordlistDirPath, targetDirName);
  createDirectory(targetWordlistPath);

  const content = fs.readFileSync(txtFilePath).toString();
  const lines = content.split("\n");

  for (const line of lines) {
    let targetDirPath = path.join(targetWordlistPath, line.substring(0, 15));
    createDirectory(targetDirPath);
    await handlePromt(line, targetDirPath);
  }
}

// async function handleWordlistFile(promt, targetSubdirPath) {}

async function handlePromt(promt, targetDirPath) {
  echo("handling ", targetDirPath);

  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: "networkidle2" });
  await page.setViewport({ width: 1240, height: 2000, deviceScaleFactor: 2 });

  const client = await page.target().createCDPSession();
  await client.send("Page.setDownloadBehavior", {
    behavior: "allow",
    downloadPath: targetDirPath,
  });

  async function screenshot(name) {
    const imagePath = `${targetDirPath}/image-${name}.png`;
    echo("create screenshot ", imagePath);

    await page.waitForTimeout(500);
    await page.screenshot({ path: imagePath });
  }

  async function toggleLabels() {
    await (await page.waitForSelector("#settings-button")).click();
    await (await page.waitForSelector("#labelsBar")).click();
  }

  async function toggleCombined() {
    await (await page.waitForSelector("#combined-checkbox")).click();
  }

  async function enableRelative() {
    await page.select("#relative-absolute-dropdown", "tracks-relative-date");
  }

  function renameCurrentBarChart(name) {
    const fileName = path.join(targetDirPath, "bar-chart.png");
    if (!fs.existsSync(fileName)) {
      console.error("missing bar-chart.png");
      exit(1);
    }
    const targetFileName = name
      ? `${targetDirPath}/chart-${name}.png`
      : `${targetDirPath}/chart.png`;

    fs.renameSync(fileName, targetFileName);

    echo("renamed bar-chart.png", targetFileName);
  }

  async function barChartDownload(name) {
    // echo("barChartDownload ", name);
    // await page.click("#button-bar-chart-screenshot");
    // await page.waitForTimeout(30000);
    // renameCurrentBarChart(name);

    const imagePath = `${targetDirPath}/image-${name}.png`;
    await page.waitForTimeout(500);
    await page.screenshot({ path: imagePath, fullPage: false });
    await page.waitForTimeout(500);
  }

  echo("typing...", promt.substring(0, 20));
  await page.focus("#search-input");
  await page.evaluate(
    (data) => (document.querySelector("#search-input").value = data.promt),
    { promt }
  );

  await page.keyboard.press("Enter");

  // overview screenshot
  const imagePath = `${targetDirPath}.png`;
  echo("create overview screenshot ", imagePath);
  await page.waitForTimeout(500);
  await page.screenshot({ path: imagePath, fullPage: false });

  await barChartDownload("labels");

  await toggleLabels();
  await barChartDownload("");

  await toggleCombined();
  await barChartDownload("combined");

  await toggleLabels();
  await barChartDownload("combined_labels");

  await enableRelative();
  await barChartDownload("relative_combined_labels");

  await toggleCombined();
  await barChartDownload("relative_labels");

  await toggleLabels();
  await barChartDownload("relative");

  echo("closing browser...");
  await browser.close();
}

(async () => {
  for (const wordlistFile of getSearchesFiles()) {
    await handleWordlistFile(wordlistFile);
  }

  exit(0);

  createTargetDirectory();
  for (const subdirectory of getSubdirectories()) {
    await handleSubdirectory(searchesPath + "/" + subdirectory);
  }

  echo("finished");
  exit(0);
})();
