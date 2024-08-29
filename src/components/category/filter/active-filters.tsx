import parse from 'html-react-parser';
import { isEmpty, remove } from 'lodash';
import React from 'react';

import { useTaxonomyContext } from '@src/context/taxonomy-context';
import { cn } from '@src/lib/helpers/helper';
import { IFilterOptionData } from '@src/lib/types/taxonomy';

type ActiveFilterProps = {
  backgroundColor?: string;
  color?: string;
  borderColor?: string;
  isRoundedBorder?: boolean;
};

type Props = {
  label: string;
  onRemove: () => void;
} & ActiveFilterProps;

const ActiveFilter: React.FC<Props> = ({
  label,
  onRemove,
  backgroundColor,
  color,
  borderColor,
  isRoundedBorder,
}) => {
  return (
    <span
      className={cn(
        'min-h-[30px] inline-flex items-center py-0.5 pl-2.5 pr-1 mr-1 text-xs leading-4',
        isRoundedBorder && 'rounded-full',
        borderColor && 'border'
      )}
      style={{ backgroundColor, color, borderColor }}
    >
      {parse(label)}
      <button
        type="button"
        className="ml-0.5 inline-flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full text-white  hover:text-brand-primary focus:bg-brand-primary focus:text-white focus:outline-none"
        onClick={onRemove}
      >
        <svg
          className="h-2 w-2"
          stroke={`${color}`}
          fill="none"
          viewBox="0 0 8 8"
        >
          <path
            strokeLinecap="round"
            strokeWidth="1.5"
            d="M1 1l6 6m0-6L1 7"
          />
        </svg>
      </button>
    </span>
  );
};
export const ActiveFilters = (props: ActiveFilterProps) => {
  const {
    backgroundColor = 'gray',
    color = 'white',
    borderColor = 'gray',
    isRoundedBorder = false,
  } = props;
  const taxonomyCtx = useTaxonomyContext();

  const [, , selectedPriceFilter, setPrice] = taxonomyCtx.priceFilter;
  const [, , selectedBrandsFilter, setBrands] = taxonomyCtx.brandsFilter;
  const [, , selectedSaleFilter, setSale] = taxonomyCtx.saleFilter;
  const [, , selectedNewFilter, setNew] = taxonomyCtx.newFilter;
  const [, , selectedCategoryFilter, setCategory] = taxonomyCtx.categoryFilter;
  const [, , selectedAvailabilityFilter, setAvailability] = taxonomyCtx.availabilityFilter;
  const [, , selectedRefinedSelection, setRefinedSelection] = taxonomyCtx.refinedSelection;
  const [, , attributeState, setAttributeState] = taxonomyCtx.attributeFilter;

  const onRemoveCategoryFilter = (option: IFilterOptionData) => {
    const removedItem = remove(selectedCategoryFilter as IFilterOptionData[], (filterOption) => {
      return option.value !== filterOption.value;
    });

    setCategory(removedItem as IFilterOptionData[]);
  };

  const onRemoveAttributeFilter = (option: IFilterOptionData) => {
    const removedItem = remove(attributeState as IFilterOptionData[], (filterOption) => {
      return option.value !== filterOption.value;
    });

    setAttributeState(removedItem as IFilterOptionData[]);
  };

  const onRemoveBrandsFilter = (option: IFilterOptionData) => {
    const removedItem = remove(selectedBrandsFilter as IFilterOptionData[], (filterOption) => {
      return option.value !== filterOption.value;
    });

    setBrands(removedItem as IFilterOptionData[]);
  };

  const onRemoveRefinedSelection = (option: IFilterOptionData) => {
    const removedItem = remove(selectedRefinedSelection as IFilterOptionData[], (filterOption) => {
      return option.value !== filterOption.value;
    });

    setRefinedSelection(removedItem as IFilterOptionData[]);
  };

  return (
    <div className="flex items-center text-center">
      {!isEmpty(attributeState) &&
        (attributeState as IFilterOptionData[])?.map((option) => {
          return (
            <>
              {!isEmpty(option) && (
                <ActiveFilter
                  label={(option as IFilterOptionData).label}
                  onRemove={() => onRemoveAttributeFilter(option)}
                  backgroundColor={backgroundColor}
                  color={color}
                  borderColor={borderColor}
                  isRoundedBorder={isRoundedBorder}
                />
              )}
            </>
          );
        })}

      {!isEmpty(selectedPriceFilter) && (
        <ActiveFilter
          label={(selectedPriceFilter as IFilterOptionData).label}
          onRemove={() => setPrice(null)}
          backgroundColor={backgroundColor}
          color={color}
          borderColor={borderColor}
          isRoundedBorder={isRoundedBorder}
        />
      )}

      {!isEmpty(selectedBrandsFilter) &&
        (selectedBrandsFilter as IFilterOptionData[])?.map((option) => {
          return (
            <>
              {!isEmpty(option) && (
                <ActiveFilter
                  label={(option as IFilterOptionData).label}
                  onRemove={() => onRemoveBrandsFilter(option)}
                  backgroundColor={backgroundColor}
                  color={color}
                  borderColor={borderColor}
                  isRoundedBorder={isRoundedBorder}
                />
              )}
            </>
          );
        })}

      {!isEmpty(selectedSaleFilter) && (
        <ActiveFilter
          label={(selectedSaleFilter as IFilterOptionData).label}
          onRemove={() => setSale(null)}
          backgroundColor={backgroundColor}
          color={color}
          borderColor={borderColor}
          isRoundedBorder={isRoundedBorder}
        />
      )}

      {!isEmpty(selectedNewFilter) && (
        <ActiveFilter
          label={(selectedNewFilter as IFilterOptionData).label}
          onRemove={() => setNew(null)}
          backgroundColor={backgroundColor}
          color={color}
          borderColor={borderColor}
          isRoundedBorder={isRoundedBorder}
        />
      )}

      {!isEmpty(selectedCategoryFilter) &&
        (selectedCategoryFilter as IFilterOptionData[])?.map((option) => {
          return (
            <>
              {!isEmpty(option) && (
                <ActiveFilter
                  label={(option as IFilterOptionData).label}
                  onRemove={() => onRemoveCategoryFilter(option)}
                  backgroundColor={backgroundColor}
                  color={color}
                  borderColor={borderColor}
                  isRoundedBorder={isRoundedBorder}
                />
              )}
            </>
          );
        })}

      {!isEmpty(selectedAvailabilityFilter) && (
        <ActiveFilter
          label={(selectedAvailabilityFilter as IFilterOptionData).label}
          onRemove={() => setAvailability(null)}
          backgroundColor={backgroundColor}
          color={color}
          borderColor={borderColor}
          isRoundedBorder={isRoundedBorder}
        />
      )}

      {!isEmpty(selectedRefinedSelection) &&
        (selectedRefinedSelection as IFilterOptionData[])?.map((option) => {
          return (
            <>
              {!isEmpty(option) && (
                <ActiveFilter
                  label={(option as IFilterOptionData).label}
                  onRemove={() => onRemoveRefinedSelection(option)}
                  backgroundColor={backgroundColor}
                  color={color}
                  borderColor={borderColor}
                  isRoundedBorder={isRoundedBorder}
                />
              )}
            </>
          );
        })}
    </div>
  );
};