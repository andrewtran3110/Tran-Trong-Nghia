import React from 'react';
import { TextField, MenuItem } from '@mui/material';

const TokenSelect = ({ label, tokens, selectedToken, onTokenChange }) => {
  return (
    <TextField
      select
      label={label}
      value={selectedToken}
      onChange={(e) => onTokenChange(e.target.value)}
      fullWidth
      margin="normal"
    >
      {tokens.map((token, index) => (
        <MenuItem key={index} value={token}>
          {token}
        </MenuItem>
      ))}
    </TextField>
  );
};

export default TokenSelect;
