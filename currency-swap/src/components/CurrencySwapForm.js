import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TokenSelect from './TokenSelect';
import { TextField, Button, CircularProgress } from '@mui/material';

const CurrencySwapForm = () => {
  const [formData, setFormData] = useState({
    tokens: [],
    prices: {},
    fromToken: '',
    toToken: '',
    amount: '',
    loading: false,
    result: null,
    error: null
  });

  useEffect(() => {
    axios.get('https://interview.switcheo.com/prices.json')
      .then(response => {
        const tokenPrices = {};
        const tokenCurrencies = [];

        response.data.forEach(token => {
          tokenPrices[token.currency] = token.price;
          tokenCurrencies.push(token.currency);
        });

        setFormData(prevState => ({
          ...prevState,
          prices: tokenPrices,
          tokens: tokenCurrencies
        }));
      })
      .catch(error => {
        setFormData(prevState => ({
          ...prevState,
          error: 'Error fetching token prices'
        }));
      });
  }, []);

  useEffect(() => {
    setFormData(prevState => ({
      ...prevState,
      result: null
    }));
  }, [formData.fromToken, formData.toToken, formData.amount]);

  const handleSwap = () => {
    const { fromToken, toToken, amount, prices } = formData;
    const fromPrice = prices[fromToken];
    const toPrice = prices[toToken];

    if (!fromToken || !toToken || !amount) {
      setFormData(prevState => ({
        ...prevState,
        error: 'Please provide all necessary information (missing token or amount)'
      }));
      return;
    }

    if (fromPrice === undefined || toPrice === undefined) {
      setFormData(prevState => ({
        ...prevState,
        error: 'Cannot find prices for one or both tokens'
      }));
      return;
    }

    if (toPrice === 0) {
      setFormData(prevState => ({
        ...prevState,
        error: 'Invalid conversion amount (dividing by zero)'
      }));
      return;
    }

    const resultAmount = (amount * fromPrice) / toPrice;
    setFormData(prevState => ({
      ...prevState,
      result: resultAmount.toFixed(2),
      error: null
    }));
  };

  return (
    <div className="currency-swap-form">
      <TokenSelect
        label="From"
        tokens={formData.tokens}
        selectedToken={formData.fromToken}
        onTokenChange={token => setFormData(prevState => ({ ...prevState, fromToken: token }))}
      />
      <TokenSelect
        label="To"
        tokens={formData.tokens}
        selectedToken={formData.toToken}
        onTokenChange={token => setFormData(prevState => ({ ...prevState, toToken: token }))}
      />
      <TextField
        label="Amount"
        type="number"
        value={formData.amount}
        onChange={e => setFormData(prevState => ({ ...prevState, amount: e.target.value }))}
        fullWidth
        margin="normal"
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleSwap}
        disabled={formData.loading}
        fullWidth
      >
        {formData.loading ? <CircularProgress size={24} /> : 'Swap'}
      </Button>
      {formData.error && (
        <div className="error">
          {formData.error}
        </div>
      )}
      {formData.result !== null && (
        <div className="result">
         The amount of {formData.toToken} you'll receive is: {formData.result} {formData.toToken}
        </div>
      )}
    </div>
  );
};

export default CurrencySwapForm;
