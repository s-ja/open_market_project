import { ProductRegisterForm } from "@/apis/product/product";
import FormInput from "@/components/FormInput";
import FunctionalButton from "@/components/FunctionalButton";
import HelmetSetup from "@/components/HelmetSetup";
import LoadingSpinner from "@/components/LoadingSpinner";
import SelectGenre from "@/components/SelectGenre";
import Textarea from "@/components/Textarea";
import { usePostProductMutation } from "@/hooks/product/mutations/registration";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { currentUserState } from "@/states/authState";
import { codeState } from "@/states/categoryState";

import { Common } from "@/styles/common";
import { debounce } from "@/utils";
import { uploadFile } from "@/utils/uploadFile";
import styled from "@emotion/styled";
import CircleIcon from "@mui/icons-material/Circle";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import { Radio, RadioProps } from "@mui/material";
import { styled as muiStyled } from "@mui/system";

import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { FlexLayout, FormTopLayout, FormTopRightLayout } from "./ProductManage";

const ProductRegistSection = styled.section`
	background-color: ${Common.colors.white};
	padding-top: 100px;
	padding-bottom: 20px;

	.a11yHidden {
		display: ${Common.a11yHidden};
	}

	.PostFormWrapper {
		background-color: ${Common.colors.gray2};
		padding: 40px;
		width: 1328px;
		margin: 0 auto;
		border-radius: 10px;
		display: flex;
		flex-direction: column;
		gap: ${Common.space.spacingXl};
	}
`;

const PostImageWrapper = styled.div`
	width: 300px;
	height: 300px;
	background-color: ${Common.colors.white};
	border-radius: 10px;

	.ImageWrapper {
		position: relative;
	}
	.PostImage {
		position: absolute;
		z-index: 10;
		width: 100%;
		height: 300px;
		opacity: 0;
		cursor: pointer;
	}
	.PostImageLabel {
		display: flex;
		flex-direction: column;
		color: ${Common.colors.gray2};
		align-items: center;
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, 105%);
	}
	.UploadImage {
		width: 300px;
	}
`;

const PostAudioWrapper = styled.div`
	width: 211px;
	height: 116px;
	background-color: ${Common.colors.white};
	border-radius: 10px;

	.AudioWrapper {
		position: relative;
	}
	.PostAudio {
		position: absolute;
		z-index: 10;
		width: 100%;
		height: 116px;
		opacity: 0;
		cursor: pointer;
	}
	.PostAudioLabel {
		display: flex;
		color: ${Common.colors.black};
		align-items: center;
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, 250%);
	}

	.UploadAudioFile {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, 270%);
	}
`;

const ProductRadioButtonWrapper = styled.div`
	width: 590px;
	height: 290px;
	color: ${Common.colors.gray};
	border-radius: 10px;
	background-color: ${Common.colors.white};
	padding: ${Common.space.spacingMd};
`;

const RadioButtonGroup = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	position: relative;
	top: 50%;
	transform: translateY(-60%);
