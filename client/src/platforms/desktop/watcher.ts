import { Store } from "redux";
import watch from "redux-watch";
import { walletProxy } from "shared/core/proxy";

export const addDesktopStoreWatchers = (store: Store) => {
    
    // add watcher when we are connected to a daemon again
    let connectWatcher = watch(() => store.getState().connectedNode.isWalletConectedToDaemon)
    store.subscribe(connectWatcher((isConnected: boolean, wasConnected: boolean) => {
    if (isConnected && !wasConnected) {
        walletProxy.syncWallet();
    }
}))}