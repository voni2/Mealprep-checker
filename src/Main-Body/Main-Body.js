import { useState } from "react";

function MainBody() {
  const [date, setDate] = useState("");
  const [foods, setFoods] = useState([{ food: "", grams: "" }]);
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalCalories, setTotalCalories] = useState(null);

  // Add a new food field only if all current fields are filled
  const addMoreFields = () => {
    const hasEmpty = foods.some(item => item.food === "" || item.grams === "");
    if (hasEmpty) {
      alert("Please fill in all food fields before adding more!");
      return;
    }

    setFoods([...foods, { food: "", grams: "" }]);
  };


  // Submit foods to backend for calorie calculation
    const submitToBackend = async () => {
    // validation
    for (let item of foods) {
      if (!item.food || !item.grams) {
        alert("Please fill all fields before calculating.");
        return;
      }
    }

    setLoading(true);

    try {

      const res = await fetch("http://localhost:5000/calculate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ foods }),
      });

      const data = await res.json();
      setTotalCalories(data.totalCalories);
    } catch (err) {
      console.error(err);
      alert("Error connecting to backend");
    }

    setLoading(false);
  };


  // Handle typing for each input
  const handleFoodChange = (index, field, value) => {
    const updatedFoods = [...foods];
    updatedFoods[index][field] = value;
    setFoods(updatedFoods);
  };

  // Remove a specific food input
  const removeField = (index) => {
    const updatedFoods = foods.filter((_, i) => i !== index);
    setFoods(updatedFoods);
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!date) {
      alert("Please select a date");
      return;
    }

    // Check if any food field is empty
    const hasEmpty = foods.some(item => item.food === "" || item.grams === "");
    if (hasEmpty) {
      alert("Please fill in all food fields before submitting!");
      return;
    }

    const newEntry = { date, foods };
    setEntries([...entries, newEntry]);

    // Reset form
    setDate("");
    setFoods([{ food: "", grams: "" }]);
  };

  return (
    <div className="p-4">
      <h2>What did you eat today?</h2>

      <form onSubmit={handleSubmit}>
        {foods.map((item, index) => (
          <div key={index} className="Food-Details" style={{ marginBottom: "8px" }}>
            <input
              type="text"
              placeholder="Food (e.g., Rice)"
              value={item.food}
              onChange={(e) => handleFoodChange(index, "food", e.target.value)}
            />
            <input
              type="number"
              placeholder="Grams (e.g., 200)"
              value={item.grams}
              onChange={(e) => handleFoodChange(index, "grams", e.target.value)}
            />
            {/* Show Remove button if more than one field exists */}
            {foods.length > 1 && (
              <button type="button" onClick={() => removeField(index)}>
                Remove
              </button>
            )}
          </div>
        ))}

        <button type="button" onClick={addMoreFields}>
          Add More
        </button>

        <br />

        <input
          type="date"
          placeholder="Date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />

        <button type="submit" onClick={submitToBackend}>Add</button>
      </form>

      <h3>Entries</h3>
      <ul>
        <h1>Total Calories is</h1>
        <p>{totalCalories}</p>
        {entries.map((entry, i) => (
          <li key={i}>
            <strong>{entry.date}</strong>
            <ul>
              {entry.foods.map((f, j) => (
                <li key={j}>
                  {f.food} — {f.grams}g
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default MainBody;
