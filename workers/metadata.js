import JSZip from "https://cdn.skypack.dev/jszip";

/**
 * @param {MessageEvent} event
 */
async function meta(event) {
  /**
   * @type {{blob: Blob, type: string}}
   */
  const { blob, type } = event.data;
  const zip = await new JSZip().loadAsync(blob);
  const project = JSON.parse(
    await zip.file("project.json")?.async("text") || "{}",
  );
  switch (type) {
    case "bruh":
      // this replaces every text with "bruh"
      // Clips, text, paths, etc. are stored in the project.json file. We will get the IDs of every single object, and filter it to only text.
      Object.keys(project.objects)
        .filter((id) =>
          project.objects[id].json &&
          project.objects[id].json[0] === "PointText"
        ) // Only objects with data which has the text type
        .forEach((id) => { // Now for the actual text replacement
          project.objects[id].json[1].content = "bruh";
        });
      /**
       * @type {Blob}
       */
      const output = await zip.file("project.json", JSON.stringify(project))
        .generateAsync({ type: "blob" });

      self.postMessage(output);
      break;
    default:
      self.postMessage(project);
      break;
  }
}

self.onmessage = meta;
