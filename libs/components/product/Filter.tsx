import React, { useCallback, useEffect, useState } from 'react';
import { Stack, Typography, Checkbox, OutlinedInput, Tooltip, IconButton } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { ProductLocation, ProductType, ProductMaterial } from '../../enums/product.enum';
import { ProductsInquiry } from '../../types/product/product.input';
import { useRouter } from 'next/router';
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';
import RefreshIcon from '@mui/icons-material/Refresh';

interface FilterType {
	searchFilter: ProductsInquiry;
	setSearchFilter: (val: ProductsInquiry) => void;
	initialInput: ProductsInquiry;
}

const Filter: React.FC<FilterType> = ({ searchFilter, setSearchFilter, initialInput }) => {
	const device = useDeviceDetect();
	const router = useRouter();

	// Variantlar (enum -> string[])
	const [productLocation] = useState<string[]>(Object.values(ProductLocation));
	const [productType] = useState<string[]>(Object.values(ProductType));
	const [productMaterial] = useState<string[]>(Object.values(ProductMaterial));

	// UI-local state
	const [searchText, setSearchText] = useState<string>('');
	const [showMore, setShowMore] = useState<boolean>(false);

	/** EFFECTS **/
	useEffect(() => {
		// Agar locationList bo'shab qolsa, o'chiramiz va URLni qayta push qilamiz
		if (searchFilter?.search?.locationList?.length === 0) {
			delete searchFilter.search.locationList;
			setShowMore(false);

			router
				.push(
					`/product?input=${JSON.stringify({
						...searchFilter,
						search: {
							...searchFilter.search,
						},
					})}`,
					`/product?input=${JSON.stringify({
						...searchFilter,
						search: {
							...searchFilter.search,
						},
					})}`,
					{ scroll: false },
				)
				.then();
		}

		// Agar typeList bo'shab qolsa
		if (searchFilter?.search?.typeList?.length === 0) {
			delete searchFilter.search.typeList;

			router
				.push(
					`/product?input=${JSON.stringify({
						...searchFilter,
						search: {
							...searchFilter.search,
						},
					})}`,
					`/product?input=${JSON.stringify({
						...searchFilter,
						search: {
							...searchFilter.search,
						},
					})}`,
					{ scroll: false },
				)
				.then();
		}

		// Agar options bo'shab qolsa
		if (searchFilter?.search?.options?.length === 0) {
			delete searchFilter.search.options;

			router
				.push(
					`/product?input=${JSON.stringify({
						...searchFilter,
						search: {
							...searchFilter.search,
						},
					})}`,
					`/product?input=${JSON.stringify({
						...searchFilter,
						search: {
							...searchFilter.search,
						},
					})}`,
					{ scroll: false },
				)
				.then();
		}

		// Agar materialList bo'shab qolsa
		if (searchFilter?.search?.materialList?.length === 0) {
			delete searchFilter.search.materialList;

			router
				.push(
					`/product?input=${JSON.stringify({
						...searchFilter,
						search: {
							...searchFilter.search,
						},
					})}`,
					`/product?input=${JSON.stringify({
						...searchFilter,
						search: {
							...searchFilter.search,
						},
					})}`,
					{ scroll: false },
				)
				.then();
		}

		// locationList mavjud bo'lsa hover holatini ochiq ushlaymiz
		if (searchFilter?.search?.locationList) {
			setShowMore(true);
		}
	}, [searchFilter, router]);

	/** HANDLERS **/

	// Location checkbox
	const productLocationSelectHandler = useCallback(
		async (e: React.ChangeEvent<HTMLInputElement>) => {
			try {
				const isChecked = e.target.checked;
				const value = e.target.value as ProductLocation;

				if (isChecked) {
					// qo'shish
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
					// olib tashlash
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
				const value = e.target.value;

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

	// Options checkbox (agar kelajakda ishlatsangiz)
	const productOptionSelectHandler = useCallback(
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
								options: [...(searchFilter?.search?.options || []), value],
							},
						})}`,
						`/product?input=${JSON.stringify({
							...searchFilter,
							search: {
								...searchFilter.search,
								options: [...(searchFilter?.search?.options || []), value],
							},
						})}`,
						{ scroll: false },
					);
				} else if (searchFilter?.search?.options?.includes(value)) {
					await router.push(
						`/product?input=${JSON.stringify({
							...searchFilter,
							search: {
								...searchFilter.search,
								options: searchFilter?.search?.options?.filter((item: string) => item !== value),
							},
						})}`,
						`/product?input=${JSON.stringify({
							...searchFilter,
							search: {
								...searchFilter.search,
								options: searchFilter?.search?.options?.filter((item: string) => item !== value),
							},
						})}`,
						{ scroll: false },
					);
				}
			} catch (err: any) {
				console.log('ERROR, productOptionSelectHandler:', err);
			}
		},
		[router, searchFilter],
	);

	// Material checkbox
	const productMaterialSelectHandler = useCallback(
		async (e: React.ChangeEvent<HTMLInputElement>) => {
			try {
				const isChecked = e.target.checked;
				const value = e.target.value; // masalan "GOLD", "DIAMOND", ...

				if (isChecked) {
					// qo'shish
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
					// olib tashlash
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

	// Narx oralig'i
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

	// Reset hammasini boshlang'ich holatga
	const refreshHandler = async () => {
		try {
			setSearchText('');
			await router.push(
				`/product?input=${JSON.stringify(initialInput)}`,
				`/product?input=${JSON.stringify(initialInput)}`,
				{ scroll: false },
			);
		} catch (err: any) {
			console.log('ERROR, refreshHandler:', err);
		}
	};

	/** RESPONSIVE **/
	if (device === 'mobile') {
		return <div>PRODUCTS FILTER</div>;
	}

	/** DESKTOP **/
	return (
		<Stack className="filter-main">
			{/* SEARCH */}
			<Stack className="find-your-home" mb="40px">
				<Typography className="title-main">Find Your Home</Typography>

				<Stack className="input-box">
					<OutlinedInput
						value={searchText}
						type="text"
						className="search-input"
						placeholder="What are you looking for?"
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
			<Stack className="find-your-home" mb="30px">
				<p className="title" style={{ textShadow: '0px 3px 4px #b9b9b9' }}>
					Location
				</p>

				<Stack
					className="product-location"
					style={{ height: showMore ? '253px' : '115px' }}
					onMouseEnter={() => setShowMore(true)}
					onMouseLeave={() => {
						if (!searchFilter?.search?.locationList) {
							setShowMore(false);
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
								checked={(searchFilter?.search?.locationList || []).includes(locVal)}
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
			<Stack className="find-your-home" mb="30px">
				<Typography className="title">Product Type</Typography>

				{productType.map((typeVal: string) => (
					<Stack className="input-box" key={typeVal}>
						<Checkbox
							id={typeVal}
							className="product-checkbox"
							color="default"
							size="small"
							value={typeVal}
							onChange={productTypeSelectHandler}
							checked={(searchFilter?.search?.typeList || []).includes(typeVal)}
						/>
						<label htmlFor={typeVal} style={{ cursor: 'pointer' }}>
							<Typography className="product_type">{typeVal}</Typography>
						</label>
					</Stack>
				))}
			</Stack>

			{/* MATERIAL */}
			<Stack className="find-your-home" mb="30px">
				<Typography className="title">Material</Typography>

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

			{/* PRICE RANGE */}
			<Stack className="find-your-home">
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
