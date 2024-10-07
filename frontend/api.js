import { createContext, useContext, useState } from 'react';
import config from './src/config';
import { jwtDecode } from "jwt-decode";
export const ApiContext = createContext(undefined);

export function useApi() {
  return useContext(ApiContext);
}

export function useNewApi() {
  const [api, setApi] = useState(() => new Api(sessionStorage.getItem('token'), JSON.parse(sessionStorage.getItem('data'))));
  const [isTrained, setIsTrained] = useState(false);
  api.setToken = function setToken(content) {
    let token = null, data = null;
    if (content != null && content.hasOwnProperty('token') && content.hasOwnProperty('data')) {
      token = content.token;
      data = content.data;
      if (token !== api.token) {
        if (token) {
          sessionStorage.setItem('token', token);
          sessionStorage.setItem('lastTrainingDate', data.lastTrainingDate);
          sessionStorage.setItem('data', JSON.stringify(data)); // Serialize data before storing
        } else {
          sessionStorage.removeItem('token');
          sessionStorage.removeItem('data');
          sessionStorage.removeItem('lastTrainingDate'); 

        }
      }
      setApi(new Api(token, data));
    } else {
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('data');
      sessionStorage.removeItem('lastTrainingDate'); 

      setApi(new Api(null, undefined));
    }
  };

  return api;
}

function fetchWithAuth(url, options, token) {
  return fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      'Authorization': 'Bearer ' + token,
    },
  }).then(response => {
    if (response.status === 401) {
      // Token is expired or user is unauthorized, redirect to logout
      window.location.href = '/logout';
    }
    return response;
  });
}


export class Api {

  get isTokenExpired() {
    if (!this.token) return true;
    const decoded = jwtDecode(this.token);
    const currentTime = Date.now() / 1000; 
    return decoded.exp < currentTime; 
  }

  setToken(token) { }

  // Property to test if logged in
  get loggedIn() {
    return this.token !== null;
  }
  async updateTrainingD(){
      this.lastTrainingDate = new Date();
      sessionStorage.setItem('lastTrainingDate', new Date()); 
  }

  // Constructor
  constructor(token, data) {
    this.token = token;
    this.name = data ? data.name : null;
    this.email = data ? data.email : null;
    this.role = data ? data.role : null;
    this.lastTrainingDate = data ? data.lastTrainingDate : null;
  }

  // API METHODS:
  async login(hNumber, pin) {
    let response = await fetch(`${config.host}/api/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        hNumber: hNumber, pin: pin
      })
    });
    return response;
  }
  async addCategory(categoryName, maxItems) {
    let response = await fetchWithAuth(`${config.host}/api/inventory/addCategory`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ item: categoryName, maxQuantity: maxItems }),
    }, this.token);
    return response;
  }

  async getCategories() {
    let response = await fetchWithAuth(`${config.host}/api/inventory/getCategories`, {
      method: 'GET',
    }, this.token);
    return response;
  }

  async barcodeLookup(itemBarcode) {
    let response = await fetchWithAuth(`${config.host}/api/inventory/barcodeInfo/${itemBarcode}`, {
      method: 'GET',
    }, this.token);
    return response;
  }

  async addItem(itemName, quantity, selectedCategoryId, itemBarcode, itemImage) {
    let response = await fetchWithAuth(`${config.host}/api/inventory/additem`, {
      method: 'POST',
      headers: { 
                                     'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        item: String(itemName),
        quantity: quantity,
        category: selectedCategoryId,
        barcode: String(itemBarcode),
        imageLink: String(itemImage),
      }),
    }, this.token);
    return response;
  }

  async getCheckoutItems() {
    let response = await fetchWithAuth(`${config.host}/api/inventory/checkout`, {
      method: 'GET',
    }, this.token);
    return response;
  }
  async updateTraining() {
    this.updateTrainingD();
    let response = await fetchWithAuth(`${config.host}/api/users/training`, {
      method: 'POST',
    }, this.token);
    return response;
  };

  async submitCheckout(items, override, hNumber) {
    let response = await fetchWithAuth(`${config.host}/api/inventory/checkout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ items, override, hNumber }),
    }, this.token);
    return response;
  }

  async fetchInventory() {
    let response = await fetchWithAuth(`${config.host}/api/inventory`, {
      method: 'GET',
    }, this.token);
    return response;
  }

  async updateInventory(row) {
    let response = await fetchWithAuth(`${config.host}/api/inventory`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ row }),
    }, this.token);
    return response;
  }

  async addNewShopper(formData) {
    let response = await fetchWithAuth(`${config.host}/api/shopper/checkin/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ formData }),
    }, this.token);
    return response;
  }

  async returningShopper(howAreWeHelping, returningHNum) {
    let response = await fetchWithAuth(`${config.host}/api/shopper/checkin/${returningHNum}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ howAreWeHelping }),
    }, this.token);
    return response;
  }

  async addShipment(items) {
    let response = await fetchWithAuth(`${config.host}/api/inventory/shipment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ items }, true),
    }, this.token);
    return response;
  }

  async getUsers() {
    let response = await fetchWithAuth(`${config.host}/api/users`, {
      method: 'GET',
    }, this.token);
    return response;
  }

  async resetPIN(hNumber) {
    let response = await fetchWithAuth(`${config.host}/api/users/reset`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ hNumber }),
    }, this.token);
    return response;
  }

  async deleteUser(hNumber) {
    let response = await fetchWithAuth(`${config.host}/api/users`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ hNumber }),
    }, this.token);
    return response;
  }

  async updateUser(name, hNumber, role, email) {
    let response = await fetchWithAuth(`${config.host}/api/users`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        row: {
          name,
          hNumber,
          role,
          email
        }
      }),
    }, this.token);
    return response;
  }

  async addUser(name, hNumber, role, email) {
    let response = await fetchWithAuth(`${config.host}/api/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        hNumber,
        role,
        email
      }),
    }, this.token);
    return response;
  }
}