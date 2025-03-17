import { useEffect, useState, createContext, useContext, memo } from "react";
import supabase from "./supabase";
import "./assets/styles/style.css";
import { voteStrategies } from "./voteStrategies";

const CATEGORIES = [
  { name: "technology", color: "#3b82f6" },
  { name: "science", color: "#16a34a" },
  { name: "finance", color: "#ef4444" },
  { name: "society", color: "#eab308" },
  { name: "entertainment", color: "#db2777" },
  { name: "health", color: "#14b8a6" },
  { name: "history", color: "#f97316" },
  { name: "news", color: "#8b5cf6" },
];

const CategoryContext = createContext();

const Loader = memo(() => <p>Loading...</p>);

const ButtonFactory = ({ type, label, onClick, color, disabled = false }) => {
  const baseClass = "btn";
  const classes = {
    large: `${baseClass} ${baseClass}-large`,
    category: `${baseClass} ${baseClass}-category`,
    allCategories: `${baseClass} ${baseClass}-all-categories`,
  };

  return (
    <button
      className={classes[type]}
      style={{ backgroundColor: color || "" }}
      onClick={onClick}
      disabled={disabled}
    >
      {label}
    </button>
  );
};

function isValidHttpUrl(string) {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
}

function App() {
  const [showForm, setShowForm] = useState(false);
  const [facts, setFacts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentCategory, setCurrentCategory] = useState("all");

  useEffect(() => {
    async function getFacts() {
      setIsLoading(true);
      let query = supabase.from("facts").select("*");
      if (currentCategory !== "all") {
        query = query.eq("category", currentCategory);
      }
      const { data: facts, error } = await query
        .order("votesInteresting", { ascending: false })
        .limit(1000);
      if (!error) setFacts(facts);
      setIsLoading(false);
    }
    getFacts();
  }, [currentCategory]);

  return (
    <CategoryContext.Provider value={{ currentCategory, setCurrentCategory }}>
      <Header showForm={showForm} setShowForm={setShowForm} />
      {showForm && (
        <NewFactForm setFacts={setFacts} setShowForm={setShowForm} />
      )}
      <main className="main">
        <CategoryFilter />
        {isLoading ? (
          <Loader />
        ) : (
          <FactList facts={facts} setFacts={setFacts} />
        )}
      </main>
    </CategoryContext.Provider>
  );
}

const Header = memo(({ showForm, setShowForm }) => (
  <header className="header">
    <div className="logo">
      <img src="./src/assets/img/logo.png" height="68" width="68" alt="Logo" />
      <h1>Today I Learned</h1>
    </div>
    <ButtonFactory
      type="large"
      label={showForm ? "Close" : "Share a fact"}
      onClick={() => setShowForm((show) => !show)}
    />
  </header>
));

function NewFactForm({ setFacts, setShowForm }) {
  const [text, setText] = useState("");
  const [source, setSource] = useState("");
  const [category, setCategory] = useState("");
  const textLength = text.length;

  async function handleSubmit(e) {
    e.preventDefault();
    if (text && isValidHttpUrl(source) && category && text.length <= 200) {
      const { data, error } = await supabase
        .from("facts")
        .insert([{ text, source, category }])
        .select();
      if (error) return alert("Erro ao inserir no Supabase");
      setFacts((facts) => [data[0], ...facts]);
      setText("");
      setSource("");
      setCategory("");
      setShowForm(false);
    } else alert("Preencha todos os campos corretamente!");
  }

  return (
    <form className="fact-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Share a fact..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <span>{200 - textLength}</span>
      <input
        type="text"
        placeholder="Trustworthy source..."
        value={source}
        onChange={(e) => setSource(e.target.value)}
      />
      <select value={category} onChange={(e) => setCategory(e.target.value)}>
        <option value="">Choose category</option>
        {CATEGORIES.map((cat) => (
          <option key={cat.name} value={cat.name}>
            {cat.name.toUpperCase()}
          </option>
        ))}
      </select>
      <ButtonFactory type="large" label="Post" />
    </form>
  );
}

const CategoryFilter = memo(() => {
  const { setCurrentCategory } = useContext(CategoryContext);

  return (
    <aside>
      <ul>
        <li>
          <ButtonFactory
            type="allCategories"
            label="All"
            onClick={() => setCurrentCategory("all")}
          />
        </li>
        {CATEGORIES.map((cat) => (
          <li key={cat.name} className="category">
            <ButtonFactory
              type="category"
              label={cat.name}
              color={cat.color}
              onClick={() => setCurrentCategory(cat.name)}
            />
          </li>
        ))}
      </ul>
    </aside>
  );
});

function FactList({ facts, setFacts }) {
  if (facts.length === 0) {
    return <p>No facts</p>;
  }

  return (
    <section>
      <ul className="facts-list">
        {facts.map((fact) => (
          <Fact
            key={fact.id}
            fact={fact}
            setFacts={setFacts}
            categories={CATEGORIES}
          />
        ))}
      </ul>
      <p>There are {facts.length} facts in the database. Add your own!</p>
    </section>
  );
}

function Fact({ fact, setFacts, categories }) {
  const [isUpdating, setIsUpdating] = useState(false);

  async function handleVote(voteType) {
    setIsUpdating(true);

    const updatedFactData = voteStrategies[voteType](fact);
    const { data: updatedFact, error } = await supabase
      .from("facts")
      .update({ [voteType]: updatedFactData[voteType] })
      .eq("id", fact.id)
      .select();

    if (!error) {
      setFacts((facts) =>
        facts.map((f) => (f.id === fact.id ? updatedFact[0] : f))
      );
    }
    setIsUpdating(false);
  }

  const categoryColor = categories.find(
    (cat) => cat.name === fact.category
  )?.color;

  return (
    <li className="fact">
      <p>
        {fact.text}
        <a className="source" href={fact.source}>
          (Source)
        </a>
      </p>
      <span className="tag" style={{ backgroundColor: categoryColor }}>
        {fact.category}
      </span>
      <div className="vote-buttons">
        <button
          onClick={() => handleVote("votesInteresting")}
          disabled={isUpdating}
        >
          👍 {fact.votesInteresting}
        </button>
        <button
          onClick={() => handleVote("votesMindblowing")}
          disabled={isUpdating}
        >
          🤯 {fact.votesMindblowing}
        </button>
        <button onClick={() => handleVote("votesFalse")} disabled={isUpdating}>
          ⛔️ {fact.votesFalse}
        </button>
      </div>
    </li>
  );
}

export default App;
