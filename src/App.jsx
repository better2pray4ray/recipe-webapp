import { useEffect, useMemo, useState } from 'react'
import './App.css'

const cuisineOptions = [
  'Tex-Mex',
  'Italian',
  'Mediterranean',
  'North American',
  'Middle Eastern',
  'Asian',
  'Latin American',
  'French',
]

const dietOptions = [
  'Low-carb',
  'High-protein',
  'Keto',
  'Vegan',
  'Vegetarian',
  'Gluten-free',
  'Dairy-free',
  'Paleo',
]

const defaultBooks = [
  {
    id: 'comfort',
    name: 'Weeknight Comfort',
    recipeIds: [],
  },
  {
    id: 'party',
    name: 'Dinner Party',
    recipeIds: [],
  },
]

const sampleRecipes = [
  {
    id: 'sample-1',
    title: 'Smoky Chipotle Chicken Tacos',
    description: 'Quick tacos loaded with smoky chipotle chicken, crisp slaw, and lime crema.',
    cuisineTags: ['Tex-Mex'],
    dietTags: ['High-protein'],
    imageUrl: 'https://images.unsplash.com/photo-1608033228208-4e5420e329de?auto=format&fit=crop&w=900&q=80',
    ingredients: [
      { name: 'Chicken thighs', amount: '500g, sliced' },
      { name: 'Chipotle peppers in adobo', amount: '2 tbsp, minced' },
      { name: 'Corn tortillas', amount: '8 small' },
      { name: 'Red cabbage', amount: '1 cup, shredded' },
      { name: 'Lime', amount: '1, juiced' },
      { name: 'Cilantro', amount: '1/4 cup, chopped' },
    ],
    steps: [
      'Sear chicken in a hot skillet until browned.',
      'Stir in chipotle, lime juice, and a pinch of salt; cook 3 minutes.',
      'Warm tortillas and assemble with chicken, cabbage, and cilantro.',
    ],
    prepTimeMinutes: 10,
    cookTimeMinutes: 20,
    servings: 4,
    difficulty: 'easy',
    recipeBooks: ['comfort'],
    createdAt: new Date().toISOString(),
  },
]

const storageKeys = {
  recipes: 'recipe-webapp:recipes',
  books: 'recipe-webapp:books',
}

const randomPick = (list, count = 3) => {
  const shuffled = [...list].sort(() => 0.5 - Math.random())
  return shuffled.slice(0, count)
}

const pantryItems = [
  'olive oil',
  'garlic',
  'onion',
  'sea salt',
  'black pepper',
  'lemon',
  'fresh herbs',
  'chili flakes',
  'vegetable stock',
  'tomatoes',
  'yogurt',
  'rice',
  'quinoa',
  'beans',
  'spinach',
]

const proteinItems = ['chicken breast', 'tofu', 'salmon', 'lentils', 'paneer', 'shrimp', 'chickpeas']
const carbItems = ['basmati rice', 'farro', 'whole wheat pasta', 'corn tortillas', 'cauliflower rice', 'buckwheat noodles']
const veggieItems = ['broccoli', 'bell pepper', 'zucchini', 'mushrooms', 'kale', 'carrots', 'peas']

function buildImageUrl(cuisines, diets, prompt) {
  const topic = [
    cuisines[0]?.toLowerCase()?.replace(/\s+/g, '-'),
    diets[0]?.toLowerCase()?.replace(/\s+/g, '-'),
    'plated-food',
    prompt?.split(' ').slice(0, 2).join('-'),
  ]
    .filter(Boolean)
    .join(',')

  return `https://images.unsplash.com/featured/?${topic || 'food'}`
}

