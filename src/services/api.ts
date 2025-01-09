import { CustomerStats } from '../types';

export const getCustomerStats = async (): Promise<CustomerStats> => {
  try {
    const response = await fetch('http://localhost:5000/api/stats/customers');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching customer stats:', error);
    return {
      totalCustomers: 0,
      monthlyGrowth: '0.0'
    };
  }
};