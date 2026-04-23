

const TopicSidebar = () => {
    //   const [categories, setCategories] = useState([]);
    //   const [active, setActive] = useState(null);

    //   useEffect(() => {
    //     fetch("http://localhost:3000/categories") // change to your backend URL
    //       .then(res => res.json())
    //       .then(data => setCategories(data))
    //       .catch(err => console.error("Error fetching categories:", err));
    //   }, []);

    //   const handleClick = (category) => {
    //     setActive(category.id);
    //     onSelectCategory(category.id);
    //   };
    const categories = [{ name: "adfd" }, { name: "adfd" }, { name: "adfd" }, { name: "adfd" }, { name: "adfd" }, { name: "adfd" }, { name: "adfd" }]
    return (
        <div style={{ padding: "20px" }}>
            <h3 style={{ marginBottom: "15px" }}>Recommended Topics</h3>

            <div style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "10px"
            }}>
                {categories.map(cat => (
                    <button
                        // key={cat.id}
                        // onClick={() => handleClick(cat)}
                        style={{
                            padding: "8px 16px",
                            borderRadius: "999px",
                            border: "none",
                            cursor: "pointer",
                            backgroundColor: "#f2f2f2",
                            color: "#000",
                            transition: "0.2s"
                        }}
                    >
                        {cat.name}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default TopicSidebar;
