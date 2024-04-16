import AuthInput from "@/components/AuthInput";
import HelmetSetup from "@/components/HelmetSetup";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { currentUserState } from "@/states/authState";
import { Common } from "@/styles/common";
import { axiosInstance } from "@/utils";
import styled from "@emotion/styled";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import Checkbox from "@mui/material/Checkbox";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";

const API_KEY = import.meta.env.VITE_API_SERVER;

const Title = styled.h2`
	${Common.a11yHidden};
`;

const Backgroud = styled.section`
	width: 100vw;
	height: auto;
	min-height: 100vh;
	padding: 100px;
	background-color: ${Common.colors.black};
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
`;

const Form = styled.form`
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	gap: 10px;
	background-color: ${Common.colors.white};

	width: 506px;
	min-height: fit-content;
	padding: ${Common.space.spacingLg};
	box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
	border-radius: 10px;
`;

const Fieldset = styled.fieldset`
	width: 380px;
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 5px;
	legend {
		text-align: center;
		margin: 28px auto;

		font-weight: ${Common.font.weight.bold};
		font-size: 32px;

		color: ${Common.colors.black};
	}
	& > ul:first-of-type {
		display: flex;
		flex-direction: column;
		gap: 5px;
		width: 380px;
	}
	& > ul:last-of-type {
		width: 100%;
		margin-top: 20px;
		color: ${Common.colors.black};
		li {
			margin-bottom: 10px;
			display: flex;
			justify-content: space-between;
			& > button {
				background-color: ${Common.colors.emphasize};
				color: ${Common.colors.white};
				border: none;
				border-radius: 5px;
				margin: 3px 2px;
			}
		}

		& > :first-of-type {
			flex-direction: row-reverse;
		}
	}
`;

const UserImageWrapper = styled.li`
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 5px;
	& > label {
		font-size: 16px;
		font-weight: ${Common.font.weight.bold};
		color: ${Common.colors.black};
	}
	& > div {
		width: 100%;
		display: flex;
		justify-content: space-between;

		input[placeholder="첨부파일"] {
			vertical-align: middle;
			background-color: ${Common.colors.gray2};
			border: 1px solid ${Common.colors.gray};
			color: ${Common.colors.gray};
			border-radius: 10px;
			width: 78%;
			padding: 0 10px;
		}

		label {
			display: flex;
			justify-content: center;
			align-items: center;
			padding: 0 10px;
			cursor: pointer;
			background-color: ${Common.colors.emphasize};
			color: ${Common.colors.white};
			font-size: ${Common.font.size.sm};
			border-radius: 10px;
		}

		input[type="file"] {
			position: absolute;
			width: 0;
			height: 0;
			padding: 0;
			overflow: hidden;
			border: 0;
		}
	}
`;

const UserImage = styled.img`
	width: 100px;
	height: 100px;
	border-radius: 50%;
`;

const StyledCheckbox = styled(Checkbox)`
	margin: 0;
	padding: 0;
`;

const Submit = styled.button`
	width: 383px;
	height: 55px;

	background: ${Common.colors.emphasize};
	border-radius: 10px;
	border: none;

	font-weight: ${Common.font.weight.bold};
	font-size: ${Common.font.size.lg};
	color: ${Common.colors.white};

	padding: 15px 32px;
`;

const Cancle = styled(Link)`
	:visited {
		color: inherit;
	}
`;

