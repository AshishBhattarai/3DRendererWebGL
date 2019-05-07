const Bundler = require("parcel-bundler");
const Path = require("path");

const entryFiles = [Path.join(__dirname, "./index.html")];

(async () => {
  const bundler = new Bundler(entryFiles);

  bundler.on("buildEnd", () => {
    const postBuildFile = Path.join(__dirname, "./process_shaders.sh");
    console.log(`running: ${postBuildFile}`);
  });

  const bundle = await bundler.serve();
})();
