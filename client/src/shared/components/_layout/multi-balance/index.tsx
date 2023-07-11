// Library Imports
import React, { Component } from "react";

// Relative Imports
import { Value, Wrapper, Amount } from "./styles";
import { connect } from "react-redux";
import { Spinner } from "../../spinner";
import { ProgressBar } from "../../progress-bar";
import { ZephyrAppState } from "platforms/desktop/reducers";
import { SyncState } from "shared/types/types";
import { selectSyncState } from "shared/reducers/chain";
import { selectPortfolioInUSD, XViewBalance, XViewBalances } from "shared/reducers/xBalance";
import { Ticker } from "shared/reducers/types";
import { togglePrivacyDisplay } from "shared/actions/walletSession";

interface BalanceProps {
  syncState: SyncState;
  balances: XViewBalance;
  showPrivateDetails: boolean;
  togglePrivacyDisplay: () => void;
}

interface BalanceState {
  currentTicker: Ticker | null;
  currentIndex: number;
  tickerOptions: Array<Ticker | null>;
}

class Balances extends Component<BalanceProps, BalanceState> {
  handleSync = (isSyncing: boolean, balance: any, totalBalance: any) => {
    if (isSyncing || !this.props.showPrivateDetails) {
      return "-/-";
    } else {
      return balance === -1 ? <Spinner /> : totalBalance;
    }
  };

  render() {
    const ticker = Ticker.ZEPHUSD;

    if (ticker === null)
      return (
        <Wrapper onClick={() => this.props.togglePrivacyDisplay()}>
          <Amount>-/-</Amount>
          <Value>Portfolio Value Hidden</Value>
        </Wrapper>
      );

    const { balance } = this.props.balances[ticker]!;
    const totalBalance = "$" + balance.toFixed(2);
    const { isSyncing, blockHeight, scannedHeight } = this.props.syncState;
    const percentage = ((scannedHeight / blockHeight) * 100).toFixed(2);

    return (
      <Wrapper onClick={() => this.props.togglePrivacyDisplay()}>
        <Amount isSyncing={isSyncing}>{this.handleSync(isSyncing, balance, totalBalance)}</Amount>
        <Value>{isSyncing ? `Syncing Wallet... ${percentage}%` : `Portfolio Value (USD) `}</Value>
        {isSyncing && <ProgressBar percentage={percentage} />}
      </Wrapper>
    );
  }
}

const mapStateToProps = (state: ZephyrAppState) => ({
  balances: selectPortfolioInUSD(state),
  syncState: selectSyncState(state),
  showPrivateDetails: state.walletSession.showPrivateDetails,
});
export const MultiBalance = connect(mapStateToProps, { togglePrivacyDisplay })(Balances);
