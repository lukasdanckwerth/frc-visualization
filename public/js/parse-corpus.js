importScripts('./frc.js');

self.onmessage = function(e) {
  if (!e.data || !Array.isArray(e.data)) return
  const corpus = new frc(e.data);
  self.postMessage(corpus);
};
