'use strict';

// The entire surface the renderer gets. Five calls, all read-only — there is
// deliberately no way to write a note from the UI. Notes are filed by the
// caller applying a finding, and a desk you can edit after the fact is not a
// record of what happened.

const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('desk', {
  notes: () => ipcRenderer.invoke('desk:notes'),
  coverage: () => ipcRenderer.invoke('desk:coverage'),
  run: (name) => ipcRenderer.invoke('desk:run', name),
  reveal: (slug) => ipcRenderer.invoke('desk:reveal', slug),
  onChange: (fn) => ipcRenderer.on('desk:changed', fn),
});
