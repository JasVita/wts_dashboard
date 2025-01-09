// ... imports ...

export const ConversationTypeChart: React.FC = () => {
  // ... other code ...

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:5000/api/stats/stats/hotWords");
        const responsejson = await response.json();
        setHotWords(responsejson);
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