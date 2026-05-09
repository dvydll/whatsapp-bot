/**
 * HTTP Download - Simplified
 */

import axios from 'axios';

export const getBuffer = async (url: string, options?: any): Promise<any> => {
  try {
    const res = await axios.get(url, { ...options, responseType: 'arraybuffer' });
    return res.data;
  } catch {
    return Buffer.alloc(0);
  }
};

export const fetchJson = async (url: string, options?: any): Promise<any> => {
  try {
    const res = await axios.get(url, options);
    return res.data;
  } catch {
    return { error: true };
  }
};

export const fetchBuffer = async (url: string, options?: any): Promise<any> => {
  try {
    const res = await axios.get(url, { ...options, responseType: 'arraybuffer' });
    return res.data;
  } catch {
    return Buffer.alloc(0);
  }
};