function UserEdit() {
	const navigate = useNavigate();

	const [currentUser, setCurrentUser] = useRecoilState(currentUserState);

	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [confirmAge, setConfirmAge] = useState(false);
	const [userData, setUserData] = useState({
		email: "",
		name: "",
		password: "",
		confirmPassword: "",
		phone: "",
		extra: {
			profileImage: "",
			terms: {
				recievingMarketingInformation: false,
				confirmAge: confirmAge,
			},
		},
	});
	const [uploadedFileName, setUploadedFileName] = useState("");

	async function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
		const { id, value, type, checked } = event.target;
		if (type === "checkbox") {
			setUserData({
				...userData,
				extra: {
					...userData.extra,
					terms: {
						...userData.extra.terms,
						[id]: checked,
					},
				},
			});
		} else {
			setUserData({
				...userData,
				[id]: value,
			});
		}
	}

	async function handleImageUpload(event: React.ChangeEvent<HTMLInputElement>) {
		if (event.target.files && event.target.files.length > 0) {
			const file = event.target.files[0];
			setUploadedFileName(file.name);
			const formData = new FormData();
			formData.append("attach", file);

			try {
				const response = await axiosInstance.post("/files", formData, {
					headers: {
						"Content-Type": "multipart/form-data",
					},
				});

				if (response.data.ok) {
					const filePath = `${API_KEY}${response.data.file.path}`;
					setUserData((prevUserData) => ({
						...prevUserData,
						extra: {
							...prevUserData.extra,
							profileImage: filePath,
						},
					}));
				}
			} catch (error) {
				console.error("Image upload failed:", error);
				toast.error("이미지 업로드에 실패했습니다.", {
					ariaProps: {
						role: "status",
						"aria-live": "polite",
					},
				});
			}
		}
	}

	async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();

		if (userData.password && userData.password.length < 8) {
			toast.error("비밀번호는 8자 이상이어야 합니다.", {
				ariaProps: {
					role: "status",
					"aria-live": "polite",
				},
			});
			return;
		}

		if (userData.password !== userData.confirmPassword) {
			toast.error("비밀번호가 일치하지 않습니다.", {
				ariaProps: {
					role: "status",
					"aria-live": "polite",
				},
			});
			return;
		}

		const payload = userData.password
			? userData
			: { ...userData, password: undefined, confirmPassword: undefined };

		try {
			const response = await axiosInstance.patch(
				`/users/${currentUser?._id}`,
				payload,
			);
			if (response.data.ok) {
				toast.success("회원 정보가 수정되었습니다.", {
					ariaProps: {
						role: "status",
						"aria-live": "polite",
					},
				});
				setCurrentUser({
					...currentUser!,
					profileImage: userData.extra.profileImage,
				});
				navigate("/mypage");
			}
		} catch (error) {
			console.error("Error updating user info:", error);
			toast.error("회원 정보 수정에 실패했습니다.", {
				ariaProps: {
					role: "status",
					"aria-live": "polite",
				},
			});
		}
	}

	useEffect(() => {
		async function fetchUserInfo() {
			try {
				const response = await axiosInstance.get(`/users/${currentUser?._id}`);
				if (response.data.ok) {
					const fetchedData = {
						...userData,
						...response.data.item,
						extra: {
							...userData.extra,
							...response.data.item.extra,
							terms: {
								...userData.extra.terms,
								...response.data.item.extra?.terms,
							},
						},
						password: "",
						confirmPassword: "",
					};
					setConfirmAge(response.data.item.extra.terms.confirmAge);
					setUserData(fetchedData);
					setIsLoading(false);
				}
			} catch (error) {
				console.error("Error fetching user info:", error);
				toast.error("회원 정보를 불러오는데 실패했습니다.", {
					ariaProps: {
						role: "status",
						"aria-live": "polite",
					},
				});
			}
		}

		fetchUserInfo();
	}, [currentUser]);

	useRequireAuth();

	if (isLoading) {
		return <LoadingSpinner width="100vw" height="100vh" />;
	}

	return (
		<Backgroud>
			<HelmetSetup
				title="Edit User"
				description="회원 정보 수정"
				url={`useredit/${currentUser!._id}`}
			/>
			<Title>회원정보 수정</Title>
			<Form onSubmit={handleSubmit}>
				<Fieldset>
					<legend>회원정보 수정</legend>

					<ul>
						{/* 프로필 이미지 수정 */}
						<UserImageWrapper>
							<UserImage
								src={userData.extra.profileImage || "/user.svg"}
								alt={`${userData.name} 프로필 이미지`}
							/>
							<label htmlFor="userProfileImage">프로필 이미지</label>
							<div>
								<input
									value={uploadedFileName || "첨부파일"}
									placeholder="첨부파일"
									readOnly={true}
								/>
								<label htmlFor="userProfileImage">파일찾기</label>
								<input
									type="file"
									accept="image/*"
									id="userProfileImage"
									onChange={handleImageUpload}
								/>
							</div>
						</UserImageWrapper>
						<li
							onClick={() =>
								toast("이름은 수정 불가능합니다.", { duration: 2000 })
							}
						>
							<AuthInput
								id="name"
								name="name"
								type="text"
								defaultValue={userData.name}
								onChange={handleInputChange}
								placeholder="이름을 입력하세요"
								required={true}
								readonly={true}
							/>
						</li>
						<li
							onClick={() =>
								toast("이메일은 수정 불가능합니다.", { duration: 2000 })
							}
						>
							<AuthInput
								id="email"
								name="email"
								type="email"
								defaultValue={userData.email}
								onChange={handleInputChange}
								placeholder="이메일 주소를 입력하세요"
								required={true}
								readonly={true}
							/>
						</li>
						<li>
							<AuthInput
								id="password"
								name="password"
								type="password"
								onChange={handleInputChange}
								placeholder="비밀번호를 입력하세요"
							/>
						</li>
						<li>
							<AuthInput
								id="confirmPassword"
								name="confirmPassword"
								type="password"
								onChange={handleInputChange}
								placeholder="비밀번호 확인"
							/>
						</li>
						<li>
							<AuthInput
								id="phone"
								name="phone"
								type="text"
								defaultValue={userData.phone}
								onChange={handleInputChange}
								placeholder="전화번호를 입력하세요"
							/>
						</li>
					</ul>
					<ul>
						<li>
							<button type="button">약관보기</button>
							<div>
								<StyledCheckbox
									id="recievingMarketingInformation"
									checked={!!userData.extra.terms.recievingMarketingInformation}
									onChange={handleInputChange}
									icon={<CheckCircleOutlineIcon />}
									checkedIcon={<CheckCircleIcon />}
									sx={{
										color: Common.colors.gray,
										"&.Mui-checked": {
											color: Common.colors.emphasize,
										},
									}}
								/>
								<label htmlFor="recievingMarketingInformation">
									마케팅 정보 수신 동의
								</label>
							</div>
						</li>
						{confirmAge ? (
							<></>
						) : (
							<li>
								<div>
									<StyledCheckbox
										id="confirmAge"
										checked={!!userData.extra.terms.confirmAge}
										onChange={handleInputChange}
										icon={<CheckCircleOutlineIcon />}
										checkedIcon={<CheckCircleIcon />}
										sx={{
											color: Common.colors.gray,
											"&.Mui-checked": {
												color: Common.colors.emphasize,
											},
										}}
									/>
									<label htmlFor="confirmAge">본인은 만 14세 이상입니다.</label>
								</div>
							</li>
						)}
					</ul>
				</Fieldset>
				<Submit type="submit">수정하기</Submit>
				<Cancle to="/mypage">수정취소</Cancle>
			</Form>
		</Backgroud>
	);
}

export default UserEdit;
