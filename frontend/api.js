import { responsiveFontSizes } from '@mui/material';
import { createContext, useContext, useState } from 'react';
import config from './src/config';
const apiURL = "http:/localhost:8081/api";
import { jwtDecode } from "jwt-decode";
/*==========================================================
 * Context for providing API object
 */

export const ApiContext = createContext(undefined);

/*==========================================================
 * Hook to use a provided API object
 */
export function useApi() {
  return useContext(ApiContext);
}

/*==========================================================
 * Hook to create a new API object (stored as state)
 */
export function useNewApi() {
  const [api, setApi] = useState(() => new Api(sessionStorage.getItem('token'), JSON.parse(sessionStorage.getItem('data'))));

  // Override the setToken method to create a new API object
  api.setToken = function setToken(content) {
    let token = null, data = null;
    if (content != null && content.hasOwnProperty('token') && content.hasOwnProperty('data')) {
      token = content.token;
      data = content.data;
      if (token !== api.token) {
        if (token) {
          sessionStorage.setItem('token', token);
          sessionStorage.setItem('data', JSON.stringify(data)); // Serialize data before storing
        } else {
          sessionStorage.removeItem('token');
          sessionStorage.removeItem('data');
        }
      }
      setApi(new Api(token, data));
    } else {
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('data');
      setApi(new Api(null, undefined));
    }
  };

  return api;
}


/*==========================================================
 * Actual API class
 */
export class Api {

  get isTokenExpired() {
    if (!this.token) return true;
    const decoded = jwtDecode(this.token);
    const currentTime = Date.now() / 1000; 
    return decoded.exp < currentTime; 
  }
  setToken(token) { };
  // Property to test if logged in
  get loggedIn() {
    return this.token !== null;
  }


  // Constructor
  constructor(token, data) {
    this.token = token;
    this.name = data ? data.name : null;
    this.email = data ? data.email : null;
    this.role = data ? data.role : null;
  }



  // API METHODS:
  async login(hNumber, pin) {
    let response = await fetch(config.host + '/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        hNumber: hNumber, pin: pin
      })
    });
    return response;
  }
  async addCategory(categoryName, maxItems){
    let response = await fetch(config.host + '/api/inventory/addCategory', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + this.token,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ item: categoryName, maxQuantity: maxItems }),
      });
    return response;
  }
  async getCategories(){
    let response  = await fetch(config.host + '/api/inventory/getCategories',{
        method: 'GET',
        headers:{
            'Authorization': 'Bearer ' + this.token
        }
    });
    return response;
  }

  async barcodeLookup(itemBarcode){
    let response = await fetch(config.host + '/api/inventory/barcodeInfo/' + itemBarcode,{
        method: 'GET',
        headers:{
            'Authorization': 'Bearer ' + this.token
        }
    })
    return response;
  }
  
  async addItem(itemName, quantity,selectedCategoryId, itemBarcode,itemImage){
    let response = await fetch(config.host + '/api/inventory/additem', {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + this.token,
          'Content-Type': 'application/json',
        },
  
        body: JSON.stringify({
          item: String(itemName),
          quantity: quantity,
          category: selectedCategoryId,
          barcode: String(itemBarcode),
          imageLink: String(itemImage),
        }),
      });
      return response;
  }

  async getCheckoutItems(){
    let response = await fetch(config.host + '/api/inventory/checkout',{
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + this.token
      }
    })
    return response;
  }
  async submitCheckout(items, override){
    let response = await fetch(config.host + '/api/inventory/checkout', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer '+ this.token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ items, override }),
    })
    return response;
  }
  async fetchInventory(){
    let response = await fetch(config.host + '/api/inventory',{
      headers:{
      'Authorization': 'Bearer ' + this.token
      }
    });
    return response;
  }
  async updateInventory(row){
    let response = fetch(`${config.host}/api/inventory`, {
      method: 'PUT',
      headers: {
        'Authorization': 'Bearer ' + this.token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ row }),
    });
    return response;
  }
  async addNewShopper(formData){
    let response = fetch(`${config.host}/api/shopper/checkin/`, {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + this.token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ formData }),
    });
    return response;
  }
  async returningShopper(howAreWeHelping){
    let response = await fetch(`${config.host}/api/shopper/checkin/${returningHNum}`, {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + this.token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ howAreWeHelping }),
    });
    return response;

  }
  async addShipment(items){
    let response = await fetch(config.host + '/api/inventory/shipment', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + this.token,  
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ items }, true),
    })
    return response;
  }
}


