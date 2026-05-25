import { FormEvent, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowDown,
  ArrowUp,
  Check,
  ChefHat,
  ChevronDown,
  Clock,
  Loader2,
  Minus,
  Plus,
  RotateCcw,
  Sparkles,
  Store,
  Users,
  X,
} from 'lucide-react';

import { CUISINES } from '@/constants/cuisineData';
import { useProteinData } from '@/hooks/useProteinData';
import { useRecipeGeneration } from '@/hooks/useRecipeGeneration';
import useRecipeStore from '@/hooks/useRecipeStore';
import { ProteinWithDetails, SUPERMARKETS } from '@/lib/protein-data';
import { Cuisine, Recipe } from '@/lib/types';
import { sanitizeInput } from '@/lib/sanitize';
import { getPromoLabel } from '@/lib/promo-codes';
import { SortOption } from '@/components/protein/SortSelect';

import './Atelier.css';

const SORT_OPTIONS: SortOption[] = [
  { id: 'recommended', label: 'Aanbevolen', value: 'recommendedScore', direction: 'desc' },
  { id: 'lowest-price', label: 'Laagste prijs', value: 'price', direction: 'asc' },
  { id: 'price-per-weight', label: 'Beste waarde', value: 'pricePerWeight', direction: 'asc' },
  { id: 'vegan', label: 'Vegan eerst', value: 'vegan', direction: 'desc' },
];

const preferredCuisineIds = ['c13', 'c1', 'c4', 'c5', 'c11', 'c3', 'c2', 'c10'];

function getVisibleCuisines(showAll: boolean) {
  const topCuisines = preferredCuisineIds
    .map((id) => CUISINES.find((cuisine) => cuisine.id === id))
    .filter(Boolean) as Cuisine[];
  const remainingCuisines = CUISINES.filter((cuisine) => !preferredCuisineIds.includes(cuisine.id));
  const cuisines = [...topCuisines, ...remainingCuisines];

  return showAll ? cuisines : cuisines.slice(0, 8);
}

function inferCategory(productName: string, vegan?: boolean) {
  const name = productName.toLowerCase();

  if (vegan) return { label: 'VEGA', className: 'atelier-category--vegetarian' };
  if (/(tonijn|zalm|vis|garnal|kabeljauw|seafood|sardine|makreel)/.test(name)) {
    return { label: 'VIS', className: 'atelier-category--fish' };
  }
  if (/(kip|chicken|kalkoen|gevogelte)/.test(name)) {
    return { label: 'KIP', className: 'atelier-category--chicken' };
  }
  if (/(rund|beef|biefstuk|gehakt|steak|burger)/.test(name)) {
    return { label: 'RUND', className: 'atelier-category--beef' };
  }
  if (/(varken|pork|spek|ham|worst)/.test(name)) {
    return { label: 'VARK', className: 'atelier-category--pork' };
  }

  return { label: 'EIWIT', className: 'atelier-category--other' };
}

function formatPrice(value: number) {
  return new Intl.NumberFormat('nl-NL', {
    style: 'currency',
    currency: 'EUR',
  }).format(value);
}

function discountLabel(protein: ProteinWithDetails) {
  const promo = getPromoLabel(protein.discount);
  if (promo) return promo;
  // Prefer computed % from real prices over stored discount_percentage
  const computed = protein.priceBefore && protein.priceBefore > protein.price
    ? Math.round(((protein.priceBefore - protein.price) / protein.priceBefore) * 100)
    : protein.discount;
  if (!computed) return 'Actie';
  return `${computed}% korting`;
}

function DealCard({
  protein,
  selected,
  onSelect,
}: {
  protein: ProteinWithDetails;
  selected: boolean;
  onSelect: (protein: ProteinWithDetails) => void;
}) {
  const category = inferCategory(protein.name, protein.vegan);

  return (
    <button
      type="button"
      className={`atelier-deal-card ${selected ? 'is-selected' : ''}`}
      onClick={() => onSelect(protein)}
      aria-pressed={selected}
    >
      <span className={`atelier-category ${category.className}`}>{category.label}</span>
      <span className="atelier-deal-content">
        <span className="atelier-deal-heading">
          <span className="atelier-deal-name">{protein.name}</span>
          {selected && (
            <span className="atelier-selected-mark" aria-label="Geselecteerd">
              <Check size={14} />
            </span>
          )}
        </span>
        <span className="atelier-deal-meta">
          {protein.packageSize} · {protein.store}
        </span>
        <span className="atelier-deal-bottom">
          <span>
            <strong>{formatPrice(protein.price)}</strong>
            {protein.pricePerWeight ? <small>{formatPrice(protein.pricePerWeight)}/kg</small> : null}
          </span>
          <span className="atelier-discount">{discountLabel(protein)}</span>
        </span>
      </span>
    </button>
  );
}

