import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { Button, Stack, Typography } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { ProductLocation, ProductType, ProductMaterial } from '../../enums/product.enum';
import { REACT_APP_API_URL } from '../../config';
import { ProductInput } from '../../types/product/product.input';
import axios from 'axios';
import { getJwtToken } from '../../auth';
import { sweetErrorHandling, sweetMixinErrorAlert, sweetMixinSuccessAlert } from '../../sweetAlert';
import { useMutation, useQuery, useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';
import { CREATE_PRODUCT, UPDATE_PRODUCT } from '../../../apollo/user/mutation';
import { GET_PRODUCT } from '../../../apollo/user/query';

type AddProductProps = {
	initialValues: ProductInput;
};

const AddProduct: React.FC<AddProductProps> = ({ initialValues }) => {
	const device = useDeviceDetect();
	const router = useRouter();
	const inputRef = useRef<HTMLInputElement | null>(null);

	const token = getJwtToken();
	const user = useReactiveVar(userVar);

	/** Form state */
	const [insertProductData, setInsertProductData] = useState<ProductInput>(initialValues);

	/** Enum ro‘yxatlari */
	const [productTypeList] = useState<ProductType[]>(Object.values(ProductType));
	const [productLocationList] = useState<ProductLocation[]>(Object.values(ProductLocation));
	const [productMaterialList] = useState<ProductMaterial[]>(Object.values(ProductMaterial));

	/** Apollo hooks */
	const [createProduct] = useMutation(CREATE_PRODUCT);
	const [updateProduct] = useMutation(UPDATE_PRODUCT);

	const {
		loading: getProductLoading,
		data: getProductData,
		error: getProductError,
		refetch: getProductRefetch,
	} = useQuery(GET_PRODUCT, {
		fetchPolicy: 'network-only',
		variables: { input: router.query.productId },
		skip: !router.query.productId,
	});

	/** GET_PRODUCT kelganda formani to‘ldirib qo‘yish */
	useEffect(() => {
		const p = getProductData?.getProduct;
		if (!p) return;

		setInsertProductData((prev) => ({
			...prev,
			productTitle: p.productTitle ?? '',
			productPrice: p.productPrice ?? 0,
			productType: p.productType ?? undefined,
			productLocation: p.productLocation ?? undefined,
			productAddress: p.productAddress ?? '',
			productDesc: p.productDesc ?? '',
			productImages: p.productImages ?? [],
			productMaterial: p.productMaterial ?? undefined,
		}));
	}, [getProductData]);

	/** Images upload (GraphQL Upload[]) */
	async function uploadImages() {
		try {
			const files = inputRef.current?.files;
			if (!files || files.length === 0) return;
			if (files.length > 5) throw new Error('Cannot upload more than 5 images!');

			const formData = new FormData();

			const operations = {
				query: `
          mutation ImagesUploader($files: [Upload!]!, $target: String!) {
            imagesUploader(files: $files, target: $target)
          }
        `,
				variables: {
					files: new Array(files.length).fill(null),
					target: 'product',
				},
			};
			formData.append('operations', JSON.stringify(operations));

			const map: Record<string, string[]> = {};
			for (let i = 0; i < files.length; i++) {
				map[`${i}`] = [`variables.files.${i}`];
			}
			formData.append('map', JSON.stringify(map));

			for (let i = 0; i < files.length; i++) {
				formData.append(`${i}`, files[i]);
			}

			const response = await axios.post(`${process.env.REACT_APP_API_GRAPHQL_URL}`, formData, {
				headers: {
					'Content-Type': 'multipart/form-data',
					'apollo-require-preflight': 'true',
					Authorization: `Bearer ${token}`,
				},
			});

			const responseImages: string[] = response.data?.data?.imagesUploader ?? [];

			setInsertProductData((prev) => ({
				...prev,
				productImages: responseImages,
			}));
		} catch (err: any) {
			console.log('err: ', err.message);
			await sweetMixinErrorAlert(err.message);
		}
	}

	/** Disable holati — backend talablariga mos */
	const doDisabledCheck = () => {
		return !(
			insertProductData.productTitle &&
			Number(insertProductData.productPrice) > 0 &&
			insertProductData.productType &&
			insertProductData.productLocation &&
			insertProductData.productAddress &&
			insertProductData.productMaterial &&
			insertProductData.productImages?.length > 0
		);
	};

	/** Create */
	const insertProductHandler = useCallback(async () => {
		try {
			await createProduct({
				variables: { input: insertProductData },
			});
			await sweetMixinSuccessAlert('This product has been created successfully.');
			await router.push({
				pathname: '/mypage',
				query: { category: 'myProducts' },
			});
		} catch (err: any) {
			sweetErrorHandling(err);
		}
	}, [insertProductData]);

	/** Update */
	const updateProductHandler = useCallback(async () => {
		try {
			// @ts-ignore
			insertProductData._id = getProductData?.getProduct?._id;
			await updateProduct({
				variables: { input: insertProductData },
			});
			await sweetMixinSuccessAlert('This product has been updated successfully.');
			await router.push({
				pathname: '/mypage',
				query: { category: 'myProducts' },
			});
		} catch (err: any) {
			sweetErrorHandling(err);
		}
	}, [insertProductData, getProductData]);

	// Seller bo'lmasa, orqaga qaytaramiz
	if (user?.memberType !== 'SELLER') {
		router.back();
	}

	if (device === 'mobile') {
		return <div>ADD NEW PRODUCT MOBILE PAGE</div>;
	}

	return (
		<div id="add-product-page">
			<Stack className="main-title-box">
				<Typography className="main-title">Add New Product</Typography>
				<Typography className="sub-title">We are glad to see you again!</Typography>
			</Stack>

			<div>
				<Stack className="config">
					<Stack className="description-box">
						{/* Title */}
						<Stack className="config-column">
							<Typography className="title">Title</Typography>
							<input
								type="text"
								className="description-input"
								placeholder="Title"
								value={insertProductData.productTitle ?? ''}
								onChange={({ target: { value } }) =>
									setInsertProductData((p) => ({
										...p,
										productTitle: value,
									}))
								}
							/>
						</Stack>

						{/* Price + Type */}
						<Stack className="config-row">
							<Stack className="price-year-after-price">
								<Typography className="title">Price</Typography>
								<input
									type="number"
									className="description-input"
									placeholder="Price"
									value={insertProductData.productPrice ?? 0}
									onChange={({ target: { value } }) =>
										setInsertProductData((p) => ({
											...p,
											productPrice: Number(value) || 0,
										}))
									}
								/>
							</Stack>

							<Stack className="price-year-after-price">
								<Typography className="title">Select Type</Typography>
								<select
									className="select-description"
									value={insertProductData.productType ?? ''}
									onChange={({ target: { value } }) =>
										setInsertProductData((p) => ({
											...p,
											productType: value as ProductType,
										}))
									}
								>
									<option value="" disabled>
										Select
									</option>
									{productTypeList.map((type) => (
										<option value={type} key={type}>
											{type}
										</option>
									))}
								</select>
								<div className="divider" />
								<img src="/img/icons/Vector.svg" className="arrow-down" />
							</Stack>
						</Stack>

						{/* Location + Address */}
						<Stack className="config-row">
							<Stack className="price-year-after-price">
								<Typography className="title">Select Location</Typography>
								<select
									className="select-description"
									value={insertProductData.productLocation ?? ''}
									onChange={({ target: { value } }) =>
										setInsertProductData((p) => ({
											...p,
											productLocation: value as ProductLocation,
										}))
									}
								>
									<option value="" disabled>
										Select
									</option>
									{productLocationList.map((loc) => (
										<option value={loc} key={loc}>
											{loc}
										</option>
									))}
								</select>
								<div className="divider" />
								<img src="/img/icons/Vector.svg" className="arrow-down" />
							</Stack>

							<Stack className="price-year-after-price">
								<Typography className="title">Address</Typography>
								<input
									type="text"
									className="description-input"
									placeholder="Address"
									value={insertProductData.productAddress ?? ''}
									onChange={({ target: { value } }) =>
										setInsertProductData((p) => ({
											...p,
											productAddress: value,
										}))
									}
								/>
							</Stack>
						</Stack>

						{/* Material */}
						<Stack className="config-row">
							<Stack className="price-year-after-price">
								<Typography className="title">Select Material</Typography>
								<select
									className="select-description"
									value={insertProductData.productMaterial ?? ''}
									onChange={({ target: { value } }) =>
										setInsertProductData((p) => ({
											...p,
											productMaterial: value as ProductMaterial,
										}))
									}
								>
									<option value="" disabled>
										Select
									</option>
									{productMaterialList.map((m) => (
										<option value={m} key={m}>
											{m}
										</option>
									))}
								</select>
								<div className="divider" />
								<img src="/img/icons/Vector.svg" className="arrow-down" />
							</Stack>

							<Stack className="price-year-after-price" />
						</Stack>

						{/* Description */}
						<Typography className="product-title">Product Description</Typography>
						<Stack className="config-column">
							<Typography className="title">Description</Typography>
							<textarea
								className="description-text"
								value={insertProductData.productDesc ?? ''}
								onChange={({ target: { value } }) =>
									setInsertProductData((p) => ({
										...p,
										productDesc: value,
									}))
								}
							/>
						</Stack>
					</Stack>

					{/* Upload images */}
					<Typography className="upload-title">Upload photos of your product</Typography>

					<Stack className="images-box">
						<Stack className="upload-box">
							<svg xmlns="http://www.w3.org/2000/svg" width="121" height="120" viewBox="0 0 121 120" fill="none">
								<g clipPath="url(#clip0_7037_5336)">
									<path
										d="M68.9453 52.0141H52.9703C52.4133 52.0681 51.8511 52.005 51.32 51.8289C50.7888 51.6528 50.3004 51.3675 49.886 50.9914C49.4716 50.6153 49.1405 50.1567 48.9139 49.645C48.6874 49.1333 48.5703 48.5799 48.5703 48.0203C48.5703 47.4607 48.6874 46.9073 48.9139 46.3956C49.1405 45.884 49.4716 45.4253 49.886 45.0492C50.3004 44.6731 50.7888 44.3878 51.32 44.2117C51.8511 44.0356 52.4133 43.9725 52.9703 44.0266H68.9828C69.5397 43.9725 70.1019 44.0356 70.633 44.2117C71.1642 44.3878 71.6527 44.6731 72.067 45.0492C72.4814 45.4253 72.8125 45.884 73.0391 46.3956C73.2657 46.9073 73.3827 47.4607 73.3827 48.0203C73.3827 48.5799 73.2657 49.1333 73.0391 49.645C72.8125 50.1567 72.4814 50.6153 72.067 50.9914C71.6527 51.3675 71.1642 51.6528 70.633 51.8289C70.1019 52.005 69.5397 52.0681 68.9828 52.0141H68.9453Z"
										fill="#DDDDDD"
									/>
								</g>
								<defs>
									<clipPath id="clip0_7037_5336">
										<rect width="120" height="120" fill="white" transform="translate(0.960938)" />
									</clipPath>
								</defs>
							</svg>

							<Stack className="text-box">
								<Typography className="drag-title">Drag and drop images here</Typography>
								<Typography className="format-title">Photos must be JPEG or PNG format and least 2048x768</Typography>
							</Stack>

							<Button className="browse-button" onClick={() => inputRef.current?.click()}>
								<Typography className="browse-button-text">Browse Files</Typography>
								<input
									ref={inputRef}
									type="file"
									hidden
									onChange={uploadImages}
									multiple
									accept="image/jpg, image/jpeg, image/png"
								/>
								<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
									<g clipPath="url(#clip0_7309_3249)">
										<path
											d="M15.5556 0H5.7778C5.53214 0 5.33334 0.198792 5.33334 0.444458C5.33334 0.690125 5.53214 0.888917 5.7778 0.888917H14.4827L0.130219 15.2413C-0.0434062 15.415 -0.0434062 15.6962 0.130219 15.8698C0.21701 15.9566 0.33076 16 0.444469 16C0.558177 16 0.671885 15.9566 0.758719 15.8698L15.1111 1.51737V10.2222C15.1111 10.4679 15.3099 10.6667 15.5556 10.6667C15.8013 10.6667 16.0001 10.4679 16.0001 10.2222V0.444458C16 0.198792 15.8012 0 15.5556 0Z"
											fill="#181A20"
										/>
									</g>
									<defs>
										<clipPath id="clip0_7309_3249">
											<rect width="16" height="16" fill="white" />
										</clipPath>
									</defs>
								</svg>
							</Button>
						</Stack>

						<Stack className="gallery-box">
							{insertProductData?.productImages?.map((image: string) => {
								const imagePath: string = `${REACT_APP_API_URL}/${image}`;
								return (
									<Stack className="image-box" key={image}>
										<img src={imagePath} alt="" />
									</Stack>
								);
							})}
						</Stack>
					</Stack>

					{/* Submit buttons */}
					<Stack className="buttons-row">
						{router.query.productId ? (
							<Button className="next-button" disabled={doDisabledCheck()} onClick={updateProductHandler}>
								<Typography className="next-button-text">Save</Typography>
							</Button>
						) : (
							<Button className="next-button" disabled={doDisabledCheck()} onClick={insertProductHandler}>
								<Typography className="next-button-text">Save</Typography>
							</Button>
						)}
					</Stack>
				</Stack>
			</div>
		</div>
	);
};

// @ts-ignore
AddProduct.defaultProps = {
	initialValues: {
		productTitle: '',
		productPrice: 0,
		productType: undefined,
		productLocation: undefined,
		productAddress: '',
		productMaterial: undefined,
		productDesc: '',
		productImages: [],
	},
};

export default AddProduct;
