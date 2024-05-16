import AuthInput from "@/components/AuthInput";
import HelmetSetup from "@/components/HelmetSetup";
import { useSignUpMutation } from "@/hooks/user/queries/useSignUpMutation";
import { Common } from "@/styles/common";
import { axiosInstance, debounce } from "@/utils";
import styled from "@emotion/styled";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import Checkbox from "@mui/material/Checkbox";
import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import logoImage from "/logo/logo1.svg";

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

const Wrapper = styled.div`
	min-height: fit-content;
`;

const Logo = styled.h1`
	a {
		text-decoration: none;
		color: inherit;
		display: flex;
		align-items: center;

		img {
			width: 440px;
		}
	}
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
		margin-top: 20px;
		color: ${Common.colors.black};
		& > :first-of-type,
		& > :last-of-type {
			flex-direction: row;
		}
		li {
			display: flex;
			justify-content: space-between;
			flex-direction: row-reverse;
			& > button {
				background-color: ${Common.colors.emphasize};
				border: none;
				border-radius: 5px;
				color: ${Common.colors.white};
				margin: 3px 2px;
			}
		}
	}
`;

const StyledCheckbox = styled(Checkbox)`
	margin: 0;
	padding: 0;
`;

const EmailField = styled.li`
	display: flex;
	flex-direction: column;
	gap: 5px;
	& > div {
		display: flex;
		gap: 10px;
		align-items: center;
		& > button {
			width: 70px;
			height: 56px;
			background-color: ${Common.colors.emphasize};
			border: none;
			border-radius: 10px;
			padding: 20px 5px;
			font-size: ${Common.font.size.sm};
			font-weight: ${Common.font.weight.regular};
			color: ${Common.colors.white};
		}
	}
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

function SignUp() {
	const navigate = useNavigate();

	const [form, setForm] = useState<SignUpForm>({
		email: "",
		password: "",
		confirmPassword: "",
		name: "",
		phone: "",
		extra: {
			terms: {
				termsOfUse: false,
				providingPersonalInformation: false,
				recievingMarketingInformation: false,
				confirmAge: false,
			},
		},
	});

	const { mutate: signUp, isPending, error } = useSignUpMutation();

	const [emailCheck, setEmailCheck] = useState({
		checked: false,
		valid: false,
		message: "",
	});

	const [agreeAll, setAgreeAll] = useState(false);
	const [termsOfUse, setTermsOfUse] = useState(false);
	const [providingPersonalInformation, setProvidingPersonalInformation] =
		useState(false);
	const [recievingMarketingInformation, setRecievingMarketingInformation] =
		useState(false);
	const [confirmAge, setConfirmAge] = useState(false);

	async function checkEmailDuplication() {
		try {
			const response = await axiosInstance.get(
				`/users/email?email=${form.email}`,
			);
			if (response.data.ok) {
				setEmailCheck({
					checked: true,
					valid: true,
					message: "사용 가능한 이메일입니다.",
				});
			}
		} catch (error) {
			if (axios.isAxiosError(error) && error.response) {
				setEmailCheck({
					checked: true,
					valid: false,
					message: error.response.data.message,
				});
			} else {
				console.error("이메일 중복 확인 중 오류가 발생했습니다.", error);
				setEmailCheck({
					checked: true,
					valid: false,
					message: "중복 확인 중 오류가 발생했습니다.",
				});
			}
		}
	}

	function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
		const { name, value } = event.target;

		if (name === "phone") {
			const numbersOnly = value.replace(/[^0-9]/g, "");
			setForm({ ...form, [name]: numbersOnly });
		} else {
			setForm({ ...form, [name]: value });
		}
	}

	function handleAgreeAllChange(e: React.ChangeEvent<HTMLInputElement>) {
		const isChecked = e.target.checked;
		setAgreeAll(isChecked);
		setTermsOfUse(isChecked);
		setProvidingPersonalInformation(isChecked);
		setRecievingMarketingInformation(isChecked);
		setConfirmAge(isChecked);

		setForm((prevForm) => ({
			...prevForm,
			extra: {
				terms: {
					termsOfUse: isChecked,
					providingPersonalInformation: isChecked,
					recievingMarketingInformation: isChecked,
					confirmAge: isChecked,
				},
			},
		}));
	}

	function handleCheckboxChange(event: React.ChangeEvent<HTMLInputElement>) {
		const { id, checked } = event.target;

		switch (id) {
			case "termsOfUse":
				setTermsOfUse(checked);
				setForm((prevForm) => ({
					...prevForm,
					extra: { ...prevForm.extra, termsOfUse: checked },
				}));
				break;
			case "providingPersonalInformation":
				setProvidingPersonalInformation(checked);
				setForm((prevForm) => ({
					...prevForm,
					extra: { ...prevForm.extra, providingPersonalInformation: checked },
				}));
				break;
			case "recievingMarketingInformation":
				setRecievingMarketingInformation(checked);
				setForm((prevForm) => ({
					...prevForm,
					extra: { ...prevForm.extra, recievingMarketingInformation: checked },
				}));
				break;
			case "confirmAge":
				setConfirmAge(checked);
				setForm((prevForm) => ({
					...prevForm,
					extra: { ...prevForm.extra, confirmAge: checked },
				}));
				break;
			default:
				break;
		}
	}

	function createUserObject() {
		const { email, password, name, phone, extra } = form;
		return {
			email,
			password,
			name,
			phone,
			type: "seller",
			extra,
		};
	}

	function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		if (form.password !== form.confirmPassword) {
			toast.error("비밀번호가 일치하지 않습니다.", {
				ariaProps: {
					role: "status",
					"aria-live": "polite",
				},
			});
			return;
		}
		const userObject = createUserObject();
		signUp(userObject);
	}

	useEffect(() => {
		const accessToken = localStorage.getItem("accessToken");
		if (accessToken) {
			toast.error("비정상적인 접근입니다.", {
				ariaProps: {
					role: "status",
					"aria-live": "polite",
				},
			});
			return navigate("/", { replace: true });
		}
	}, []);

	useEffect(() => {
		if (error) {
			toast.error("회원가입 오류: " + error.message);
		}
	}, [error]);

	useEffect(() => {
		const allChecked =
			termsOfUse &&
			providingPersonalInformation &&
			recievingMarketingInformation &&
			confirmAge;
		setAgreeAll(allChecked);
	}, [
		termsOfUse,
		providingPersonalInformation,
		recievingMarketingInformation,
		confirmAge,
	]);

	return (
		<Backgroud>
			<HelmetSetup title="Sign Up" description="회원가입" url="signup" />
			<Wrapper>
				<Logo>
					<Link to="/">
						<img
							src={logoImage}
							alt="모두의 오디오! 모디의 로고 이미지 입니다."
						/>
					</Link>
				</Logo>
				<Title>회원가입</Title>
				<Form onSubmit={handleSubmit}>
					<Fieldset>
						<legend>회원가입</legend>
						<ul>
							<EmailField>
								<div>
									<AuthInput
										id="email"
										name="email"
										label="이메일"
										type="text"
										defaultValue={form.email}
										onChange={debounce(handleInputChange)}
										placeholder="이메일"
										required={true}
									/>
									<button
										type="button"
										onClick={checkEmailDuplication}
										aria-label="입력 이메일 중복 확인"
									>
										중복 확인
									</button>
								</div>
								{emailCheck.checked && <p>{emailCheck.message}</p>}
							</EmailField>
							<li>
								<AuthInput
									id="password"
									name="password"
									label="비밀번호"
									type="password"
									defaultValue={form.password}
									onChange={debounce(handleInputChange)}
									placeholder="비밀번호"
									required={true}
								/>
							</li>
							<li>
								<AuthInput
									id="confirmPassword"
									name="confirmPassword"
									label="비밀번호 확인"
									type="password"
									defaultValue={form.confirmPassword}
									onChange={debounce(handleInputChange)}
									placeholder="비밀번호 확인"
									required={true}
								/>
							</li>
							<li>
								<AuthInput
									type="text"
									id="name"
									name="name"
									defaultValue={form.name}
									onChange={debounce(handleInputChange)}
									placeholder="이름"
									required={true}
								/>
							</li>
							<li>
								<AuthInput
									type="tel"
									id="phone"
									name="phone"
									defaultValue={form.phone}
									onChange={debounce(handleInputChange)}
									placeholder="휴대폰 번호"
									required={true}
								/>
							</li>
						</ul>
						<ul>
							<li>
								<div>
									<StyledCheckbox
										id="agreeAll"
										checked={agreeAll}
										onChange={handleAgreeAllChange}
										icon={<CheckCircleOutlineIcon />}
										checkedIcon={<CheckCircleIcon />}
										sx={{
											color: Common.colors.gray,
											"&.Mui-checked": {
												color: Common.colors.emphasize,
											},
										}}
									/>
									<label htmlFor="agreeAll">전체 동의합니다</label>
								</div>
							</li>
							<li>
								<button type="button" aria-label="이용 약관 전체 보기">
									약관보기
								</button>
								<div>
									<StyledCheckbox
										id="termsOfUse"
										checked={termsOfUse}
										onChange={handleCheckboxChange}
										required
										icon={<CheckCircleOutlineIcon />}
										checkedIcon={<CheckCircleIcon />}
										sx={{
											color: Common.colors.gray,
											"&.Mui-checked": {
												color: Common.colors.emphasize,
											},
										}}
									/>
									<label htmlFor="termsOfUse">이용약관 동의 (필수)</label>
								</div>
							</li>
							<li>
								<button
									type="button"
									aria-label="개인정보 수집 및 이용 약관 전체 보기"
								>
									약관보기
								</button>
								<div>
									<StyledCheckbox
										id="providingPersonalInformation"
										checked={providingPersonalInformation}
										onChange={handleCheckboxChange}
										required
										icon={<CheckCircleOutlineIcon />}
										checkedIcon={<CheckCircleIcon />}
										sx={{
											color: Common.colors.gray,
											"&.Mui-checked": {
												color: Common.colors.emphasize,
											},
										}}
									/>
									<label htmlFor="providingPersonalInformation">
										개인정보 수집 및 이용 동의 (필수)
									</label>
								</div>
							</li>
							<li>
								<button
									type="button"
									aria-label="마케팅 정보 수신 동의 약관 전체 보기"
								>
									약관보기
								</button>
								<div>
									<StyledCheckbox
										id="recievingMarketingInformation"
										checked={recievingMarketingInformation}
										onChange={handleCheckboxChange}
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
										마케팅 정보 수신 동의 (선택)
									</label>
								</div>
							</li>
							<li>
								<div>
									<StyledCheckbox
										id="confirmAge"
										checked={confirmAge}
										onChange={handleCheckboxChange}
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
						</ul>
					</Fieldset>
					<Submit type="submit" disabled={isPending}>
						{isPending ? "처리중..." : "회원가입"}
					</Submit>
				</Form>
			</Wrapper>
		</Backgroud>
	);
}

export default SignUp;