function generateRecipe({ prompt, selectedCuisines, selectedDiets }) {
  const titleBase = prompt?.trim()
    ? prompt
    : `${selectedCuisines[0] || 'Chef\'s choice'} inspired bowl`

  const steps = [
    'Prep the ingredients and preheat your pan or oven.',
    'Build layers of flavor with aromatics, herbs, and spices.',
    'Cook protein and vegetables until tender and well-seasoned.',
    'Finish with acid, fresh herbs, and a contrasting garnish.',
  ]

  const ingredients = [
    ...randomPick(pantryItems, 4),
    ...randomPick(proteinItems, 1),
    ...randomPick(carbItems, 1),
    ...randomPick(veggieItems, 3),
  ].map((item) => ({ name: item, amount: 'to taste' }))

  const prepTimeMinutes = 15 + Math.floor(Math.random() * 15)
  const cookTimeMinutes = 20 + Math.floor(Math.random() * 25)
  const servings = [2, 3, 4, 6][Math.floor(Math.random() * 4)]
  const difficulty = ['easy', 'medium', 'hard'][Math.floor(Math.random() * 3)]

  return {
    id: crypto.randomUUID(),
    title: titleBase,
    description:
      'A balanced, realistic recipe tailored to your cuisine and dietary picks with crisp textures and vibrant flavors.',
    cuisineTags: selectedCuisines.length ? selectedCuisines : ['Fusion'],
    dietTags: selectedDiets,
    imageUrl: buildImageUrl(selectedCuisines, selectedDiets, prompt),
    ingredients,
    steps,
    prepTimeMinutes,
    cookTimeMinutes,
    servings,
    difficulty,
    recipeBooks: [],
    createdAt: new Date().toISOString(),
  }
}

function usePersistentState(key, initialValue) {
  const [state, setState] = useState(() => {
    const stored = localStorage.getItem(key)
    if (stored) {
      try {
        return JSON.parse(stored)
      } catch (e) {
        return initialValue
      }
    }
    return initialValue
  })

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(state))
  }, [key, state])

  return [state, setState]
}

function BottomNav({ current, onNavigate }) {
  const items = [
    { id: 'home', label: 'Home' },
    { id: 'recipes', label: 'My Recipes' },
    { id: 'books', label: 'Recipe Books' },
  ]

  return (
    <nav className="bottom-nav">
      {items.map((item) => (
        <button
          key={item.id}
          className={`nav-btn ${current === item.id ? 'active' : ''}`}
          onClick={() => onNavigate(item.id)}
        >
          {item.label}
        </button>
      ))}
    </nav>
  )
}

function Chip({ label, selected, onToggle }) {
  return (
    <button className={`chip ${selected ? 'chip-selected' : ''}`} onClick={() => onToggle(label)}>
      {label}
    </button>
  )
}

function Tag({ label }) {
  return <span className="tag">{label}</span>
}

function IngredientList({ items }) {
  return (
    <ul className="pill-list">
      {items.map((item, idx) => (
        <li key={idx} className="pill">
          <strong>{item.name}</strong>
          <span>{item.amount}</span>
        </li>
      ))}
    </ul>
  )
}

