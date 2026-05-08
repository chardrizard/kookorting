import { type Recipe } from '@/lib/types';

export function mockRecipes(
  proteinName: string,
  cuisineName: string,
  language: string,
  adults: number,
  kids: number,
  additionalIngredients: string[] = []
): Recipe[] {
  const totalPortions = adults + Math.ceil(kids * 0.6);
  
  const titles = [
    `${cuisineName} ${proteinName} met Kruiden`, 
    `${cuisineName}-Stijl ${proteinName} Stoofpot`, 
    `Gegrilde ${proteinName} ${cuisineName} Salade`
  ];
  
  const descriptions = [
    `Een eenvoudig maar smaakvol ${cuisineName} gerecht met malse ${proteinName} en aromatische kruiden.`,
    `Een hartige ${cuisineName} stoofpot met malse stukjes ${proteinName}, groenten en kruiden. Perfect voor een comfortabel familiediner.`,
    `Een lichte en verfrissende ${cuisineName} salade met perfect gegrilde ${proteinName}. Dit uitgebalanceerde gerecht combineert eiwitten, verse groenten en een pittige dressing.`
  ];
  
  // Incorporate any provided additional ingredients into the mock recipes
  const extraInfo = additionalIngredients.length > 0 
    ? `In dit recept zijn de volgende extra ingrediënten gebruikt: ${additionalIngredients.join(', ')}.`
    : null;
  
  let mockUserIngredients = [
    `500g ${proteinName}`,
    '3 el olijfolie',
    '2 tenen knoflook',
    '1 tl oregano'
  ];
  
  // Add any additional ingredients to the user ingredients list
  if (additionalIngredients.length > 0) {
    // Distribute additional ingredients across recipes, add at least one to the first recipe
    mockUserIngredients.push(`${additionalIngredients[0]}`);
  }
  
  return [
    {
      id: 'recipe-1',
      title: titles[0],
      description: descriptions[0],
      userIngredients: mockUserIngredients,
      extraIngredients: [],
      instructions: [
        `Bereid de ${proteinName} voor door overtollig vet te verwijderen.`,
        'Marineer het vlees met olijfolie, knoflook en kruiden.',
        'Bak op middelhoog vuur tot goudbruin.',
      ],
      prepTime: 15,
      cookTime: 30,
      totalTime: 45,
      servings: totalPortions,
      similarRecipes: [
        {
          title: `Classic Herb Roasted ${proteinName}`,
          url: `https://www.google.com/search?q=Classic+Herb+Roasted+${proteinName}+recipe`
        },
        {
          title: `${proteinName} with Mediterranean Herbs`,
          url: `https://www.google.com/search?q=${proteinName}+with+Mediterranean+Herbs+recipe`
        }
      ],
      extraInfo: extraInfo
    },
    {
      id: 'recipe-2',
      title: titles[1],
      description: descriptions[1],
      userIngredients: [
        `500g ${proteinName}, in blokjes gesneden`,
        '2 uien, gesnipperd',
        '3 wortels, in plakjes',
        '2 aardappelen, in blokjes',
        ...(additionalIngredients.length > 1 ? [`${additionalIngredients[1]}`] : [])
      ],
      extraIngredients: [
        '400ml groentebouillon',
        '1 blik tomatenblokjes',
        `2 el ${cuisineName} kruiden`
      ],
      instructions: [
        `Kruid de ${proteinName} blokjes met zout en peper.`,
        'Verhit olie in een grote pan op middelhoog vuur.',
        `Bak de ${proteinName} rondom bruin.`,
        'Voeg uien en knoflook toe en fruit tot glazig.',
        'Doe het vlees terug in de pan en voeg groenten, bouillon en tomaten toe.',
        `Voeg ${cuisineName} kruiden toe en roer goed door.`,
        'Breng aan de kook, verlaag dan het vuur en laat 1,5 uur sudderen tot het vlees mals is.',
        'Pas de smaak aan en serveer warm.'
      ],
      prepTime: 20,
      cookTime: 90,
      totalTime: 110,
      servings: totalPortions,
      similarRecipes: [
        {
          title: `Slow Cooked ${proteinName} Stew`,
          url: `https://www.google.com/search?q=Slow+Cooked+${proteinName}+Stew+recipe`
        },
        {
          title: `${proteinName} and Vegetable One Pot`,
          url: `https://www.google.com/search?q=${proteinName}+and+Vegetable+One+Pot+recipe`
        }
      ],
      extraInfo: extraInfo
    },
    {
      id: 'recipe-3',
      title: titles[2],
      description: descriptions[2],
      userIngredients: [
        `400g ${proteinName}`,
        '200g gemengde sla',
        '1 komkommer, in plakjes',
        '1 paprika, in blokjes',
        ...(additionalIngredients.slice(2).map(ingredient => `${ingredient}`))
      ],
      extraIngredients: [
        '1/2 rode ui, dun gesneden',
        `60ml ${cuisineName} dressing`,
        '2 el olijfolie',
        '1 tl gedroogde kruiden',
        'zout en peper naar smaak',
        '30g geroosterde noten'
      ],
      instructions: [
        `Marineer ${proteinName} in olijfolie, zout, peper en gedroogde kruiden gedurende 20 minuten.`,
        'Verwarm de grill voor op middelhoog vuur.',
        `Grill de ${proteinName} tot deze gaar is, ongeveer 5-7 minuten per kant.`,
        'Laat 5 minuten rusten en snijd dan in dunne plakjes.',
        'Combineer alle groenten in een grote kom.',
        `Leg de gesneden ${proteinName} er bovenop.`,
        `Besprenkel met de ${cuisineName} dressing.`,
        'Garneer met geroosterde noten en serveer direct.'
      ],
      prepTime: 15,
      cookTime: 15,
      totalTime: 30,
      servings: totalPortions,
      similarRecipes: [
        {
          title: `Summer ${proteinName} Salad`,
          url: `https://www.google.com/search?q=Summer+${proteinName}+Salad+recipe`
        },
        {
          title: `Grilled ${proteinName} with Fresh Greens`,
          url: `https://www.google.com/search?q=Grilled+${proteinName}+with+Fresh+Greens+recipe`
        }
      ],
      extraInfo: extraInfo
    }
  ];
}
