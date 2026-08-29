import React, { useCallback, useEffect, useState } from 'react';
import {
  Stack,
  Typography,
  Checkbox,
  OutlinedInput,
  Tooltip,
  IconButton,
  Button,
} from '@mui/material';
import Nouislider from 'nouislider-react';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { ProductLocation, ProductType, ProductMaterial } from '../../enums/product.enum';
import { ProductsInquiry } from '../../types/product/product.input';
import { useRouter } from 'next/router';
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';
import RefreshIcon from '@mui/icons-material/Refresh';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';

interface FilterType {
  searchFilter: ProductsInquiry;
  setSearchFilter: (val: ProductsInquiry) => void;
  initialInput: ProductsInquiry;
}

const PRICE_MIN = 0;
const PRICE_MAX = 2000000;
const PRICE_STEP = 50000;

const formatPrice = (value: number) => `$${value.toLocaleString()}`;

const Filter: React.FC<FilterType> = ({ searchFilter, setSearchFilter, initialInput }) => {
  const device = useDeviceDetect();
  const router = useRouter();

  // Static data
  const [productLocation] = useState<string[]>(Object.values(ProductLocation));
  const [productType] = useState<string[]>(Object.values(ProductType));
  const [productMaterial] = useState<string[]>(Object.values(ProductMaterial));

  // UI-local state
  const [searchText, setSearchText] = useState<string>('');
  const [showLocation, setShowLocation] = useState<boolean>(false);
  const [showType, setShowType] = useState<boolean>(false);
  const [showMaterial, setShowMaterial] = useState<boolean>(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([
    searchFilter?.search?.pricesRange?.start ?? PRICE_MIN,
    searchFilter?.search?.pricesRange?.end ?? PRICE_MAX,
  ]);

  /** EFFECTS **/
  useEffect(() => {
    setSearchText(searchFilter?.search?.text || '');
    setPriceRange([
      searchFilter?.search?.pricesRange?.start ?? PRICE_MIN,
      searchFilter?.search?.pricesRange?.end ?? PRICE_MAX,
    ]);
  }, [searchFilter]);

  useEffect(() => {
    if (searchFilter?.search?.locationList?.length === 0) {
      delete searchFilter.search.locationList;
      setShowLocation(false);

      router.push(
        `/product?input=${JSON.stringify({ ...searchFilter, search: { ...searchFilter.search } })}`,
        `/product?input=${JSON.stringify({ ...searchFilter, search: { ...searchFilter.search } })}`,
        { scroll: false },
      );
    }


    if (searchFilter?.search?.typeList?.length === 0) {
      delete searchFilter.search.typeList;
      setShowType(false);

      router.push(
        `/product?input=${JSON.stringify({ ...searchFilter, search: { ...searchFilter.search } })}`,
        `/product?input=${JSON.stringify({ ...searchFilter, search: { ...searchFilter.search } })}`,
        { scroll: false },
      );
    }


    if (searchFilter?.search?.materialList?.length === 0) {
      delete searchFilter.search.materialList;
      setShowMaterial(false);

      router.push(
        `/product?input=${JSON.stringify({ ...searchFilter, search: { ...searchFilter.search } })}`,
        `/product?input=${JSON.stringify({ ...searchFilter, search: { ...searchFilter.search } })}`,
        { scroll: false },
      );
    }
    if (searchFilter?.search?.options?.length === 0) {
      delete searchFilter.search.options;

      router.push(
        `/product?input=${JSON.stringify({ ...searchFilter, search: { ...searchFilter.search } })}`,
        `/product?input=${JSON.stringify({ ...searchFilter, search: { ...searchFilter.search } })}`,
        { scroll: false },
      );
    }

    if (searchFilter?.search?.locationList?.length) setShowLocation(true);
    if (searchFilter?.search?.typeList?.length) setShowType(true);
    if (searchFilter?.search?.materialList?.length) setShowMaterial(true);
  }, [searchFilter, router]);

  /** HANDLERS **/

  // Location checkbox
  const productLocationSelectHandler = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      try {
        const isChecked = e.target.checked;
        const value = e.target.value as ProductLocation;

        if (isChecked) {
          await router.push(
            `/product?input=${JSON.stringify({
              ...searchFilter,
              search: {
                ...searchFilter.search,
                locationList: [...(searchFilter?.search?.locationList || []), value],
              },
            })}`,
            `/product?input=${JSON.stringify({
              ...searchFilter,
              search: {
                ...searchFilter.search,
                locationList: [...(searchFilter?.search?.locationList || []), value],
              },
            })}`,
            { scroll: false },
          );
        } else if (searchFilter?.search?.locationList?.includes(value)) {
          await router.push(
            `/product?input=${JSON.stringify({
              ...searchFilter,
              search: {
                ...searchFilter.search,
                locationList: searchFilter?.search?.locationList?.filter((item: string) => item !== value),
              },
            })}`,
            `/product?input=${JSON.stringify({
              ...searchFilter,
              search: {
                ...searchFilter.search,
                locationList: searchFilter?.search?.locationList?.filter((item: string) => item !== value),
              },
            })}`,
            { scroll: false },
          );
        }
      } catch (err: any) {
      }
    },
    [router, searchFilter],
  );

  // Type checkbox
  const productTypeSelectHandler = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      try {
        const isChecked = e.target.checked;
        const value = e.target.value as ProductType;

        if (isChecked) {
          await router.push(
            `/product?input=${JSON.stringify({
              ...searchFilter,
              search: {
                ...searchFilter.search,
                typeList: [...(searchFilter?.search?.typeList || []), value],
              },
            })}`,
            `/product?input=${JSON.stringify({
              ...searchFilter,
              search: {
                ...searchFilter.search,
                typeList: [...(searchFilter?.search?.typeList || []), value],
              },
            })}`,
            { scroll: false },
          );
        } else if (searchFilter?.search?.typeList?.includes(value)) {
          await router.push(
            `/product?input=${JSON.stringify({
              ...searchFilter,
              search: {
                ...searchFilter.search,
                typeList: searchFilter?.search?.typeList?.filter((item: string) => item !== value),
              },
            })}`,
            `/product?input=${JSON.stringify({
              ...searchFilter,
              search: {
                ...searchFilter.search,
                typeList: searchFilter?.search?.typeList?.filter((item: string) => item !== value),
              },
            })}`,
            { scroll: false },
          );
        }
      } catch (err: any) {
      }
    },
    [router, searchFilter],
  );

  // Material checkbox
  const productMaterialSelectHandler = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      try {
        const isChecked = e.target.checked;
        const value = e.target.value;

        if (isChecked) {
          await router.push(
            `/product?input=${JSON.stringify({
              ...searchFilter,
              search: {
                ...searchFilter.search,
                materialList: [...(searchFilter?.search?.materialList || []), value],
              },
            })}`,
            `/product?input=${JSON.stringify({
              ...searchFilter,
              search: {
                ...searchFilter.search,
                materialList: [...(searchFilter?.search?.materialList || []), value],
              },
            })}`,
            { scroll: false },
          );
        } else if (searchFilter?.search?.materialList?.includes(value)) {
          await router.push(
            `/product?input=${JSON.stringify({
              ...searchFilter,
              search: {
                ...searchFilter.search,
                materialList: searchFilter?.search?.materialList?.filter((item: string) => item !== value),
              },
            })}`,
            `/product?input=${JSON.stringify({
              ...searchFilter,
              search: {
                ...searchFilter.search,
                materialList: searchFilter?.search?.materialList?.filter((item: string) => item !== value),
              },
            })}`,
            { scroll: false },
          );
        }
      } catch (err: any) {
      }
    },
    [router, searchFilter],
  );

  const productPriceHandler = useCallback(
    async (values: number[]) => {
      const start = Math.max(PRICE_MIN, Math.min(values[0], PRICE_MAX));
      const end = Math.max(start, Math.min(values[1], PRICE_MAX));

      await router.push(
        `/product?input=${JSON.stringify({
          ...searchFilter,
          page: 1,
          search: {
            ...searchFilter.search,
            pricesRange: { start, end },
          },
        })}`,
        `/product?input=${JSON.stringify({
          ...searchFilter,
          page: 1,
          search: {
            ...searchFilter.search,
            pricesRange: { start, end },
          },
        })}`,
        { scroll: false },
      );
    },
    [router, searchFilter],
  );

  const pushFilterInput = useCallback(
    async (input: ProductsInquiry) => {
      setSearchFilter(input);
      await router.push(`/product?input=${JSON.stringify(input)}`, `/product?input=${JSON.stringify(input)}`, {
        scroll: false,
      });
    },
    [router, setSearchFilter],
  );

  const priceSlideHandler = useCallback((values: any[], handle: number, unencodedValues: number[]) => {
    setPriceRange([Math.round(unencodedValues[0]), Math.round(unencodedValues[1])]);
  }, []);

  const priceSetHandler = useCallback(
    async (values: any[], handle: number, unencodedValues: number[]) => {
      const nextRange = [Math.round(unencodedValues[0]), Math.round(unencodedValues[1])];
      setPriceRange(nextRange as [number, number]);
      await productPriceHandler(nextRange);
    },
    [productPriceHandler],
  );

  const renderPriceSlider = () => (
    <Stack className="price-slider-wrap">
      <Stack className="price-slider-values" direction="row" justifyContent="space-between">
        <Typography>{formatPrice(priceRange[0])}</Typography>
        <Typography>{formatPrice(priceRange[1])}</Typography>
      </Stack>
      <Nouislider
        range={{ min: PRICE_MIN, max: PRICE_MAX }}
        start={priceRange}
        step={PRICE_STEP}
        connect
        onSlide={priceSlideHandler}
        onSet={priceSetHandler}
      />
    </Stack>
  );

  // Reset
  const refreshHandler = async () => {
    try {
      setSearchText('');
      setShowLocation(false);
      setShowType(false);
      setShowMaterial(false);

      await router.push(
        `/product?input=${JSON.stringify(initialInput)}`,
        `/product?input=${JSON.stringify(initialInput)}`,
        { scroll: false },
      );
    } catch (err: any) {
    }
  };

  /** MOBILE LAYOUT **/
  if (device === 'mobile') {
    return (
      <Stack className="m-filter-main" spacing={2}>
        {/* HEADER: FILTER & RESET */}
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography fontWeight={700} fontSize={16}>
            Filter
          </Typography>
          <Button
            variant="text"
            size="small"
            onClick={refreshHandler}
            startIcon={<RefreshIcon />}
            sx={{ textTransform: 'none', fontSize: 12 }}
          >
            Reset
          </Button>
        </Stack>

        {/* SEARCH */}
        <Stack spacing={1}>
          <Typography fontSize={13} fontWeight={600}>
            Search
          </Typography>
          <OutlinedInput
            value={searchText}
            type="text"
            placeholder="Type here..."
            onChange={(e: any) => setSearchText(e.target.value)}
            onKeyDown={(event: any) => {
              if (event.key === 'Enter') {
                pushFilterInput({
                  ...searchFilter,
                  search: { ...searchFilter.search, text: searchText },
                }).then();
              }
            }}
            endAdornment={
              <CancelRoundedIcon
                sx={{ cursor: 'pointer' }}
                onClick={() => {
                  setSearchText('');
                  pushFilterInput({
                    ...searchFilter,
                    search: { ...searchFilter.search, text: undefined },
                  }).then();
                }}
              />
            }
            sx={{
              '& .MuiOutlinedInput-notchedOutline': { borderColor: '#000' },
              '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#000' },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#000' },
              fontSize: 13,
            }}
          />
        </Stack>

        {/* LOCATION */}
        <Stack className="m-filter-section" spacing={1}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            onClick={() => setShowLocation((prev) => !prev)}
            sx={{ cursor: 'pointer' }}
          >
            <Typography fontSize={13} fontWeight={600}>
              Location
            </Typography>
            <KeyboardArrowDownRoundedIcon
              sx={{
                fontSize: 20,
                transform: showLocation ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.2s ease',
              }}
            />
          </Stack>

          {showLocation && (
            <Stack spacing={0.5} mt={0.5}>
              {productLocation.map((locVal: string) => (
                <Stack direction="row" alignItems="center" key={locVal}>
                  <Checkbox
                    id={locVal}
                    color="default"
                    size="small"
                    value={locVal}
                    checked={(searchFilter?.search?.locationList || []).includes(locVal as ProductLocation)}
                    onChange={productLocationSelectHandler}
                  />
                  <label htmlFor={locVal} style={{ cursor: 'pointer' }}>
                    <Typography fontSize={13}>{locVal}</Typography>
                  </label>
                </Stack>
              ))}
            </Stack>
          )}
        </Stack>

        {/* TYPE */}
        <Stack className="m-filter-section" spacing={1}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            onClick={() => setShowType((prev) => !prev)}
            sx={{ cursor: 'pointer' }}
          >
            <Typography fontSize={13} fontWeight={600}>
              Product Type
            </Typography>
            <KeyboardArrowDownRoundedIcon
              sx={{
                fontSize: 20,
                transform: showType ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.2s ease',
              }}
            />
          </Stack>

          {showType && (
            <Stack spacing={0.5} mt={0.5}>
              {productType.map((typeVal: string) => (
                <Stack direction="row" alignItems="center" key={typeVal}>
                  <Checkbox
                    id={typeVal}
                    color="default"
                    size="small"
                    value={typeVal}
                    onChange={productTypeSelectHandler}
                    checked={(searchFilter?.search?.typeList || []).includes(typeVal as ProductType)}
                  />
                  <label htmlFor={typeVal} style={{ cursor: 'pointer' }}>
                    <Typography fontSize={13}>{typeVal}</Typography>
                  </label>
                </Stack>
              ))}
            </Stack>
          )}
        </Stack>

        {/* MATERIAL */}
        <Stack className="m-filter-section" spacing={1}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            onClick={() => setShowMaterial((prev) => !prev)}
            sx={{ cursor: 'pointer' }}
          >
            <Typography fontSize={13} fontWeight={600}>
              Material
            </Typography>
            <KeyboardArrowDownRoundedIcon
              sx={{
                fontSize: 20,
                transform: showMaterial ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.2s ease',
              }}
            />
          </Stack>

          {showMaterial && (
            <Stack spacing={0.5} mt={0.5}>
              {productMaterial.map((matVal: string) => (
                <Stack direction="row" alignItems="center" key={matVal}>
                  <Checkbox
                    id={matVal}
                    color="default"
                    size="small"
                    value={matVal}
                    onChange={productMaterialSelectHandler}
                    checked={(searchFilter?.search?.materialList || []).includes(matVal)}
                  />
                  <label htmlFor={matVal} style={{ cursor: 'pointer' }}>
                    <Typography fontSize={13}>{matVal}</Typography>
                  </label>
                </Stack>
              ))}
            </Stack>
          )}
        </Stack>

        {/* PRICE RANGE */}
        <Stack className="m-filter-section" spacing={1}>
          <Typography fontSize={13} fontWeight={600}>
            Price Range
          </Typography>

          {renderPriceSlider()}
        </Stack>
      </Stack>
    );
  }

  /** DESKTOP **/
  return (
    <Stack className="filter-main">
      {/* SEARCH */}
      <Stack className="find-your-jewelry" mb="40px">
        <Typography className="title-main">shop by category</Typography>

        <Stack className="input-box">
          <OutlinedInput
            value={searchText}
            type="text"
            className="search-input"
            placeholder="Type here..."
            onChange={(e: any) => setSearchText(e.target.value)}
            sx={{
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: '#000',
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: '#000',
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: '#000',
              },
            }}
            onKeyDown={(event: any) => {
              if (event.key === 'Enter') {
                pushFilterInput({
                  ...searchFilter,
                  search: { ...searchFilter.search, text: searchText },
                }).then();
              }
            }}
            endAdornment={
              <CancelRoundedIcon
                onClick={() => {
                  setSearchText('');
                  pushFilterInput({
                    ...searchFilter,
                    search: { ...searchFilter.search, text: undefined },
                  }).then();
                }}
              />
            }
          />

          <img src="/img/icons/search_icon.png" alt="" />

          <Tooltip title="Reset">
            <IconButton onClick={refreshHandler}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        </Stack>
      </Stack>

      {/* LOCATION */}
      <Stack className="find-your-jewelry" mb="30px">
        <p className="title" style={{ textShadow: '0px 3px 4px #b9b9b9' }}>
          Location
        </p>

        <Stack
          className="collapsible-list"
          style={{ height: showLocation ? '253px' : '115px' }}
          onMouseEnter={() => setShowLocation(true)}
          onMouseLeave={() => {
            if (!searchFilter?.search?.locationList?.length) {
              setShowLocation(false);
            }
          }}
        >
          {productLocation.map((locVal: string) => (
            <Stack className="input-box" key={locVal}>
              <Checkbox
                id={locVal}
                className="product-checkbox"
                color="default"
                size="small"
                value={locVal}
                checked={(searchFilter?.search?.locationList || []).includes(locVal as ProductLocation)}
                onChange={productLocationSelectHandler}
              />
              <label htmlFor={locVal} style={{ cursor: 'pointer' }}>
                <Typography className="product-type">{locVal}</Typography>
              </label>
            </Stack>
          ))}
        </Stack>
      </Stack>

      {/* TYPE */}
      <Stack className="find-your-jewelry" mb="30px">
        <Typography className="title">Product Type</Typography>

        <Stack
          className="collapsible-list"
          style={{ height: showType ? '253px' : '115px' }}
          onMouseEnter={() => setShowType(true)}
          onMouseLeave={() => {
            if (!searchFilter?.search?.typeList?.length) {
              setShowType(false);
            }
          }}
        >
          {productType.map((typeVal: string) => (
            <Stack className="input-box" key={typeVal}>
              <Checkbox
                id={typeVal}
                className="product-checkbox"
                color="default"
                size="small"
                value={typeVal}
                onChange={productTypeSelectHandler}
                checked={(searchFilter?.search?.typeList || []).includes(typeVal as ProductType)}
              />
              <label htmlFor={typeVal} style={{ cursor: 'pointer' }}>
                <Typography className="product_type">{typeVal}</Typography>
              </label>
            </Stack>
          ))}
        </Stack>
      </Stack>

      {/* MATERIAL */}
      <Stack className="find-your-jewelry" mb="30px">
        <Typography className="title">Material</Typography>

        <Stack
          className="collapsible-list"
          style={{ height: showMaterial ? '253px' : '115px' }}
          onMouseEnter={() => setShowMaterial(true)}
          onMouseLeave={() => {
            if (!searchFilter?.search?.materialList?.length) {
              setShowMaterial(false);
            }
          }}
        >
          {productMaterial.map((matVal: string) => (
            <Stack className="input-box" key={matVal}>
              <Checkbox
                id={matVal}
                className="product-checkbox"
                color="default"
                size="small"
                value={matVal}
                onChange={productMaterialSelectHandler}
                checked={(searchFilter?.search?.materialList || []).includes(matVal)}
              />
              <label htmlFor={matVal} style={{ cursor: 'pointer' }}>
                <Typography className="product_type">{matVal}</Typography>
              </label>
            </Stack>
          ))}
        </Stack>
      </Stack>

      {/* PRICE RANGE */}
      <Stack className="find-your-jewelry">
        <Typography className="title">Price Range</Typography>

        {renderPriceSlider()}
      </Stack>
    </Stack>
  );
};

export default Filter;
