
import { useState, useEffect } from 'react';
import { ProteinWithDetails } from '@/lib/protein-data';
import { SortOption } from '@/components/protein/SortSelect';
import { supabase } from '@/integrations/supabase/client';

const calculatePricePerWeight = (price: number, weight: number, unit: string): number => {
  if (weight <= 0) return 0;
  
  if (unit === 'g') {
    return (price / weight) * 1000;
  } else if (unit === 'kg') {
    return price / weight;
  }
  
  return price;
};

export const useProteinData = () => {
  const [allProteins, setAllProteins] = useState<ProteinWithDetails[]>([]);
  const [filteredProteins, setFilteredProteins] = useState<ProteinWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStores, setSelectedStores] = useState<string[]>([]);
  const [activeSortOption, setActiveSortOption] = useState<SortOption>({ 
    id: 'recommended', 
    label: 'Aanbevolen', 
    value: 'rating', 
    direction: 'desc' 
  });

  useEffect(() => {
    const fetchProteins = async () => {
      try {
        const { data, error } = await supabase
          .from('protein-list')
          .select('*')
          .eq('active', true);
          
        if (error) throw error;
        
        const transformedData = data.map(item => ({
          id: item.id.toString(),
          name: item.name || '',
          price: item.price_after || 0,
          discount: item.discount_percentage || 0,
          store: item.supermarket || '',
          brand: item.brand || '',
          packageSize: `${item.weight || 0}${item.weight_unit || 'g'}`,
          unit: item.weight_unit || 'g',
          rating: item.rating || 0,
          vegan: item.vegan || false,
          macronutrients: {
            kcal: item.calories_per_100g || 0,
            protein: item.protein_per_100g || 0,
            fat: item.fat_per_100g || 0,
            carbs: item.carbs_per_100g || 0,
            fiber: parseFloat(item.fiber_per_100g || '0')
          },
          pricePerWeight: calculatePricePerWeight(
            item.price_after || 0, 
            item.weight || 0, 
            item.weight_unit || 'g'
          )
        }));
        
        setAllProteins(transformedData);
        setFilteredProteins(transformedData);
      } catch (err) {
        console.error('Error fetching proteins:', err);
        setError('Kon geen eiwitten laden. Probeer het later opnieuw.');
      } finally {
        setLoading(false);
      }
    };

    fetchProteins();
  }, []);

  const sortProteins = (proteins: ProteinWithDetails[], sortOption: SortOption): ProteinWithDetails[] => {
    return [...proteins].sort((a, b) => {
      if (sortOption.value === 'vegan') {
        if (a.vegan && !b.vegan) return -1;
        if (!a.vegan && b.vegan) return 1;
        return (b.rating || 0) - (a.rating || 0);
      }
      
      const aValue = a[sortOption.value as keyof ProteinWithDetails] as number;
      const bValue = b[sortOption.value as keyof ProteinWithDetails] as number;
      
      return sortOption.direction === 'asc' 
        ? aValue - bValue 
        : bValue - aValue;
    });
  };

  useEffect(() => {
    let result = [...allProteins];
    
    if (selectedStores.length > 0) {
      result = result.filter(p => selectedStores.includes(p.store));
    }
    
    result = sortProteins(result, activeSortOption);
    
    setFilteredProteins(result);
  }, [selectedStores, allProteins, activeSortOption]);

  const toggleStore = (store: string) => {
    if (selectedStores.includes(store)) {
      setSelectedStores(selectedStores.filter(s => s !== store));
    } else {
      setSelectedStores([...selectedStores, store]);
    }
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
    handleSortChange
  };
};
