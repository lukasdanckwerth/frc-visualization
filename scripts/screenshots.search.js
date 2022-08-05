const puppeteer = require("puppeteer");
const fileAccess = require("./file.access");
const fs = require("fs");
const innovationLists = require("../data/innovation-lists.json");
const { exit } = require("process");

if (!innovationLists) {
  throw new Error("no innovation lists found.");
}

function echo(...args) {
  console.log("[screenshots:search]  ", ...args);
}

echo("start");
echo("innovationLists", innovationLists);

async function handleInnovationList(filename) {
  echo("handling", filename);
  if (filename === "innovation.list.txt") return;
  let sourceList = fileAccess
    .read("./data/innovation-lists/" + filename)
    .toString()
    .split("\n")
    .filter((word) => word.trim().length > 0);

  for (let index = 0; index < sourceList.length; index++) {
    const query = sourceList[index];
    await createScreenshot(query, filename);
  }
}

async function createScreenshot(query, innovationListName) {
  const groups = query.split(";");
  const groupFirsts = groups.map((group) =>
    (group.split(",")[0] || " ").trim()
  );

  const filename = groupFirsts.join("_") + ".png";

  echo("screenshot query: ", query);
  echo("filename", filename);

  url = "http://127.0.0.1:8080/resources/search.html";

  const dirPath = "screenshots/" + innovationListName + "/";
  if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath);

  const imagePath = dirPath + filename;
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto(url, { waitUntil: "networkidle2" });
  await page.setViewport({ width: 1240, height: 2000, deviceScaleFactor: 2 });
  await page.type("textarea[id=search-input]", query, { delay: 200 });
  await page.keyboard.press("Enter");
  await page.waitForTimeout(100);

  await page.screenshot({ path: imagePath });
  await browser.close();
}

(async () => {
  for (let index = 0; index < innovationLists.length; index++) {
    const list = innovationLists[index];
    await handleInnovationList(list);
  }
  echo("finished");
})();
