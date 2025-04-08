// Library Imports
import React, { useState } from "react";

// Relative Imports
import {
  Container,
  Column,
  Title,
  Subtitle,
  Locked,
  Unlocked,
  Row,
  Pending,
  Route,
  Asset,
  Balances,
  PendingWrapper,
  PendingSpacer,
  PendingBoxWrapper,
  PendingBox,
  PendingSection,
  Balance,
  Arrow,
  Icon,
  ShortRow,
  MainBalance,
  Buttons,
  Button,
  SendIcon,
  AddressBookIcon,
  SwapIcon,
  CoinName,
} from "./styles";
import Dots from "../_animations/dots";
import { Ticker } from "shared/reducers/types";
import logo from "../../../assets/icons/zephyr.png";
import stableLogo from "../../../assets/icons/stable.png";
import reserveLogo from "../../../assets/icons/reserve.png";
import yieldLogo from "../../../assets/icons/yield.png";
import BalanceDetailSection from "../balance-container/detail-section";
import { convertToNewTicker } from "utility/utility";

const Cell = ({
  tokenName,
  ticker,
  price,
  value,
  fullwidth,
  totalBalance,
  lockedBalance,
  unlockedBalance,
  showPrivateDetails,
  spotPrice,
  maPrice,
}) => {
  const [open, openBalance] = useState(false);
  const hiddenBalance = "-/-";

  const displayBalance = (balance, useTwoDP) => {
    return !showPrivateDetails
      ? hiddenBalance
      : useTwoDP
      ? balance
          .toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })
          .replace("$", "")
      : balance
          .toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
            minimumFractionDigits: 12,
            maximumFractionDigits: 12,
          })
          .replace("$", "");
  };

  let logoImage = null;
  if (ticker === Ticker.ZEPH || ticker === Ticker.ZEPH_V2) {
    logoImage = logo;
  } else if (ticker === Ticker.ZEPHUSD || ticker === Ticker.ZSD) {
    logoImage = stableLogo;
  } else if (ticker === Ticker.ZEPHRSV || ticker === Ticker.ZRS) {
    logoImage = reserveLogo;
  } else if (ticker === Ticker.ZYIELD || ticker === Ticker.ZYS) {
    logoImage = yieldLogo;
  }

  const isOldAssetType = ticker === Ticker.ZEPH || ticker === Ticker.ZEPHUSD || ticker === Ticker.ZEPHRSV || ticker === Ticker.ZYIELD;

  return (
    <>
      <Container>
        <Unlocked to={`/wallet/assets/${ticker}`}>
          <CoinName>
            <h1>{tokenName}</h1>
          </CoinName>
          <Column>
            <Row>
              <div style={{ display: "flex", alignItems: "center" }}>
                <Icon src={logoImage} />
              </div>
              <div>
                <MainBalance>
                  {totalBalance === 0 ? displayBalance("0.00") : displayBalance(Number(totalBalance ?? 0), true)}{" "}
                  <Subtitle style={{ fontSize: 18 }}>{convertToNewTicker(ticker)}</Subtitle>
                </MainBalance>
                <Balance>
                  <Subtitle>{"$" + displayBalance(value.balance, true)}</Subtitle>
                  <Subtitle
                    style={{ position: "absolute", bottom: 0, marginLeft: 4, lineHeight: "28px", fontSize: 12 }}
                  >
                    USD
                  </Subtitle>
                </Balance>
              </div>
            </Row>
            <Row>
              <Buttons>
                <Button to={`/wallet/assets/${ticker}`}>
                  <AddressBookIcon /> History
                </Button>
                {/* <Button to={`/wallet/transfer/${ticker}`}>
                  <SendIcon /> Send
                </Button> */}
                {isOldAssetType && <Button to={`/wallet/convert/${ticker}`}>
                  <SwapIcon /> Audit
                </Button>}
              </Buttons>
            </Row>
          </Column>
        </Unlocked>
        {open && (
          <PendingWrapper to={`/wallet/assets/${ticker}`}>
            <PendingSpacer />
            <PendingBoxWrapper>
              <BalanceDetailSection
                assetId={ticker}
                balance={totalBalance}
                lockedBalance={lockedBalance}
                unlockedBalance={unlockedBalance}
                spot={spotPrice}
                ma={maPrice}
              />
            </PendingBoxWrapper>
            <PendingSpacer />
          </PendingWrapper>
        )}
        <Balances onClick={() => openBalance(!open)}>
          <Row>
            <Subtitle style={{ fontSize: "12px" }}>{open ? "Hide Details" : "Show details"}</Subtitle>
          </Row>
        </Balances>
      </Container>
    </>
  );
};

export default Cell;
