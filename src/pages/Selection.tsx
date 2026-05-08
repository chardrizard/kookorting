
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import SelectionLayout from '@/components/selection/SelectionLayout';
import ValidationAlerts from '@/components/selection/ValidationAlerts';
import GenerateButton from '@/components/selection/GenerateButton';
import ProteinSelection from '@/components/ProteinSelection';
import CuisineSelection from '@/components/CuisineSelection';
import IngredientInput from '@/components/IngredientInput';
import ServingSelector from '@/components/ServingSelector';
import LoadingScreen from '@/components/LoadingScreen';
import PendingIngredientHandler from '@/components/selection/PendingIngredientHandler';
import useRecipeStore from '@/hooks/useRecipeStore';
import { useRecipeGeneration } from '@/hooks/useRecipeGeneration';
import { useSelectionValidation } from '@/hooks/useSelectionValidation';
import { useLanguage } from '@/contexts/LanguageContext';

const Selection = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();
  
  const [pendingIngredient, setPendingIngredient] = useState('');
  const [showUnsavedIngredientModal, setShowUnsavedIngredientModal] = useState(false);
  
  const { isLoading, generateRecipes } = useRecipeGeneration();
  const {
    showProteinAlert,
    showCuisineAlert,
    setShowProteinAlert,
    setShowCuisineAlert,
    proteinRef,
    cuisineRef,
    validateSelection
  } = useSelectionValidation();
  
  const { 
    protein, 
    cuisine,
    selectedPantryIngredients,
    additionalIngredients,
    servingInfo,
    resetStore,
    addAdditionalIngredient
  } = useRecipeStore();
  
  useEffect(() => {
    window.scrollTo(0, 0);
    
    const fromResults = location.state?.fromResults;
    if (fromResults) {
      resetStore();
      window.history.replaceState({}, document.title);
    }
  }, [location, resetStore]);
  
  useEffect(() => {
    if (protein) setShowProteinAlert(false);
    if (cuisine) setShowCuisineAlert(false);
  }, [protein, cuisine, setShowProteinAlert, setShowCuisineAlert]);
  
  const handleInputChange = (value: string) => {
    const sanitized = value
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;')
      .slice(0, 100);
      
    setPendingIngredient(sanitized);
  };
  
  const handleAddPendingIngredient = async () => {
    if (pendingIngredient.trim() && additionalIngredients.length < 5) {
      addAdditionalIngredient(pendingIngredient);
    }
    setPendingIngredient('');
    setShowUnsavedIngredientModal(false);
    await proceedWithRecipeGeneration();
  };
  
  const handleDiscardPendingIngredient = async () => {
    setPendingIngredient('');
    setShowUnsavedIngredientModal(false);
    await proceedWithRecipeGeneration();
  };
  
  const proceedWithRecipeGeneration = async () => {
    const success = await generateRecipes({
      protein,
      cuisine,
      selectedPantryIngredients,
      additionalIngredients,
      servingInfo
    });
    
    if (success) {
      navigate('/results');
    }
  };
  
  const handleGenerateRecipes = () => {
    const isValid = validateSelection({
      protein,
      cuisine,
      selectedPantryIngredients,
      additionalIngredients,
      servingInfo
    });
    
    if (!isValid) return;
    
    if (pendingIngredient.trim() && additionalIngredients.length < 5) {
      setShowUnsavedIngredientModal(true);
      return;
    }
    
    proceedWithRecipeGeneration();
  };
  
  if (isLoading) {
    return <LoadingScreen />;
  }
  
  return (
    <SelectionLayout>
      <div ref={proteinRef}>
        <ValidationAlerts 
          showProteinAlert={showProteinAlert}
          showCuisineAlert={false}
        />
        <ProteinSelection />
      </div>
      
      <div ref={cuisineRef}>
        <ValidationAlerts 
          showProteinAlert={false}
          showCuisineAlert={showCuisineAlert}
        />
        <CuisineSelection />
      </div>
      
      <div className="opacity-75">
        <ServingSelector />
      </div>
      
      <IngredientInput onInputChange={handleInputChange} />
      
      <GenerateButton 
        isLoading={isLoading}
        onClick={handleGenerateRecipes}
      />
      
      <PendingIngredientHandler
        showModal={showUnsavedIngredientModal}
        setShowModal={setShowUnsavedIngredientModal}
        pendingIngredient={pendingIngredient}
        onAddIngredient={handleAddPendingIngredient}
        onDiscardIngredient={handleDiscardPendingIngredient}
      />
    </SelectionLayout>
  );
};

export default Selection;
