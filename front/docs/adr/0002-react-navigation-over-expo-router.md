# React Navigation over Expo Router

This is an Expo app, so a reader would expect Expo Router (the file-based default). We chose React Navigation with an explicit `navigation/` folder instead, matching the prototype doc's stack and giving full control over the navigator tree. The trade-off is more setup boilerplate than file-based routing. Reversible if file-based routing later proves simpler.