function RecipeCard({ recipe, onOpen, onDelete, onMove }) {
  return (
    <div className="recipe-card">
      <img src={recipe.imageUrl} alt={recipe.title} className="card-image" />
      <div className="card-content">
        <div className="card-header">
          <h3>{recipe.title}</h3>
          <span className="meta">{recipe.cuisineTags.join(', ')}</span>
        </div>
        <div className="tag-row">
          {recipe.dietTags.concat(recipe.cuisineTags).map((tag) => (
            <Tag key={tag} label={tag} />
          ))}
        </div>
        <div className="card-actions">
          <button className="primary" onClick={() => onOpen(recipe)}>
            Open
          </button>
          <button className="ghost" onClick={() => onMove(recipe)}>
            Move to book
          </button>
          <button className="danger" onClick={() => onDelete(recipe.id)}>
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}

function BookList({ books, onSelect, onDelete }) {
  return (
    <div className="book-grid">
      {books.map((book) => (
        <div key={book.id} className="book-card">
          <div className="book-card-header">
            <div>
              <h3>{book.name}</h3>
              <p>{book.recipeIds.length} recipes</p>
            </div>
            <button
              className="icon-btn"
              onClick={() => onDelete(book.id)}
              aria-label={`Delete ${book.name} book`}
            >
              🗑
            </button>
          </div>
          <button className="ghost block" onClick={() => onSelect(book)}>
            Open
          </button>
        </div>
      ))}
    </div>
  )
}

function RecipeDetail({ recipe, onSave, onMove, onRemoveFromBook, books, isSaved }) {
  if (!recipe) return null

  const timeTotal = recipe.prepTimeMinutes + recipe.cookTimeMinutes

  return (
    <div className="recipe-detail">
      <div className="hero">
        <img src={recipe.imageUrl} alt={recipe.title} />
      </div>
      <div className="detail-header">
        <div>
          <p className="meta">{new Date(recipe.createdAt).toLocaleDateString()}</p>
          <h1>{recipe.title}</h1>
          <p className="description">{recipe.description}</p>
          <div className="tag-row">
            {recipe.cuisineTags.map((tag) => (
              <Tag key={tag} label={tag} />
            ))}
            {recipe.dietTags.map((tag) => (
              <Tag key={tag} label={tag} />
            ))}
          </div>
          <div className="stats-row">
            <span>Prep {recipe.prepTimeMinutes} min</span>
            <span>Cook {recipe.cookTimeMinutes} min</span>
            <span>Total {timeTotal} min</span>
            <span>Serves {recipe.servings}</span>
            <span>Difficulty {recipe.difficulty}</span>
          </div>
        </div>
        <div className="detail-actions">
          {!isSaved ? (
            <button className="primary block" onClick={() => onSave(recipe)}>
              Save to My Recipes
            </button>
          ) : (
            <>
              <button className="ghost block" onClick={() => onMove(recipe)}>
                Move to recipe book
              </button>
              {recipe.recipeBooks.length > 0 && (
                <div className="book-tags">
                  {recipe.recipeBooks.map((bookId) => (
                    <button key={bookId} className="tiny" onClick={() => onRemoveFromBook(recipe, bookId)}>
                      Remove from {books.find((b) => b.id === bookId)?.name || 'book'}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <section>
        <h2>Ingredients</h2>
        <IngredientList items={recipe.ingredients} />
      </section>

      <section>
        <h2>Instructions</h2>
        <ol className="steps">
          {recipe.steps.map((step, idx) => (
            <li key={idx}>{step}</li>
          ))}
        </ol>
      </section>
    </div>
  )
}

function App() {
  const [view, setView] = useState('home')
  const [prompt, setPrompt] = useState('')
  const [selectedCuisines, setSelectedCuisines] = useState(['Mediterranean'])
  const [selectedDiets, setSelectedDiets] = useState(['Gluten-free'])
  const [recipes, setRecipes] = usePersistentState(storageKeys.recipes, sampleRecipes)
  const [books, setBooks] = usePersistentState(storageKeys.books, defaultBooks)
  const [currentRecipe, setCurrentRecipe] = useState(sampleRecipes[0])
  const [activeBook, setActiveBook] = useState(null)

  useEffect(() => {
    if (recipes.length && !currentRecipe) {
      setCurrentRecipe(recipes[0])
    }
  }, [recipes, currentRecipe])

  const handleChipToggle = (label, setFn, current) => {
    if (current.includes(label)) {
      setFn(current.filter((item) => item !== label))
    } else {
      setFn([...current, label])
    }
  }

  const handleGenerate = () => {
    const recipe = generateRecipe({ prompt, selectedCuisines, selectedDiets })
    setCurrentRecipe(recipe)
    setView('detail')
  }

  const handleSave = (recipe) => {
    if (recipes.some((r) => r.id === recipe.id)) return
    setRecipes([recipe, ...recipes])
  }

  const handleDelete = (id) => {
    setRecipes(recipes.filter((r) => r.id !== id))
    setBooks(
      books.map((book) => ({
        ...book,
        recipeIds: book.recipeIds.filter((rid) => rid !== id),
      })),
    )
    if (currentRecipe?.id === id) {
      setCurrentRecipe(recipes[0] || null)
      setView('home')
    }
  }

  const handleDeleteBook = (bookId) => {
    setBooks(books.filter((b) => b.id !== bookId))
    setRecipes(
      recipes.map((recipe) => ({
        ...recipe,
        recipeBooks: recipe.recipeBooks.filter((id) => id !== bookId),
      })),
    )
    if (activeBook?.id === bookId) {
      setActiveBook(null)
    }
  }

  const handleOpenRecipe = (recipe) => {
    setCurrentRecipe(recipe)
    setView('detail')
  }

  const handleMoveToBook = (recipe) => {
    if (!books.length) return
    const book = books[0]
    if (book.recipeIds.includes(recipe.id)) return

    setBooks(
      books.map((b) =>
        b.id === book.id ? { ...b, recipeIds: [recipe.id, ...b.recipeIds] } : b,
      ),
    )
    setRecipes(
      recipes.map((r) =>
        r.id === recipe.id ? { ...r, recipeBooks: [book.id, ...r.recipeBooks] } : r,
      ),
    )
  }

  const handleMoveToSelectedBook = (recipe, bookId) => {
    setBooks(
      books.map((b) =>
        b.id === bookId && !b.recipeIds.includes(recipe.id)
          ? { ...b, recipeIds: [recipe.id, ...b.recipeIds] }
          : b,
      ),
    )
    setRecipes(
      recipes.map((r) =>
        r.id === recipe.id && !r.recipeBooks.includes(bookId)
          ? { ...r, recipeBooks: [bookId, ...r.recipeBooks] }
          : r,
      ),
    )
  }

  const handleRemoveFromBook = (recipe, bookId) => {
    setBooks(
      books.map((b) =>
        b.id === bookId ? { ...b, recipeIds: b.recipeIds.filter((id) => id !== recipe.id) } : b,
      ),
    )
    setRecipes(
      recipes.map((r) =>
        r.id === recipe.id ? { ...r, recipeBooks: r.recipeBooks.filter((id) => id !== bookId) } : r,
      ),
    )
  }

  const handleCreateBook = (name) => {
    if (!name.trim()) return
    const newBook = { id: crypto.randomUUID(), name: name.trim(), recipeIds: [] }
    setBooks([newBook, ...books])
  }

  const currentBookRecipes = useMemo(() => {
    if (!activeBook) return []
    return recipes.filter((r) => activeBook.recipeIds.includes(r.id))
  }, [activeBook, recipes])

  const isSaved = currentRecipe && recipes.some((r) => r.id === currentRecipe.id)

  const renderBookSelector = (recipe) => (
    <div className="book-selector">
      <p>Select a book:</p>
      <div className="book-grid">
        {books.map((book) => (
          <button key={book.id} className="book-card" onClick={() => handleMoveToSelectedBook(recipe, book.id)}>
            <h4>{book.name}</h4>
            <p>{book.recipeIds.length} recipes</p>
          </button>
        ))}
      </div>
    </div>
  )

  return (
    <div className="app-shell">
      <header className="top-bar">
        <div>
          <p className="eyebrow">Recipe generator</p>
          <h1>Chefly</h1>
        </div>
        <div className="avatar">🍲</div>
      </header>

      {view === 'home' && (
        <main className="page">
          <section className="panel">
            <h2>Create a recipe</h2>
            <p className="description">Select cuisines, dietary tags, or type your own prompt. We will craft a realistic recipe with a hero image and clear steps.</p>
            <label className="field">
              <span>Custom prompt</span>
              <textarea
                value={prompt}
                placeholder="e.g., cozy lemony pasta with seasonal veggies"
                onChange={(e) => setPrompt(e.target.value)}
              />
            </label>
            <div className="field">
              <span>Cuisines</span>
              <div className="chip-row">
                {cuisineOptions.map((cuisine) => (
                  <Chip
                    key={cuisine}
                    label={cuisine}
                    selected={selectedCuisines.includes(cuisine)}
                    onToggle={(label) => handleChipToggle(label, setSelectedCuisines, selectedCuisines)}
                  />
                ))}
              </div>
            </div>
            <div className="field">
              <span>Dietary preferences</span>
              <div className="chip-row">
                {dietOptions.map((diet) => (
                  <Chip
                    key={diet}
                    label={diet}
                    selected={selectedDiets.includes(diet)}
                    onToggle={(label) => handleChipToggle(label, setSelectedDiets, selectedDiets)}
                  />
                ))}
              </div>
            </div>
            <button className="primary block" onClick={handleGenerate}>
              Generate recipe
            </button>
            <button className="ghost block" onClick={() => setView('recipes')}>
              View my recipes
            </button>
          </section>

          {currentRecipe && (
            <section className="panel preview">
              <p className="eyebrow">Latest creation</p>
              <div className="preview-card" onClick={() => setView('detail')}>
                <img src={currentRecipe.imageUrl} alt={currentRecipe.title} />
                <div>
                  <h3>{currentRecipe.title}</h3>
                  <p className="description">{currentRecipe.description}</p>
                  <div className="tag-row">
                    {currentRecipe.cuisineTags.concat(currentRecipe.dietTags).map((tag) => (
                      <Tag key={tag} label={tag} />
                    ))}
                  </div>
                </div>
              </div>
            </section>
          )}
        </main>
      )}

      {view === 'detail' && (
        <main className="page">
          <RecipeDetail
            recipe={currentRecipe}
            onSave={handleSave}
            onMove={(recipe) => handleMoveToBook(recipe)}
            onRemoveFromBook={handleRemoveFromBook}
            books={books}
            isSaved={isSaved}
          />
          {isSaved && books.length > 0 && renderBookSelector(currentRecipe)}
        </main>
      )}

      {view === 'recipes' && (
        <main className="page">
          <div className="panel">
            <h2>My Recipes</h2>
            <p className="description">Saved recipes appear here. Open to view the full details, move to a book, or remove them.</p>
          </div>
          <div className="stack">
            {recipes.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                onOpen={handleOpenRecipe}
                onDelete={handleDelete}
                onMove={(r) => setCurrentRecipe(r) || setView('books')}
              />
            ))}
            {!recipes.length && <p className="empty">No recipes saved yet. Generate one to get started.</p>}
          </div>
        </main>
      )}

      {view === 'books' && (
        <main className="page">
          <div className="panel">
            <h2>Recipe books</h2>
            <p className="description">Organize saved recipes into themed collections.</p>
            <BookForm onCreate={handleCreateBook} />
          </div>
          <BookList
            books={books}
            onSelect={(book) => {
              setActiveBook(book)
              setView('books')
            }}
            onDelete={handleDeleteBook}
          />

          {activeBook && (
            <section className="panel">
              <div className="book-header">
                <h3>{activeBook.name}</h3>
                <p className="meta">{activeBook.recipeIds.length} recipes</p>
              </div>
              <div className="stack">
                {currentBookRecipes.map((recipe) => (
                  <RecipeCard
                    key={recipe.id}
                    recipe={recipe}
                    onOpen={handleOpenRecipe}
                    onDelete={handleDelete}
                    onMove={(r) => setCurrentRecipe(r) || setView('books')}
                  />
                ))}
                {!currentBookRecipes.length && (
                  <p className="empty">This book is empty. Open a recipe to move it here.</p>
                )}
              </div>
            </section>
          )}
        </main>
      )}

      <BottomNav current={view} onNavigate={setView} />
    </div>
  )
}

function BookForm({ onCreate }) {
  const [name, setName] = useState('')

  return (
    <div className="book-form">
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Name your collection"
        aria-label="Recipe book name"
      />
      <button
        className="primary"
        onClick={() => {
          onCreate(name)
          setName('')
        }}
      >
        Create
      </button>
    </div>
  )
}

export default App
