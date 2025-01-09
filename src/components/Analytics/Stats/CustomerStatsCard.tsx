// ... imports ...

export const CustomerStatsCard: React.FC = () => {
  // ... other code ...

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch customer stats
        const countResponse = await fetch("http://localhost:5000/api/stats/stats/count");
        const countData = await countResponse.json();

        // Fetch customer names
        const namesResponse = await fetch("http://localhost:5000/api/stats/stats/customers");
        const namesData = await namesResponse.json();

        setData({
          count: countData.count,
          names: namesData.map((customer: { name: string }) => customer.name),
        });
      } catch (err) {
        setError("Failed to fetch customer data");
        console.error("Error fetching customer data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // ... rest of the component ...
};