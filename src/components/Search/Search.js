import React, { useCallback, useRef, useState } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { Switch, Route } from "react-router-dom";

import backendUrls from "api/backendUrls";
import {
  CRYPTO_EXCHANGES,
  LIMIT_BIDS,
  REFRESH_TIME_MARKETS,
  FILTER_STATES,
} from "constants/constants";
import useMount from "customHooks/useMount";
import useUnmount from "customHooks/useUnmount";
import Modal from "components/Modal/Modal";
import Symbol from "components/Symbol/Symbol";
import Loader from "components/Loader/Loader";
import Filter from "components/Filter/Filter";
import getSymbolFromPathName from "utils/getSymbolFromPathname";
import getServiceFromPathname from "utils/getServiceFromPathname";
import shouldOpenDetailsModal from "utils/shouldOpenDetailsModal";
import sortObjectsByPrice from "utils/sortObjectOfObjects";

import styles from "./Search.module.scss";

const initialSymbolsState = {
  kraken: {},
  huobi: {},
  binance: {},
};

let timer;

function Search() {
  let path = window.location.pathname.replace(/\/+$/, "");
  path = path[0] === "/" ? path.substr(1) : path;

  const history = useHistory();
  const [search, setSearch] = useState(() =>
    getSymbolFromPathName(window.location.pathname)
  );

  const inputRef = useRef(null);

  const symbolPath = search.replace("-", "");

  const [symbols, setSymbols] = useState(initialSymbolsState);
  const [symbolsLoading, setSymbolsLoading] = useState(false);
  const [selectedSymbolData, setSelectedSymbolData] = useState({});
  const [priceFilter, setPriceFilter] = useState(FILTER_STATES.ASC);

  const getHuobiSymbols = useCallback(async () => {
    try {
      const data = await axios.get(
        backendUrls.prices.get.huobi(symbolPath.toLowerCase())
      );

      if (data?.data?.status === "error") {
        setSymbols((prev) => ({
          ...prev,
          huobi: { error: true },
        }));
      } else {
        const price = Number(data?.data?.tick?.open);

        setSymbols((prev) => ({
          ...prev,
          huobi: { price, symbol: path },
        }));
      }
    } catch (err) {
      setSymbols((prev) => ({
        ...prev,
        binance: { error: true },
      }));
    }
  }, [path, symbolPath]);

  const getBinanceSymbols = useCallback(async () => {
    try {
      const data = await axios.get(backendUrls.prices.get.binance(symbolPath));
      const price = Number(data?.data?.price);

      setSymbols((prev) => ({
        ...prev,
        binance: { price, symbol: path },
      }));
    } catch (err) {
      setSymbols((prev) => ({
        ...prev,
        binance: { error: true },
      }));
    }
  }, [path, symbolPath]);

  const getKrakenSymbols = useCallback(async () => {
    try {
      const data = await axios.get(backendUrls.prices.get.kraken(symbolPath));

      if (data?.data?.error?.length > 0) {
        setSymbols((prev) => ({
          ...prev,
          kraken: { error: true },
        }));
      } else {
        const dataObj = data.data.result;
        const resultKey = Object.keys(data.data.result)[0];
        const price = Number(dataObj[resultKey]?.o);

        setSymbols((prev) => ({
          ...prev,
          kraken: { price, symbol: path },
        }));
      }
    } catch (err) {
      setSymbols((prev) => ({
        ...prev,
        kraken: { error: true },
      }));
    }
  }, [path, symbolPath]);

  const getMarkets = useCallback(() => {
    setSymbolsLoading(true);
    Promise.all([
      getBinanceSymbols(),
      getKrakenSymbols(),
      getHuobiSymbols(),
    ]).then(() => setSymbolsLoading(false));
  }, [getBinanceSymbols, getHuobiSymbols, getKrakenSymbols]);

  const getDetailsData = (serviceName) => {
    switch (serviceName.toUpperCase()) {
      case CRYPTO_EXCHANGES.HUOBI:
        getHuobiSymbolDetails();
        break;
      case CRYPTO_EXCHANGES.KRAKEN:
        getKrakenSymbolDetails();
        break;
      case CRYPTO_EXCHANGES.BINANCE:
        getBinanceSymbolDetails();
        break;
      default:
        break;
    }
  };

  useMount(() => {
    inputRef.current.focus();
    const { pathname } = window.location;

    if (shouldOpenDetailsModal(window.location.pathname)) {
      const serviceName = getServiceFromPathname(window.location.pathname);
      getDetailsData(serviceName);
    }

    if (pathname !== "/") {
      getMarkets();
      timer = setInterval(() => getMarkets(), REFRESH_TIME_MARKETS);
    }
  });

  useUnmount(() => clearInterval(timer));

  const handleSearch = () => {
    setSymbols(initialSymbolsState);
    history.push("/" + search);
    clearInterval(timer);
    if (search) {
      getMarkets();
      timer = setInterval(() => getMarkets(), REFRESH_TIME_MARKETS);
    }
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const getHuobiSymbolDetails = async () => {
    try {
      const data = await axios.get(
        backendUrls.exchanges.get.huobi(symbolPath?.toLowerCase(), LIMIT_BIDS)
      );
      const filteredDetails = data?.data?.tick?.bids.map((bid) => {
        const [price, quantity] = bid;
        return { price, quantity };
      });
      setSelectedSymbolData({ error: false, data: filteredDetails });
    } catch (err) {
      setSelectedSymbolData({ error: true });
    }
  };

  const getKrakenSymbolDetails = async () => {
    try {
      const data = await axios.get(
        backendUrls.exchanges.get.kraken(symbolPath, LIMIT_BIDS)
      );
      const filteredDetails = data?.data?.bids.map((bid) => {
        const [price, quantity] = bid;
        return { price, quantity };
      });
      setSelectedSymbolData({ error: false, data: filteredDetails });
    } catch (err) {
      setSelectedSymbolData({ error: true });
    }
  };

  const getBinanceSymbolDetails = async () => {
    try {
      const data = await axios.get(
        backendUrls.exchanges.get.binance(symbolPath, LIMIT_BIDS)
      );
      const filteredDetails = data?.data?.bids.map((bid) => {
        const [price, quantity] = bid;
        return { price, quantity };
      });
      setSelectedSymbolData({ error: false, data: filteredDetails });
    } catch (err) {
      setSelectedSymbolData({ error: true });
    }
  };

  const handleSymbolClick = (serviceName) => {
    history.push(`${path}/details-${serviceName}`);

    getDetailsData(serviceName);
  };

  const handleClose = () => {
    history.push(`/${getSymbolFromPathName(window.location.pathname)}`);
  };

  const handlePriceFilter = () => {
    let sortedObj;
    if (priceFilter === FILTER_STATES.ASC) {
      setPriceFilter(FILTER_STATES.DESC);
      sortedObj = sortObjectsByPrice(symbols, FILTER_STATES.DESC);
    } else {
      setPriceFilter(FILTER_STATES.ASC);
      sortedObj = sortObjectsByPrice(symbols, FILTER_STATES.ASC);
    }
    setSymbols(sortedObj);
  };

  return (
    <div className={styles.searchContainer}>
      <h2>Crypto exchange</h2>
      <div className={styles.inputContainer}>
        <label>Search for a symbol</label>
        <input
          ref={inputRef}
          className={styles.input}
          type="search"
          placeholder="ex. BTC-USDT"
          value={search}
          onKeyDown={onKeyDown}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button className={styles.searchBtn} onClick={handleSearch}>
          Search
        </button>
        <div className={styles.filterContainer}>
          <div>
            <Filter
              title="Price"
              state={priceFilter}
              onClick={handlePriceFilter}
            />
          </div>
        </div>
      </div>
      {path ? (
        <ul>
          {symbolsLoading ? (
            <Loader />
          ) : (
            Object.keys(symbols).map((serviceName) => {
              const error = symbols[serviceName]?.error;
              const [firstSymbol, secondSymbol] =
                getSymbolFromPathName(path).split("-");
              const price = symbols[serviceName]?.price;

              return (
                <Symbol
                  key={serviceName}
                  firstSymbol={firstSymbol}
                  secondSymbol={secondSymbol}
                  serviceName={serviceName}
                  price={price}
                  error={error}
                  onClick={error ? null : () => handleSymbolClick(serviceName)}
                />
              );
            })
          )}
        </ul>
      ) : null}
      <Switch>
        <Route path={`/${search}/details:symbolName`}>
          <Modal
            title={!selectedSymbolData.error ? `Last ${LIMIT_BIDS} bids` : ""}
            handleClose={handleClose}
          >
            {selectedSymbolData.error ? (
              <div className={styles.errorDetails}>An error occured</div>
            ) : (
              <div className={styles.modalBody}>
                {selectedSymbolData.data?.map(({ price, quantity }) => (
                  <div className={styles.trade} key={`${price} - ${quantity}`}>
                    <div>
                      Trade done: price: {price}, quantity: {quantity} units
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Modal>
        </Route>
      </Switch>
    </div>
  );
}

export default Search;
