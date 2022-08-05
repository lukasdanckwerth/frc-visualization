const puppeteer = require("puppeteer");

function echo(...args) {
  console.log("[screenshots]  ", ...args);
}

async function createScreenshot(url, name, height = 1100, width = 1240) {
  echo("screenshot name: ", name);
  echo("screenshot url: ", url);
  url = "http://127.0.0.1:8080/resources/" + url;
  name = name.endsWith(".png") ? name : name + ".png";
  const imagePath = "img/" + name;

  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto(url, { waitUntil: "networkidle2" });
  await page.setViewport({ width, height, deviceScaleFactor: 2 });
  await page.pdf({ path: "page.pdf" });
  await page.screenshot({ path: imagePath });
  await browser.close();
}

echo("start");
(async () => {
  createScreenshot("corpus.overview.html", "corpus.overview", 1100);
  createScreenshot(
    "artists.activity.range.html",
    "artists.activity.range",
    1200
  );
  echo("finished");
})();
