// Library Imports
import React, { Component } from "react";
import { connect } from "react-redux";
// Relative Imports
import Body from "../../../components/_layout/body";
import Header from "../../../components/_layout/header";
import Overview from "../../../components/_layout/overview";
import Cell from "../../../components/cell";
import CellDisabled from "../../../components/cell_disabled";

import { convertBalanceToMoney } from "utility/utility";
import { Ticker } from "shared/reducers/types";
import { DesktopAppState } from "platforms/desktop/reducers";
import { selectValueInOtherAsset, XBalances, XViewBalance } from "shared/reducers/xBalance";
import { WebAppState } from "platforms/web/reducers";
import { BlockHeaderRate, selectXRate } from "shared/reducers/blockHeaderExchangeRates";

interface AssetsProps {
  balances: XBalances;
  rates: BlockHeaderRate[];
  assetsInUSD: XViewBalance;
  showPrivateDetails: boolean;
}

interface AssetsState {}

class AssetsPage extends Component<AssetsProps, any> {
  state = {
    forexPriceFetched: false,
  };

  componentDidMount() {
    window.scrollTo(0, 0);
  }

  renderBalance = (ticker: keyof XBalances) => {
    const numDecimals = 12;

    const unlockedBalance = convertBalanceToMoney(this.props.balances[ticker].unlockedBalance, numDecimals);

    const totalBalance = convertBalanceToMoney(this.props.balances[ticker].balance, numDecimals);

    const lockedBalance = convertBalanceToMoney(this.props.balances[ticker].lockedBalance, numDecimals);

    let name = null;
    if (ticker === Ticker.ZEPHUSD) {
      name = "Stable Dollars (unaudited)";
    } else if (ticker === Ticker.ZSD) {
      name = "Stable Dollars";
    } else if (ticker === Ticker.ZEPHRSV) {
      name = "Reserve Shares (unaudited)";
    } else if (ticker === Ticker.ZRS) {
      name = "Reserve Shares";
    } else if (ticker === Ticker.ZYIELD) {
      name = "Yield Shares (unaudited)";
    } else if (ticker === Ticker.ZYS) {
      name = "Yield Shares";
    }

    const toTicker = (ticker === Ticker.ZEPHRSV || ticker === Ticker.ZRS) ? Ticker.ZEPH : ticker;
    let value = selectValueInOtherAsset(this.props.balances[ticker], this.props.rates, ticker, toTicker); // this.props.assetsInUSD[xTicker]!.unlockedBalance;
    const xRate = selectXRate(this.props.rates, ticker, toTicker);

    const latestBlockerHeader: BlockHeaderRate = this.props.rates[this.props.rates.length - 1];
    let spot = latestBlockerHeader?.stable?.toJSNumber() / Math.pow(10, 12) ?? 0;
    let ma = latestBlockerHeader?.stable_ma?.toJSNumber() / Math.pow(10, 12) ?? 0;

    if (ticker === Ticker.ZEPHRSV || ticker === Ticker.ZRS) {
      const spotPrice = selectXRate(this.props.rates, Ticker.ZEPH, Ticker.ZEPHUSD, true);
      value.balance *= spotPrice;
      value.unlockedBalance *= spotPrice;
      value.lockedBalance *= spotPrice;

      spot = latestBlockerHeader?.reserve?.toJSNumber() / Math.pow(10, 12) ?? 0;
      ma = latestBlockerHeader?.reserve_ma?.toJSNumber() / Math.pow(10, 12) ?? 0;
    }

    if (ticker === Ticker.ZYIELD || ticker === Ticker.ZYS) {
      const spotPrice = selectXRate(this.props.rates, Ticker.ZEPHUSD, Ticker.ZYIELD, true);
      value.balance *= spotPrice;
      value.unlockedBalance *= spotPrice;
      value.lockedBalance *= spotPrice;

      spot = (latestBlockerHeader?.yield_price?.toJSNumber() ?? 0) / Math.pow(10, 12) ?? 0;
      ma = spot;
    }

    if (totalBalance === 0) {
      return null;
    }
    return (
      <Cell
        fullwidth="fullwidth"
        key={ticker}
        tokenName={name}
        ticker={ticker}
        price={xRate}
        spotPrice={spot}
        maPrice={ma}
        value={value}
        totalBalance={totalBalance}
        lockedBalance={lockedBalance}
        unlockedBalance={unlockedBalance}
        showPrivateDetails={this.props.showPrivateDetails}
      />
    );
  };

