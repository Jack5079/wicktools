// Developer Icon
if (location.hostname === "localhost") {
  document.querySelector("[rel=icon]").href = "./icon-dev.svg";
  document.querySelector("img").src = "./icon-dev.svg";
}
const upload = document.getElementsByTagName("input")[0];
const worker = new Worker("./workers/metadata.js", {type: 'module'});

/**
 * 
 * @param {Blob} blob 
 * @returns {Promise<Wick.RootObject>}
 */
function getMetadata(blob) {
  return new Promise((resolve) => {
    worker.postMessage({
      blob,
      type: "meta",
    });
    worker.addEventListener("message", (event) => {
      resolve(event.data);
    });
  });
}

/**
 * 
 * @param {Blob} blob 
 * @returns {Promise<Blob>}
 */
function bruh(blob) {
  return new Promise((resolve) => {
    worker.postMessage({
      blob,
      type: "bruh",
    });
    worker.addEventListener("message", (event) => {
      resolve(event.data);
    });
  });
}

upload.addEventListener("change", async () => {
  const file = upload.files?.[0];
  if (file) {
    const {
      project: {
        width,
        height,
        framerate,
        name,
        metadata: { platform: { description: platform }, wickengine },
      },
      objects,
    } = await getMetadata(file);
    const scripts = Object.values(objects)
      .filter(({ scripts }) => scripts) // Only objects with a script array
      .map((object) => ({
        scripts: object.scripts.filter((script) => script.src),
        name: object.identifier || object.classname,
      }))
      .filter((object) => object.scripts.length) // Remove empty scripts
      .map((object) => {
        const objectdisplay = document.createElement("fieldset");
        const heading = document.createElement("legend");
        heading.innerText = object.name;
        objectdisplay.append(
          heading,
          ...object.scripts.map((script) => {
            const scriptdisplay = document.createElement("fieldset");
            const heading = document.createElement("legend");
            const code = document.createElement("pre");
            heading.innerText = script.name;
            code.innerText = script.src;
            scriptdisplay.append(heading, code);
            return scriptdisplay;
          }),
        );
        return objectdisplay;
      });
    const overview = document.createElement("body");
    const header = document.createElement("h1");
    const data = document.createElement("p");
    const button = document.createElement("button");
    header.innerText = name;
    data.innerText =
      `${width}x${height}@${framerate}\nLast saved with Wick Engine ${wickengine} and ${platform}`;
    button.innerText = "Bruhify";
    button.addEventListener("click", async () => {
      const blob = await bruh(file);
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "bruh.wick";
      document.body.append(link);
      link.click();
      link.remove();
    });
    overview.append(header, data, button, ...scripts);
    document.body.replaceWith(overview);
    document.documentElement.style.alignItems = "initial";
  }
});