`;

const StyledRadio = muiStyled((props: RadioProps) => (
	<Radio
		{...props}
		icon={<RadioButtonUncheckedIcon style={{ color: "#D9D9D9" }} />}
		checkedIcon={<CircleIcon style={{ color: "#FFB258" }} />}
	/>
))``;

function ProductRegistration() {
	const navigate = useNavigate();

	const category = useRecoilValue(codeState);
	const currentUser = useRecoilValue(currentUserState);

	const [postItem, setPostItem] = useState<ProductRegisterForm>({
		show: true,
		active: true,
		name: "",
		mainImages: [{ path: "", name: "", originalname: "" }],
		content: "",
		price: 0,
		shippingFees: 0,
		quantity: Number.MAX_SAFE_INTEGER,
		buyQuantity: 0,
		extra: {
			sellerName: currentUser?.name!,
			isNew: true,
			isBest: false,
			category: "",
			tags: [],
			soundFile: { path: "", name: "", originalname: "" },
		},
	});
	const [audioLoading, setAudioLoading] = useState<boolean>(false);
	const [imageLoading, setImageLoading] = useState<boolean>(false);
	const { mutate: registerProduct } = usePostProductMutation();

	useRequireAuth();

	function handlePostProductRegist(e: { preventDefault: () => void }) {
		e.preventDefault();

		if (postItem.mainImages[0].name === "") {
			toast.error("앨범아트를 업로드해야 합니다.", {
				ariaProps: {
					role: "status",
					"aria-live": "polite",
				},
			});
			return;
		}

		if (postItem.extra.soundFile.path === "") {
			toast.error("음원을 업로드해야 합니다.", {
				ariaProps: {
					role: "status",
					"aria-live": "polite",
				},
			});
			return;
		}

		registerProduct(postItem);
	}

	function handleRegistCancel() {
		const result = confirm(
			"페이지를 나가시면 음원 정보가 모두 사라지게 됩니다. 정말로 등록을 취소하시겠습니까?",
		);
		if (result) {
			navigate(-1);
		}
	}

	return (
		<ProductRegistSection>
			<HelmetSetup
				title="Register Product"
				description="음원 등록"
				url="productregistration"
			/>
			<h2 className="a11yHidden">상품 등록</h2>
			<form encType="multipart/form-data" className="PostFormWrapper">
				<FormTopLayout>
					<PostImageWrapper>
						<div className="ImageWrapper">
							<input
								type="file"
								accept="*.jpg,*.png,*.jpeg,*.webp,*.avif,*.svg"
								onChange={(e: { target: { files: any } }) => {
									setImageLoading(true);
									uploadFile(e.target.files[0], setPostItem, "image")
										.then(() => {
											setImageLoading(false);
										})
										.catch((error) => {
											console.error(error);
											setImageLoading(false);
										});
								}}
								className="PostImage"
								name="photo"
								id="photo"
							/>
							{imageLoading ? (
								<LoadingSpinner width="300px" height="300px" upload />
							) : postItem?.mainImages[0].path !== "" ? (
								<img
									className="UploadImage"
									src={postItem?.mainImages[0].path}
									alt={`${postItem?.name}의 앨범 아트`}
								/>
							) : (
								<div className="PostImageLabel">
									<FileUploadIcon
										style={{ color: "#D9D9D9", fontSize: "80px" }}
									/>
									<label htmlFor="photo">커버 업로드</label>
								</div>
							)}
						</div>
					</PostImageWrapper>
					<FormTopRightLayout>
						<FormInput
							name="title"
							label="타이틀"
							handleFn={debounce((e: { target: { value: any } }) =>
								setPostItem({ ...postItem, name: e.target.value }),
							)}
						/>
						<FlexLayout>
							<SelectGenre
								id="genre"
								value="none"
								handleFn={(e) => {
									setPostItem({
										...postItem,
										extra: { ...postItem.extra, category: e.target.value },
									});
								}}
								category={category!}
							/>
							<FormInput
								name="hashTag"
								label="해시태그"
								placeholder="해시태그를 ','(콤마)로 구분해주세요"
								handleFn={debounce((e: React.ChangeEvent<HTMLInputElement>) => {
									const tagsArray = e.target.value
										.split(",")
										.map((tag) => tag.replaceAll(" ", ""));
									setPostItem({
										...postItem,
										extra: { ...postItem.extra, tags: tagsArray },
									});
								})}
							/>
						</FlexLayout>
						<FlexLayout>
							<Textarea
								placeholder="10글자 이상 입력해주세요."
								onChange={debounce((e: { target: { value: any } }) =>
									setPostItem({ ...postItem, content: e.target.value }),
								)}
							/>
							<PostAudioWrapper>
								<div className="AudioWrapper">
									<input
										type="file"
										accept="audio/*"
										name="mp3"
										className="PostAudio"
										id="mp3"
										onChange={(e: { target: { files: any } }) => {
											setAudioLoading(true);
											uploadFile(e.target.files[0], setPostItem, "soundFile")
												.then(() => {
													setAudioLoading(false);
												})
												.catch((error) => {
													console.error(error);
													setAudioLoading(false);
												});
										}}
									/>
									{audioLoading ? (
										<LoadingSpinner width="211px" height="116px" upload />
									) : postItem?.extra.soundFile.path !== "" ? (
										<span className="UploadAudioFile">
											{postItem?.extra.soundFile.name}
										</span>
									) : (
										<div className="PostAudioLabel">
											<FileUploadIcon
												style={{ color: "#FF3821", fontSize: "20px" }}
											/>
											<label htmlFor="mp3">음원 업로드</label>
										</div>
									)}
								</div>
							</PostAudioWrapper>
						</FlexLayout>
					</FormTopRightLayout>
				</FormTopLayout>
				<FlexLayout>
					<FormInput
						name="price"
						label="가격"
						type="number"
						placeholder="0 "
						handleFn={debounce((e: { target: { value: number } }) => {
							if (e.target.value < 0) {
								e.target.value = 0;
							}
							setPostItem({
								...postItem,
								price: +e.target.value,
							});
						})}
					/>
					<ProductRadioButtonWrapper>
						<span>공개여부</span>
						<RadioButtonGroup>
							<span>공개</span>
							<StyledRadio
								checked={postItem.show === true}
								onChange={() =>
									setPostItem((prevPostItem) => ({
										...prevPostItem,
										show: true,
									}))
								}
								value="true"
							/>
							<div>
								<span>비공개</span>
								<StyledRadio
									checked={postItem.show === false}
									onChange={() =>
										setPostItem((prevPostItem) => ({
											...prevPostItem,
											show: false,
										}))
									}
									value="false"
								/>
							</div>
						</RadioButtonGroup>
					</ProductRadioButtonWrapper>
				</FlexLayout>
				<FlexLayout right>
					<FunctionalButton
						secondary={true}
						handleFn={handleRegistCancel}
						text="취소"
					/>
					<FunctionalButton
						type="submit"
						handleFn={handlePostProductRegist}
						text="등록"
					/>
				</FlexLayout>
			</form>
		</ProductRegistSection>
	);
}

export default ProductRegistration;
