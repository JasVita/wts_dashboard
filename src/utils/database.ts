import { Pool } from 'pg';

const pool = new Pool({
  host: 'wts-db.cb4ygokymibc.ap-southeast-2.rds.amazonaws.com',
  port: 5432,
  database: 'wtsdb',
  user: 'DBadmin',
  password: 'vitalogy123',
  ssl: {
    rejectUnauthorized: false,
    mode: 'require'
  }
});

export const getCustomerStats = async () => {
  try {
    const totalCustomersQuery = `
      SELECT COUNT(*) as total_customers
      FROM customerlist
    `;

    const monthlyGrowthQuery = `
      SELECT 
        COUNT(*) as new_customers
      FROM customerlist 
      WHERE created_at >= date_trunc('month', current_date)
    `;

    const [totalResult, monthlyResult] = await Promise.all([
      pool.query(totalCustomersQuery),
      pool.query(monthlyGrowthQuery)
    ]);

    const totalCustomers = parseInt(totalResult.rows[0].total_customers);
    const newCustomers = parseInt(monthlyResult.rows[0].new_customers);
    
    // Calculate monthly growth percentage
    const lastMonthCustomers = totalCustomers - newCustomers;
    const growthPercentage = lastMonthCustomers > 0 
      ? ((newCustomers / lastMonthCustomers) * 100).toFixed(1)
      : '0.0';

    return {
      totalCustomers,
      monthlyGrowth: growthPercentage
    };
  } catch (error) {
    console.error('Error fetching customer stats:', error);
    return {
      totalCustomers: 0,
      monthlyGrowth: '0.0'
    };
  }
};