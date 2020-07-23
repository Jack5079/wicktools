// Developer Icon
if (location.hostname === 'localhost') {
  document.querySelector('[rel=icon]').remove()
  const link = document.createElement('link')
  link.href = './icon-dev.svg'
  link.rel = 'icon'
  document.head.append(link)
}
const upload = document.getElementsByTagName("input")[0];
const worker = new Worker("./workers/metadata.js");

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
    const meta = await getMetadata(file);
    const objects = Object.values(meta.objects)
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
    header.innerText = meta.project.name;
    data.innerText =
      `${meta.project.width}x${meta.project.height}@${meta.project.framerate}\nLast saved with Wick Engine ${meta.project.metadata.wickengine} and ${meta.project.metadata.platform.description}`;
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
    overview.append(header, data, button, ...objects);
    document.body.replaceWith(overview);
  }
});
