import { decreasePricePoints } from "../../utility/utility";
import { GET_PRICE_HISTORY_FAILED, GET_PRICE_HISTORY_FETCHING, GET_PRICE_HISTORY_SUCCEED } from "./types";

export const getPriceHistory = (rangeInDays) => {
  return (dispatch, getState) => {
    const hasPricesForRange = getState().priceHistory.prices.some(
      (priceRangeEntry) => priceRangeEntry.rangeInDays === rangeInDays && priceRangeEntry.prices.length > 0,
    );

    // if we have these prices, we are done
    if (hasPricesForRange) {
      return;
    }

    dispatch(getPriceDataFetching());
    fetch(`TODO: API URL`)
      .then((response) => response.json())
      .then(decreasePricePoints)
      .then((priceData) => dispatch(getPriceDataSucceed(priceData.prices, rangeInDays)))
      .catch((error) => dispatch(getPriceDataFailed(error)));
  };
};

const getPriceDataFetching = () => ({ type: GET_PRICE_HISTORY_FETCHING });
const getPriceDataFailed = (error) => ({
  type: GET_PRICE_HISTORY_FAILED,
  payload: error,
});
const getPriceDataSucceed = (prices, rangeInDays) => {
  return {
    type: GET_PRICE_HISTORY_SUCCEED,
    payload: { prices, rangeInDays },
  };
};
