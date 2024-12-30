import { db } from './database';
import { CustomerStats } from '../types';

export class CustomerService {
  static async getStats(): Promise<CustomerStats> {
    try {
      const [totalResult] = await db.query<{ total_customers: string }>(`
        SELECT COUNT(*) as total_customers
        FROM customerlist
      `);

      const [monthlyResult] = await db.query<{ new_customers: string }>(`
        SELECT COUNT(*) as new_customers
        FROM customerlist 
        WHERE created_at >= date_trunc('month', current_date)
      `);

      const totalCustomers = parseInt(totalResult.total_customers);
      const newCustomers = parseInt(monthlyResult.new_customers);
      
      const lastMonthCustomers = totalCustomers - newCustomers;
      const growthPercentage = lastMonthCustomers > 0 
        ? ((newCustomers / lastMonthCustomers) * 100).toFixed(1)
        : '0.0';

      return {
        totalCustomers,
        monthlyGrowth: growthPercentage
      };
    } catch (error) {
      console.error('Error getting customer stats:', error);
      return {
        totalCustomers: 0,
        monthlyGrowth: '0.0'
      };
    }
  }
}