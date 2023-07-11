// Library Imports
import React, { Component } from "react";
import { connect } from "react-redux";
// Relative Imports
import Body from "../../../components/_layout/body";
import Header from "../../../components/_layout/header";
import Overview from "../../../components/_layout/overview";
import Cell from "../../../components/cell";
import CellDisabled from "../../../components/cell_disabled";

import { AssetList } from "constants/assets";
import { convertBalanceToMoney } from "utility/utility";
import { Ticker } from "shared/reducers/types";
import { DesktopAppState } from "platforms/desktop/reducers";
import { selectValueInOtherAsset, XBalances, XViewBalance } from "shared/reducers/xBalance";
import { WebAppState } from "platforms/web/reducers";
import { BlockHeaderRate, selectXRate } from "shared/reducers/blockHeaderExchangeRates";
import { Row, Row3 } from "./styles";
import Statistic from "shared/components/statistic";
import { ReserveInfo } from "shared/reducers/reserveInfo";

interface AssetsProps {
  reserveInfo: ReserveInfo | null;
  chainHeight: number;
  rates: BlockHeaderRate[];
}

interface AssetsState {}

class ProtocolInfoPage extends Component<AssetsProps, any> {
  componentDidMount() {
    window.scrollTo(0, 0);
  }
  render() {
    const reserveInfo = this.props.reserveInfo;

    const zephReserve = convertBalanceToMoney(reserveInfo?.zeph_reserve ?? 0).toLocaleString();
    const liabilities = convertBalanceToMoney(reserveInfo?.liabilities ?? 0).toLocaleString();

    const assets = convertBalanceToMoney(reserveInfo?.assets ?? 0).toLocaleString();
    const assetsMA = convertBalanceToMoney(reserveInfo?.assets_ma ?? 0).toLocaleString();

    const equity = convertBalanceToMoney(reserveInfo?.equity ?? 0).toLocaleString();
    const equityMA = convertBalanceToMoney(reserveInfo?.equity_ma ?? 0).toLocaleString();

    const numStable = convertBalanceToMoney(reserveInfo?.num_stables ?? 0).toLocaleString();
    const numReserve = convertBalanceToMoney(reserveInfo?.num_reserves ?? 0).toLocaleString();

    const reserveRatio = convertBalanceToMoney(reserveInfo?.reserve_ratio?.multiply(100) ?? 0).toLocaleString();
    const reserveRatioMA = convertBalanceToMoney(reserveInfo?.reserve_ratio_ma?.multiply(100) ?? 0).toLocaleString();

    const spanStyle = { color: "#7f7f7f", fontSize: "0.9rem", fontWeight: "bold" };

    const chainHeight = this.props.chainHeight ?? 0;

    const spot = convertBalanceToMoney(this.props.rates[this.props.rates.length - 1]?.["spot"] ?? 0);
    const movingAverage = convertBalanceToMoney(this.props.rates[this.props.rates.length - 1]?.["moving_average"] ?? 0);

    return (
      <Body>
        <Header title="Protocol Info" description="" />
        <Row>
          {/* <Statistic label="Height" value={<div>{chainHeight}</div>} /> */}
          <Statistic label="Spot Price" value={<div>${spot}</div>} />
          <Statistic label="Moving Average" value={<div>${movingAverage}</div>} />
        </Row>
        <Row>
          <Statistic
            label="Reserve"
            value={
              <div>
                {zephReserve} <span style={spanStyle}>ZEPH</span>
              </div>
            }
          />
          <Statistic label="ZephUSD Circulation" value={<div>${liabilities}</div>} />
        </Row>
        <Row3>
          <Statistic label="Assets" value={<div>${assets}</div>} />
          <Statistic label="Assets (MA)" value={<div>${assetsMA}</div>} />
          <Statistic label="Equity" value={<div>${equity}</div>} />
          <Statistic label="Equity (MA)" value={<div>${equity}</div>} />
        </Row3>
        <Row>
          <Statistic label="Number of stablecoins" value={<div>{numStable}</div>} />
          <Statistic label="Number of reserves" value={<div>{numReserve}</div>} />
        </Row>
        <Row>
          <Statistic label="Reserve ratio" value={<div>{reserveRatio}%</div>} />
          <Statistic label="Reserve ratio (MA)" value={<div>{reserveRatioMA}%</div>} />
        </Row>
      </Body>
    );
  }
}

export const mapStateToProps = (state: DesktopAppState | WebAppState) => ({
  reserveInfo: state.reserveInfo,
  chainHeight: state.chain.chainHeight,
  rates: state.blockHeaderExchangeRate,
});

export const ProtocolInfo = connect(mapStateToProps, {})(ProtocolInfoPage);
