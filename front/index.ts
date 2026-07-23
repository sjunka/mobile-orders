import { registerRootComponent } from 'expo';

import App from './App';
import { enableMocks } from './src/mocks/enable';

// Mocks listen before the first screen mounts, so no fetch can outrun them.
enableMocks();

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
