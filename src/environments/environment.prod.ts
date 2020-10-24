import { WalletConnectionMethod } from 'src/app/models/walletConnectionMethod';

export const environment = {
  production: true,
  mapbox: {
    access_token: 'pk.eyJ1IjoicmljY2luaW8yNTAyIiwiYSI6ImNrYjl2cXU2djA5dHIyeXFrc2J0ZDhxd3MifQ.eoEy3upDMQSU7WvQyS-tuw',
    geocodingBaseUrl: 'https://api.mapbox.com/geocoding/v5/mapbox.places/',
    directions: 'https://api.mapbox.com/directions/v5/mapbox/driving/'
  },
  walletConnectionMethods: [
    { enumValue: WalletConnectionMethod.MetaMask, label: 'MetaMask' },
    { enumValue: WalletConnectionMethod.Other, label: 'More to come..' }
  ]
};
