import { executeQuery } from '../db/index';

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
      executeQuery(totalCustomersQuery),
      executeQuery(monthlyGrowthQuery),
    ]);

    const totalCustomers = parseInt(totalResult[0].total_customers, 10);
    const newCustomers = parseInt(monthlyResult[0].new_customers, 10);

    const lastMonthCustomers = totalCustomers - newCustomers;
    const growthPercentage =
      lastMonthCustomers > 0
        ? ((newCustomers / lastMonthCustomers) * 100).toFixed(1)
        : '0.0';

    return {
      totalCustomers,
      monthlyGrowth: growthPercentage,
    };
  } catch (error) {
    console.error('[CustomerStats] Error fetching customer stats:', error);
    throw new Error('Failed to retrieve customer statistics');
  }
};
