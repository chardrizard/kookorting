
import { Protein } from '@/lib/types';
import { ProteinWithDetails } from '@/lib/protein-data';
import { calculateOriginalPrice } from '@/lib/price-utils';
import { PROMO_CODES, getPromoLabel, isPromoCode } from '@/lib/promo-codes';
import { Vegan } from 'lucide-react';

const PROMO_BADGE_STYLES: Record<number, string> = {
  [PROMO_CODES.OP_OP]: 'bg-[#FFEDD5] text-[#C2410C]',
  [PROMO_CODES.ONE_PLUS_ONE]: 'bg-[#DBEAFE] text-[#1D4ED8]',
  [PROMO_CODES.TWO_PLUS_ONE]: 'bg-[#DCFCE7] text-[#15803D]',
  [PROMO_CODES.SECOND_HALF]: 'bg-[#EDE9FE] text-[#6D28D9]',
};

interface ProteinCardProps {
  protein: ProteinWithDetails;
  isSelected: boolean;
  onSelect: (protein: Protein) => void;
}

const ProteinCard = ({ protein, isSelected, onSelect }: ProteinCardProps) => {
  const isRecommended = (protein.rating ?? 0) > 4.5;

  const promoLabel = getPromoLabel(protein.discount);
  const isPromo = isPromoCode(protein.discount);

  // Prefer the stored price_before when present and lower-bounded sensibly;
  // fall back to back-computing from discount only for non-promo legacy rows.
  const originalPrice = protein.priceBefore && protein.priceBefore > protein.price
    ? protein.priceBefore
    : calculateOriginalPrice(protein.price, protein.discount);

  // Derive the real % from prices when we have both — robust against stale or
  // wrong stored discount_percentage values.
  const computedDiscount = protein.priceBefore && protein.priceBefore > protein.price
    ? Math.round(((protein.priceBefore - protein.price) / protein.priceBefore) * 100)
    : protein.discount;

  const showOriginalPrice = !isPromo && originalPrice > protein.price;
  
  // Extract the weight from packageSize
  const weightMatch = protein.packageSize.match(/(\d+)(\w+)/);
  const weight = weightMatch ? parseFloat(weightMatch[1]) : 0;
  const unit = weightMatch ? weightMatch[2] : protein.unit;
  
  // Calculate price per kg or per 100g for display
  const pricePerWeight = weight > 0 
    ? unit === 'kg' 
      ? protein.price / weight 
      : (protein.price / weight) * 1000
    : 0;
  
  return (
    <div 
      className={`
        rounded-lg p-4 bg-white w-full cursor-pointer transition-all
        text-left
        ${isSelected 
          ? 'border border-[#2563EB] shadow-[0px_4px_6px_rgba(0,0,0,0.08)]' 
          : 'border border-[#F3F4F6] shadow-[0px_2px_4px_rgba(0,0,0,0.05)]'
        }
        hover:shadow-[0px_4px_6px_rgba(0,0,0,0.08)]
        ${isRecommended ? 'relative' : ''}
      `}
      onClick={() => onSelect(protein)}
    >
      {/* Recommended Badge */}
      {isRecommended && (
        <div className="absolute -top-2 -right-2 bg-[#059669] text-white px-3 py-1 rounded-full text-xs font-semibold shadow-md z-10">
          Aanbevolen
        </div>
      )}
      
      {/* Header - Product Name */}
      <div className="mb-1">
        <h3 className="text-[18px] font-bold text-[#1F2937] leading-tight flex items-center">
          {protein.name}
          {protein.vegan && (
            <Vegan className="ml-2 h-4 w-4 text-green-600" aria-label="Veganistisch product" />
          )}
        </h3>
      </div>
      
      {/* Weight and Store */}
      <div className="text-[14px] text-[#6B7280] mb-4">
        {protein.packageSize} · {protein.store}
      </div>
      
      {/* Pricing Section */}
      <div className="flex justify-between items-end mt-auto">
        <div className="flex flex-col">
          {/* Current and Original Price */}
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[20px] font-bold text-[#1F2937]">
              €{protein.price.toFixed(2)}
            </span>
            {showOriginalPrice && (
              <span className="text-[14px] text-[#9CA3AF] line-through">
                €{originalPrice.toFixed(2)}
              </span>
            )}
          </div>
          
          {/* Price per weight */}
          {pricePerWeight > 0 && (
            <div className="text-[13px] text-[#6B7280] mt-1">
              €{pricePerWeight.toFixed(2)}/kg
            </div>
          )}
          
          {/* Brand */}
          <div className="text-[14px] text-[#6B7280] mt-2">
            {protein.brand}
          </div>
        </div>
        
        {/* Discount Badge */}
        <div className={`
          ${PROMO_BADGE_STYLES[protein.discount] ?? 'bg-[#FEE2E2] text-[#B91C1C]'}
          text-[14px] font-medium px-3 py-1 rounded-full`}
        >
          {promoLabel ?? `${computedDiscount}% korting`}
        </div>
      </div>
    </div>
  );
};

export default ProteinCard;
