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

  /** EFFECTS **/
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
        console.log('ERROR, productLocationSelectHandler:', err);
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
        console.log('ERROR, productTypeSelectHandler:', err);
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
        console.log('ERROR, productMaterialSelectHandler:', err);
      }
    },
    [router, searchFilter],
  );

  const productPriceHandler = useCallback(
    async (value: number, type: 'start' | 'end') => {
      if (type === 'start') {
        await router.push(
          `/product?input=${JSON.stringify({
            ...searchFilter,
            search: {
              ...searchFilter.search,
              pricesRange: { ...searchFilter.search.pricesRange, start: value * 1 },
            },
          })}`,
          `/product?input=${JSON.stringify({
            ...searchFilter,
            search: {
              ...searchFilter.search,
              pricesRange: { ...searchFilter.search.pricesRange, start: value * 1 },
            },
          })}`,
          { scroll: false },
        );
      } else {
        await router.push(
          `/product?input=${JSON.stringify({
            ...searchFilter,
            search: {
              ...searchFilter.search,
              pricesRange: { ...searchFilter.search.pricesRange, end: value * 1 },
            },
          })}`,
          `/product?input=${JSON.stringify({
            ...searchFilter,
            search: {
              ...searchFilter.search,
              pricesRange: { ...searchFilter.search.pricesRange, end: value * 1 },
            },
          })}`,
          { scroll: false },
        );
      }
    },
    [router, searchFilter],
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
      console.log('ERROR, refreshHandler:', err);
    }
  };

  /** 📱 MOBILE LAYOUT **/
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
                setSearchFilter({
                  ...searchFilter,
                  search: { ...searchFilter.search, text: searchText },
                });
              }
            }}
            endAdornment={
              <CancelRoundedIcon
                sx={{ cursor: 'pointer' }}
                onClick={() => {
                  setSearchText('');
                  setSearchFilter({
                    ...searchFilter,
                    search: { ...searchFilter.search, text: '' },
                  });
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

          <Stack direction="row" alignItems="center" gap={1}>
            <OutlinedInput
              type="number"
              placeholder="$ min"
              inputProps={{ min: 0 }}
              value={searchFilter?.search?.pricesRange?.start ?? 0}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                const v = Number(e.target.value);
                if (v >= 0) {
                  productPriceHandler(v, 'start');
                }
              }}
              sx={{
                flex: 1,
                '& .MuiOutlinedInput-notchedOutline': { borderColor: '#ddd' },
                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#bbb' },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#000' },
                fontSize: 13,
              }}
            />
            <Typography fontSize={13}>–</Typography>
            <OutlinedInput
              type="number"
              placeholder="$ max"
              inputProps={{ min: 0 }}
              value={searchFilter?.search?.pricesRange?.end ?? 0}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                const v = Number(e.target.value);
                if (v >= 0) {
                  productPriceHandler(v, 'end');
                }
              }}
              sx={{
                flex: 1,
                '& .MuiOutlinedInput-notchedOutline': { borderColor: '#ddd' },
                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#bbb' },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#000' },
                fontSize: 13,
              }}
            />
          </Stack>
        </Stack>
      </Stack>
    );
  }

  /** 💻 DESKTOP **/
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
                setSearchFilter({
                  ...searchFilter,
                  search: { ...searchFilter.search, text: searchText },
                });
              }
            }}
            endAdornment={
              <CancelRoundedIcon
                onClick={() => {
                  setSearchText('');
                  setSearchFilter({
                    ...searchFilter,
                    search: { ...searchFilter.search, text: '' },
                  });
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

        <Stack className="square-year-input">
          <input
            type="number"
            placeholder="$ min"
            min={0}
            value={searchFilter?.search?.pricesRange?.start ?? 0}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              const v = Number(e.target.value);
              if (v >= 0) {
                productPriceHandler(v, 'start');
              }
            }}
          />
          <div className="central-divider" />
          <input
            type="number"
            placeholder="$ max"
            min={0}
            value={searchFilter?.search?.pricesRange?.end ?? 0}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              const v = Number(e.target.value);
              if (v >= 0) {
                productPriceHandler(v, 'end');
              }
            }}
          />
        </Stack>
      </Stack>
    </Stack>
  );
};

export default Filter;