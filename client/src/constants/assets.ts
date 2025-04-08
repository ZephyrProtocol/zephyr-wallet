import { Ticker } from "shared/reducers/types";

// id matches Ticker enum
export const AssetList = [
  {
    id: Ticker.ZEPH,
    token: "Zeph",
    ticker: "ZEPH",
    symbol: "Z",
  },
  {
    id: Ticker.ZEPH_V2,
    token: "Zeph",
    ticker: "ZPH",
    symbol: "Z",
  },
  {
    id: Ticker.ZEPHUSD,
    token: "Stable",
    ticker: "ZEPHUSD",
    symbol: "$",
  },
  {
    id: Ticker.ZSD,
    token: "Stable",
    ticker: "ZSD",
    symbol: "$",
  },
  {
    id: Ticker.ZEPHRSV,
    token: "Reserve",
    ticker: "ZEPHRSV",
    symbol: "Z",
  },
  {
    id: Ticker.ZRS,
    token: "Reserve",
    ticker: "ZRS",
    symbol: "Z",
  },
  {
    id: Ticker.ZYIELD,
    token: "Yield",
    ticker: "ZYIELD",
    symbol: "$",
  },
  {
    id: Ticker.ZYS,
    token: "Yield",
    ticker: "ZYS",
    symbol: "$",
  },
];
