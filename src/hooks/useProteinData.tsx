
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ProteinWithDetails } from '@/lib/protein-data';
import { SortOption } from '@/components/protein/SortSelect';
import { supabase } from '@/integrations/supabase/client';
import { calculateRecommendedScore } from '@/lib/recommended-score';

const calculatePricePerWeight = (price: number, weight: number, unit: string): number => {
  if (weight <= 0) return 0;
  if (unit === 'g') return (price / weight) * 1000;
  if (unit === 'kg') return price / weight;
  return price;
};

async function fetchProteins(): Promise<ProteinWithDetails[]> {
  const { data, error } = await supabase
    .from('protein-list')
    .select('*')
    .eq('active', true);

  if (error) throw error;

  return data.map((item) => {
    const priceAfter = item.price_after || 0;
    const weight = item.weight || 0;
    const weightUnit = item.weight_unit || 'g';
    const discount = item.discount_percentage || 0;
    const proteinPer100g = item.protein_per_100g || 0;
    const caloriesPer100g = item.calories_per_100g || 0;
    const recommended = calculateRecommendedScore({
      priceAfter,
      weight,
      weightUnit,
      discount,
      proteinPer100g,
      caloriesPer100g,
    });

    return {
      id: item.id.toString(),
      name: item.name || '',
      price: priceAfter,
      priceBefore: item.price_before || undefined,
      discount,
      store: item.supermarket || '',
      brand: item.brand || '',
      packageSize: `${weight}${weightUnit}`,
      unit: weightUnit,
      rating: recommended.rating,
      recommendedScore: recommended.points,
      vegan: item.vegan || false,
      macronutrients: {
        kcal: caloriesPer100g,
        protein: proteinPer100g,
        fat: item.fat_per_100g || 0,
        carbs: item.carbs_per_100g || 0,
        fiber: parseFloat(item.fiber_per_100g || '0'),
      },
      pricePerWeight: calculatePricePerWeight(priceAfter, weight, weightUnit),
    };
  });
}

function sortProteins(proteins: ProteinWithDetails[], sortOption: SortOption): ProteinWithDetails[] {
  return [...proteins].sort((a, b) => {
    if (sortOption.value === 'vegan') {
      if (a.vegan && !b.vegan) return -1;
      if (!a.vegan && b.vegan) return 1;
      return (b.recommendedScore || 0) - (a.recommendedScore || 0);
    }
    const aValue = a[sortOption.value as keyof ProteinWithDetails] as number;
    const bValue = b[sortOption.value as keyof ProteinWithDetails] as number;
    return sortOption.direction === 'asc' ? aValue - bValue : bValue - aValue;
  });
}

export const useProteinData = () => {
  const [selectedStores, setSelectedStores] = useState<string[]>([]);
  const [activeSortOption, setActiveSortOption] = useState<SortOption>({
    id: 'recommended',
    label: 'Aanbevolen',
    value: 'recommendedScore',
    direction: 'desc',
  });

  const { data: allProteins = [], isLoading: loading, error: queryError } = useQuery({
    queryKey: ['proteins'],
    queryFn: fetchProteins,
  });

  const error = queryError ? 'Kon geen eiwitten laden. Probeer het later opnieuw.' : null;

  // Filter + sort are derived synchronously from cached data — no extra useEffect needed
  let filteredProteins = [...allProteins];
  if (selectedStores.length > 0) {
    filteredProteins = filteredProteins.filter((p) => selectedStores.includes(p.store));
  }
  filteredProteins = sortProteins(filteredProteins, activeSortOption);

  const toggleStore = (store: string) => {
    setSelectedStores((prev) =>
      prev.includes(store) ? prev.filter((s) => s !== store) : [...prev, store]
    );
  };

  const handleSortChange = (option: SortOption) => {
    setActiveSortOption(option);
  };

  return {
    allProteins,
    filteredProteins,
    loading,
    error,
    selectedStores,
    activeSortOption,
    toggleStore,
    handleSortChange,
  };
};
