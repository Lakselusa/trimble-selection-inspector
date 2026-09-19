// PROTOTYPE: Trimble Connect 3D viewer extension spike. Throwaway.
const statusEl = document.getElementById("status");
const outputEl = document.getElementById("output");

let API;

async function showSelection(selection) {
  outputEl.textContent = "";
  const total = selection.reduce((n, s) => n + (s.objectRuntimeIds?.length ?? 0), 0);
  statusEl.textContent = total ? `${total} object(s) selected` : "Nothing selected. Click an object in the model.";

  for (const { modelId, objectRuntimeIds } of selection) {
    if (!objectRuntimeIds?.length) continue;
    const objects = await API.viewer.getObjectProperties(modelId, objectRuntimeIds);
    for (const obj of objects) outputEl.appendChild(renderObject(obj));
  }
}

function renderObject(obj) {
  const box = document.createElement("div");
  box.className = "obj";
  const title = document.createElement("h3");
  title.textContent = `${obj.class ?? "Object"} (id ${obj.id})`;
  box.appendChild(title);

  for (const set of obj.properties ?? []) {
    const setName = document.createElement("div");
    setName.className = "set";
    setName.textContent = set.name ?? "(unnamed set)";
    box.appendChild(setName);

    const table = document.createElement("table");
    for (const p of set.properties ?? []) {
      const row = table.insertRow();
      row.insertCell().textContent = p.name;
      row.insertCell().textContent = String(p.value);
    }
    box.appendChild(table);
  }
  return box;
}

async function start() {
  try {
    API = await TrimbleConnectWorkspace.connect(window.parent, (event, data) => {
      console.log("event", event, data);
      if (event === "viewer.onSelectionChanged") showSelection(data);
    }, 30000);
    statusEl.textContent = "Connected. Select an object in the model.";
    showSelection(await API.viewer.getSelection());
  } catch (err) {
    statusEl.textContent = "Could not connect. This page must be opened inside Trimble Connect.";
    console.error(err);
  }
}

start();
