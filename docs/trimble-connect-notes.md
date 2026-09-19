# Trimble Connect extension notes

Sources: `trimble-connect-workspace-api` npm package v0.3.34 (type definitions, checked 2026-09-19) and the
[Workspace API docs](https://components.connect.trimble.com/trimble-connect-workspace-api/index.html).
The 3D Viewer docs site (3d.connect.trimble.com) and docs.connect.trimble.com were not reachable/were behind a login when this was written.

## How an extension works
- A web page hosted at an HTTPS URL, loaded in an iframe by Trimble Connect.
- Described by a JSON manifest. The manifest URL must be CORS-enabled.
- Talks to Trimble Connect via `window.postMessage`, wrapped by the Workspace API.

## Manifest
```json
{
  "url": "https://your.host/index.html",
  "title": "Selection Inspector",
  "icon": "https://your.host/icon.png",
  "description": "Shows properties of selected 3D objects",
  "extensionType": ["3dviewer"]
}
```
`extensionType`: `"project"`, `"3dviewer"`, or both (then use `API.extension.getHost()` to tell them apart).

## Installing
Project Settings -> Apps & Capabilities -> Add Custom -> paste the manifest URL.

## Connecting
The IIFE build defines the global `TrimbleConnectWorkspace`:
```js
const API = await TrimbleConnectWorkspace.connect(window.parent, (event, data) => { ... });
```

## Selection and properties (ViewerAPI)
- Event `"viewer.onSelectionChanged"` -> `data` is `Selection` = `ModelObjectIds[]`.
- `API.viewer.getSelection(): Promise<Selection>`
- `ModelObjectIds = { modelId: string, objectRuntimeIds?: number[] }`
- `API.viewer.getObjectProperties(modelId, objectRuntimeIds): Promise<ObjectProperties[]>`
- `ObjectProperties = { id, class?, product?, properties?: PropertySet[], color?, position? }`
- `PropertySet = { name?, properties?: { name, value: string | number, ... }[] }`
- `getProperties` is deprecated; use `getObjectProperties`.
