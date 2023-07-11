import React, { Component } from "react";
import { connect } from "react-redux";
import { Details } from "shared/pages/_wallet/details";
import { Ticker } from "shared/reducers/types";
import { convertBalanceToMoney } from "utility/utility";
import { TxHistoryDesktop } from "shared/components/tx-history/container";
import { XBalances } from "shared/reducers/xBalance";
import { BlockHeaderRate, selectXRate } from "shared/reducers/blockHeaderExchangeRates";
import { ZephyrAppState } from "platforms/desktop/reducers";
import { useParams } from "react-router";

interface DetailsProps {
  balances: XBalances;
  rates: BlockHeaderRate[];
}

interface RouteProps {
  assetId: Ticker;
}

class DetailsContainer extends Component<DetailsProps & RouteProps, any> {
  componentDidMount() {
    window.scrollTo(0, 0);
  }

  render() {
    const ticker = this.props.assetId;
    let xRate = selectXRate(this.props.rates, ticker, Ticker.ZEPHUSD, true);
    if (ticker === Ticker.ZEPHRSV) {
      xRate = selectXRate(this.props.rates, Ticker.ZEPHRSV, Ticker.ZEPH);
    }

    let amount: number = convertBalanceToMoney(this.props.balances[ticker].unlockedBalance, 12);
    let value = amount * xRate;
    if (ticker === Ticker.ZEPHRSV) {
      const spotRate = selectXRate(this.props.rates, Ticker.ZEPH, Ticker.ZEPHUSD, true);
      value *= spotRate;
    }

    const detailProps = { assetId: ticker, value, amount, price: xRate };
    return (
      <Details {...detailProps}>
        <TxHistoryDesktop assetId={ticker} />
      </Details>
    );
  }
}

const mapStateToProps = (state: ZephyrAppState) => ({
  balances: state.xBalance,
  rates: state.blockHeaderExchangeRate,
});

const ZephyrDetails = connect(mapStateToProps, {})(DetailsContainer);

export const ZephyrDetailWithParams = () => {
  const { id } = useParams();
  return <ZephyrDetails assetId={id as Ticker} />;
};