function CuisineTile({
  cuisine,
  selected,
  onSelect,
}: {
  cuisine: Cuisine;
  selected: boolean;
  onSelect: (cuisine: Cuisine) => void;
}) {
  return (
    <button
      type="button"
      className={`atelier-cuisine-tile ${selected ? 'is-selected' : ''}`}
      onClick={() => onSelect(cuisine)}
      aria-pressed={selected}
    >
      <span className="atelier-cuisine-mark" aria-hidden="true">
        {cuisine.name.slice(0, 2).toUpperCase()}
      </span>
      <span>
        <strong>{cuisine.name}</strong>
        <small>{cuisine.pantryIngredients.slice(0, 3).join(' · ')}</small>
      </span>
    </button>
  );
}

function RecipeResultCard({ recipe, index }: { recipe: Recipe; index: number }) {
  const [activeTab, setActiveTab] = useState<'ingredients' | 'instructions'>('ingredients');
  const [open, setOpen] = useState(index === 0);

  return (
    <article className={`atelier-recipe ${open ? 'is-open' : ''}`}>
      <button type="button" className="atelier-recipe-header" onClick={() => setOpen((current) => !current)}>
        <span>
          <small>Recept {index + 1}</small>
          <strong>{recipe.title}</strong>
        </span>
        <ChevronDown size={18} />
      </button>

      {open && (
        <div className="atelier-recipe-body">
          <p>{recipe.description}</p>
          <div className="atelier-recipe-meta">
            <span>
              <Clock size={15} />
              {recipe.totalTime} min
            </span>
            <span>
              <Users size={15} />
              {recipe.servings} porties
            </span>
          </div>

          <div className="atelier-tabs" role="tablist" aria-label="Receptdetails">
            <button
              type="button"
              className={activeTab === 'ingredients' ? 'is-active' : ''}
              onClick={() => setActiveTab('ingredients')}
            >
              Ingrediënten
            </button>
            <button
              type="button"
              className={activeTab === 'instructions' ? 'is-active' : ''}
              onClick={() => setActiveTab('instructions')}
            >
              Instructies
            </button>
          </div>

          {activeTab === 'ingredients' ? (
            <ul className="atelier-ingredient-list">
              {[...recipe.userIngredients, ...recipe.extraIngredients].map((ingredient) => (
                <li key={ingredient}>
                  <span />
                  {ingredient}
                </li>
              ))}
            </ul>
          ) : (
            <ol className="atelier-instruction-list">
              {recipe.instructions.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          )}
        </div>
      )}
    </article>
  );
}

const Atelier = () => {
  const resultsRef = useRef<HTMLDivElement>(null);
  const [proteinLimit, setProteinLimit] = useState(6);
  const [showAllCuisines, setShowAllCuisines] = useState(false);
  const [ingredientInput, setIngredientInput] = useState('');
  const [localError, setLocalError] = useState('');

  const {
    allProteins,
    filteredProteins,
    loading,
    error,
    selectedStores,
    activeSortOption,
    toggleStore,
    handleSortChange,
  } = useProteinData();

  const { isLoading, generateRecipes } = useRecipeGeneration();
  const {
    protein,
    setProtein,
    cuisine,
    setCuisine,
    selectedPantryIngredients,
    additionalIngredients,
    addAdditionalIngredient,
    removeAdditionalIngredient,
    servingInfo,
    updateServingInfo,
    recipes,
    resetStore,
  } = useRecipeStore();

  const availableStores = useMemo(() => {
    const storesFromData = new Set(allProteins.map((item) => item.store).filter(Boolean));
    const knownStores = SUPERMARKETS.map((store) => store.name).filter((store) => storesFromData.has(store));
    const unknownStores = [...storesFromData].filter((store) => !knownStores.includes(store));
    return [...knownStores, ...unknownStores].slice(0, 8);
  }, [allProteins]);

  const visibleProteins = filteredProteins.slice(0, proteinLimit);
  const visibleCuisines = getVisibleCuisines(showAllCuisines);
  const canGenerate = Boolean(protein && cuisine && !isLoading);

  const cleanIngredientInput = sanitizeInput(ingredientInput, 100).trim();
  const ingredientsForGeneration = cleanIngredientInput
    ? [...additionalIngredients, cleanIngredientInput]
    : additionalIngredients;

  const handleIngredientSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!cleanIngredientInput || additionalIngredients.length >= 5) return;
    addAdditionalIngredient(cleanIngredientInput);
    setIngredientInput('');
  };

  const handleGenerate = async () => {
    if (!protein) {
      setLocalError('Kies eerst een aanbieding.');
      return;
    }
    if (!cuisine) {
      setLocalError('Kies een keuken voor je recept.');
      return;
    }

    if (cleanIngredientInput && additionalIngredients.length < 5) {
      addAdditionalIngredient(cleanIngredientInput);
      setIngredientInput('');
    }

    setLocalError('');
    const success = await generateRecipes({
      protein,
      cuisine,
      selectedPantryIngredients,
      additionalIngredients: ingredientsForGeneration,
      servingInfo,
    });

    if (success) {
      window.setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 80);
    }
  };

  const handleReset = () => {
    resetStore();
    setIngredientInput('');
    setLocalError('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="atelier-page">
      <header className="atelier-header">
        <Link to="/" className="atelier-wordmark" aria-label="Kookatelier home">
          <span>Kook</span>atelier
        </Link>
        <nav aria-label="Atelier navigatie">
          <Link to="/selection">Kookorting klassiek</Link>
          <a href="#recipes">Recepten</a>
        </nav>
      </header>

      <main className="atelier-shell">
        <section className="atelier-intro" aria-labelledby="atelier-title">
          <p className="atelier-kicker">Alternatieve studio op dezelfde data</p>
          <h1 id="atelier-title">Van aanbieding naar avondeten.</h1>
          <p>
            Kies een eiwitdeal uit Supabase, zet er een keuken naast, en maak recepten zonder
            productfoto's als fundament.
          </p>
        </section>

        <div className="atelier-workspace">
          <section className="atelier-column" aria-label="Deal en smaak kiezen">
            <div className="atelier-panel">
              <div className="atelier-section-title">
                <span>01</span>
                <div>
                  <h2>Kies je aanbieding</h2>
                  <p>Productfoto optioneel. De kaart blijft bruikbaar met alleen data.</p>
                </div>
              </div>

              <div className="atelier-toolbar">
                <div className="atelier-store-chips" aria-label="Filter op supermarkt">
                  {availableStores.map((store) => (
                    <button
                      type="button"
                      key={store}
                      className={selectedStores.includes(store) ? 'is-active' : ''}
                      onClick={() => toggleStore(store)}
                    >
                      <Store size={14} />
                      {store}
                    </button>
                  ))}
                </div>

                <label className="atelier-sort">
                  <span>Sorteren</span>
                  <select
                    value={activeSortOption.id}
                    onChange={(event) => {
                      const option = SORT_OPTIONS.find((item) => item.id === event.target.value);
                      if (option) handleSortChange(option);
                    }}
                  >
                    {SORT_OPTIONS.map((option) => (
                      <option key={option.id} value={option.id}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  {activeSortOption.direction === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
                </label>
              </div>

              {loading ? (
                <div className="atelier-empty">Aanbiedingen laden...</div>
              ) : error ? (
                <div className="atelier-empty is-error">{error}</div>
              ) : (
                <>
                  <div className="atelier-deal-grid">
                    {visibleProteins.map((item) => (
                      <DealCard
                        key={item.id}
                        protein={item}
                        selected={protein?.id === item.id}
                        onSelect={setProtein}
                      />
                    ))}
                  </div>

                  {filteredProteins.length > proteinLimit && (
                    <button
                      type="button"
                      className="atelier-subtle-button"
                      onClick={() => setProteinLimit((current) => current + 6)}
                    >
                      Meer aanbiedingen tonen
                    </button>
                  )}
                </>
              )}
            </div>

            <div className="atelier-panel">
              <div className="atelier-section-title">
                <span>02</span>
                <div>
                  <h2>Kies een keuken</h2>
                  <p>Beeld mag sfeer geven, maar de keuze moet tekstueel duidelijk blijven.</p>
                </div>
              </div>

              <div className="atelier-cuisine-grid">
                {visibleCuisines.map((item) => (
                  <CuisineTile
                    key={item.id}
                    cuisine={item}
                    selected={cuisine?.id === item.id}
                    onSelect={setCuisine}
                  />
                ))}
              </div>

              {!showAllCuisines && (
                <button type="button" className="atelier-subtle-button" onClick={() => setShowAllCuisines(true)}>
                  Meer keukens tonen
                </button>
              )}
            </div>
          </section>

          <aside className="atelier-brief" aria-label="Recept briefing">
            <div className="atelier-brief-card">
              <div className="atelier-brief-header">
                <span className="atelier-orb">
                  <ChefHat size={20} />
                </span>
                <div>
                  <p>Recept briefing</p>
                  <h2>{protein && cuisine ? 'Klaar om te koken' : 'Bouw je recept'}</h2>
                </div>
              </div>

              <div className="atelier-brief-list">
                <div>
                  <span>Aanbieding</span>
                  <strong>{protein ? protein.name : 'Nog geen eiwit gekozen'}</strong>
                  {protein ? <small>{protein.store} · {formatPrice(protein.price)}</small> : null}
                </div>
                <div>
                  <span>Keuken</span>
                  <strong>{cuisine ? cuisine.name : 'Nog geen keuken gekozen'}</strong>
                  {cuisine ? <small>{cuisine.pantryIngredients.slice(0, 3).join(' · ')}</small> : null}
                </div>
              </div>

              <div className="atelier-serving">
                <div>
                  <span>Volwassenen</span>
                  <div>
                    <button
                      type="button"
                      onClick={() => servingInfo.adults > 1 && updateServingInfo(servingInfo.adults - 1, servingInfo.kids)}
                      disabled={servingInfo.adults <= 1}
                      aria-label="Minder volwassenen"
                    >
                      <Minus size={14} />
                    </button>
                    <strong>{servingInfo.adults}</strong>
                    <button
                      type="button"
                      onClick={() => updateServingInfo(servingInfo.adults + 1, servingInfo.kids)}
                      aria-label="Meer volwassenen"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>
                <div>
                  <span>Kinderen</span>
                  <div>
                    <button
                      type="button"
                      onClick={() => servingInfo.kids > 0 && updateServingInfo(servingInfo.adults, servingInfo.kids - 1)}
                      disabled={servingInfo.kids <= 0}
                      aria-label="Minder kinderen"
                    >
                      <Minus size={14} />
                    </button>
                    <strong>{servingInfo.kids}</strong>
                    <button
                      type="button"
                      onClick={() => updateServingInfo(servingInfo.adults, servingInfo.kids + 1)}
                      aria-label="Meer kinderen"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>
              </div>

              <form className="atelier-extra-form" onSubmit={handleIngredientSubmit}>
                <label htmlFor="atelier-ingredient">Extra ingrediënten</label>
                <div>
                  <input
                    id="atelier-ingredient"
                    value={ingredientInput}
                    onChange={(event) => setIngredientInput(sanitizeInput(event.target.value, 100))}
                    placeholder={additionalIngredients.length >= 5 ? 'Maximum bereikt' : 'Bijv. rijst, limoen'}
                    disabled={additionalIngredients.length >= 5}
                  />
                  <button
                    type="submit"
                    disabled={!cleanIngredientInput || additionalIngredients.length >= 5}
                    aria-label="Ingrediënt toevoegen"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </form>

              {additionalIngredients.length > 0 && (
                <div className="atelier-tags">
                  {additionalIngredients.map((ingredient) => (
                    <button type="button" key={ingredient} onClick={() => removeAdditionalIngredient(ingredient)}>
                      {ingredient}
                      <X size={13} />
                    </button>
                  ))}
                </div>
              )}

              {localError && <p className="atelier-inline-error">{localError}</p>}

              <button type="button" className="atelier-generate" onClick={handleGenerate} disabled={!canGenerate}>
                {isLoading ? (
                  <>
                    <Loader2 size={18} className="atelier-spin" />
                    Recepten maken...
                  </>
                ) : (
                  <>
                    <Sparkles size={18} />
                    Ontdek recepten
                  </>
                )}
              </button>

              <button type="button" className="atelier-reset" onClick={handleReset}>
                <RotateCcw size={14} />
                Begin opnieuw
              </button>
            </div>
          </aside>
        </div>

        {recipes.length > 0 && (
          <section id="recipes" ref={resultsRef} className="atelier-results" aria-labelledby="atelier-results-title">
            <div className="atelier-results-heading">
              <p>Voorbeeldrecepten op basis van je selectie</p>
              <h2 id="atelier-results-title">
                {cuisine?.name} met {protein?.name}
              </h2>
            </div>

            <div className="atelier-recipe-grid">
              {recipes.map((recipe, index) => (
                <RecipeResultCard key={recipe.id} recipe={recipe} index={index} />
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default Atelier;
