import AuthInput from "@/components/AuthInput";
import HelmetSetup from "@/components/HelmetSetup";
import { currentUserState } from "@/states/authState";
import { Common } from "@/styles/common";
import { axiosInstance, debounce } from "@/utils";
import styled from "@emotion/styled";
import axios from "axios";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import logoImage from "/logo/logo1.svg";

const Title = styled.h2`
	${Common.a11yHidden};
`;

const Backgroud = styled.section`
	width: 100vw;
	height: 100vh;
	padding: 100px auto;
	background-color: ${Common.colors.black};
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
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
	padding: ${Common.space.spacingLg};
	box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
	border-radius: 10px;
`;

const Fieldset = styled.fieldset`
	width: 380px;
	display: flex;
	flex-direction: column;
	gap: 5px;
	legend {
		text-align: center;
		margin: 28px auto;

		font-weight: ${Common.font.weight.bold};
		font-size: 32px;

		color: ${Common.colors.black};
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

const Ul = styled.ul`
	display: flex;
	a:visited {
		text-decoration: none;
		color: inherit;
	}
	margin-bottom: 100px;
	& > :first-of-type::after {
		content: "|";
		display: inline-block;
		margin: 0 40px;
	}
`;

function SignIn() {
	const navigate = useNavigate();

	const setCurrentUser = useSetRecoilState(currentUserState);

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();

		try {
			const response = await axiosInstance.post<UserResponse>("/users/login", {
				email,
				password,
			});

			if (response.data.ok && response.data.item.token) {
				const userInfo = response.data.item;

				localStorage.setItem("accessToken", userInfo.token.accessToken);
				localStorage.setItem("refreshToken", userInfo.token.refreshToken);

				toast.success("로그인 성공!", {
					ariaProps: {
						role: "status",
						"aria-live": "polite",
					},
				});

				setCurrentUser({
					_id: userInfo._id,
					name: userInfo.name,
					profileImage: userInfo.extra?.profileImage
						? userInfo.extra?.profileImage
						: null,
				});

				navigate("/");
			}
		} catch (error: any) {
			if (axios.isAxiosError(error) && error.response) {
				const errorMessage = error.response.data.message;

				if (
					error.response.data.errors &&
					error.response.data.errors.length > 0
				) {
					const detailedMessages = error.response.data.errors
						.map((err: any) => `${err.msg} (${err.path})`)
						.join("\n");
					toast.error(`${detailedMessages}`);
				} else {
					toast.error(errorMessage);
				}
			} else {
				console.error("예상치 못한 오류가 발생했습니다.:", error);
				toast.error("알 수 없는 오류가 발생했습니다.");
			}
		}
	}

	return (
		<Backgroud>
			<HelmetSetup title="Sign In" description="로그인" url="signin" />
			<Logo>
				<Link to="/">
					<img src={logoImage} alt="모두의 오디오! 모디의 로고 이미지 입니다." />
				</Link>
			</Logo>
			<Title>로그인</Title>
			<Form onSubmit={handleLogin}>
				<Fieldset>
					<legend>로그인</legend>
					<AuthInput
						id="email"
						name="email"
						label="이메일"
						type="text"
						defaultValue={email}
						onChange={debounce(
							(e: { target: { value: React.SetStateAction<string> } }) =>
								setEmail(e.target.value),
						)}
						placeholder="이메일"
						required={true}
					/>
					<AuthInput
						id="password"
						name="password"
						label="비밀번호"
						type="password"
						defaultValue={password}
						onChange={debounce(
							(e: { target: { value: React.SetStateAction<string> } }) =>
								setPassword(e.target.value),
						)}
						placeholder="비밀번호"
						required={true}
					/>
				</Fieldset>

				<Submit type="submit">로그인</Submit>
				<Ul>
					<li>
						<Link to="/signup">회원가입</Link>
					</li>
					<li>
						<Link to="/">아이디/비밀번호 찾기</Link>
					</li>
				</Ul>
			</Form>
		</Backgroud>
	);
}

export default SignIn;