  render() {
    const unlockedBalance = convertBalanceToMoney(this.props.balances.ZEPH.unlockedBalance, 12);
    const totalBalance = convertBalanceToMoney(this.props.balances.ZEPH.balance, 12);
    const lockedBalance = convertBalanceToMoney(this.props.balances.ZEPH.lockedBalance, 12);

    const unlockedBalance_v2 = convertBalanceToMoney(this.props.balances.ZPH.unlockedBalance, 12);
    const totalBalance_v2 = convertBalanceToMoney(this.props.balances.ZPH.balance, 12);
    const lockedBalance_v2 = convertBalanceToMoney(this.props.balances.ZPH.lockedBalance, 12);

    const zephInUSD = selectValueInOtherAsset(
      this.props.balances.ZEPH,
      this.props.rates,
      Ticker.ZEPH,
      Ticker.ZEPHUSD,
      true,
    );

    const zephInUSD_v2 = selectValueInOtherAsset(
      this.props.balances.ZPH,
      this.props.rates,
      Ticker.ZEPH,
      Ticker.ZEPHUSD,
      true,
    );

    const latestBlockerHeader: BlockHeaderRate = this.props.rates[this.props.rates.length - 1];
    const spot = latestBlockerHeader?.spot?.toJSNumber() / Math.pow(10, 12) ?? 0;
    const ma = latestBlockerHeader?.moving_average?.toJSNumber() / Math.pow(10, 12) ?? 0;

    const xRate = selectXRate(this.props.rates, Ticker.ZEPH, Ticker.ZEPHUSD, true);
    return (
      <Body>
        <Header title="Balances" description="Overview of your Zephyr assets" />

        <Overview />
        {totalBalance !== 0 && (
          <>
          <Cell
            //@ts-ignore
            key={1}
            tokenName={"Zeph (unaudited)"}
            ticker={"ZEPH"}
            price={xRate}
            spotPrice={spot}
            maPrice={ma}
            value={zephInUSD}
            fullwidth="fullwidth"
            totalBalance={totalBalance}
            lockedBalance={lockedBalance}
            unlockedBalance={unlockedBalance}
            showPrivateDetails={this.props.showPrivateDetails}
          />
          </>
        )}
        {totalBalance_v2 !== 0 && (
          <>
          <Cell
            //@ts-ignore
            key={1}
            tokenName={"Zeph"}
            ticker={"ZPH"}
            price={xRate}
            spotPrice={spot}
            maPrice={ma}
            value={zephInUSD_v2}
            fullwidth="fullwidth"
            totalBalance={totalBalance_v2}
            lockedBalance={lockedBalance_v2}
            unlockedBalance={unlockedBalance_v2}
            showPrivateDetails={this.props.showPrivateDetails}
          />
          </>
        )}
        {this.renderBalance(Ticker.ZEPHUSD)}
        {this.renderBalance(Ticker.ZSD)}
        {this.renderBalance(Ticker.ZEPHRSV)}
        {this.renderBalance(Ticker.ZRS)}
        {this.renderBalance(Ticker.ZYIELD)}
        {this.renderBalance(Ticker.ZYS)}
      </Body>
    );
  }
}

export const mapStateToProps = (state: DesktopAppState | WebAppState) => ({
  rates: state.blockHeaderExchangeRate,
  balances: state.xBalance,
  showPrivateDetails: state.walletSession.showPrivateDetails,
});

export const Assets = connect(mapStateToProps, {})(AssetsPage);
