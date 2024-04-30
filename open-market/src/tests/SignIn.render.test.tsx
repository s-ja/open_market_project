import SignIn from "@/pages/user/SignIn";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { HelmetProvider } from "react-helmet-async";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mockedNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
	const actual = (await vi.importActual("react-router-dom")) as object;
	return {
		...actual,
		Link: ({ children }: { children: React.ReactNode }) => <>{children}</>,
		useNavigate: () => mockedNavigate,
	};
});

describe("로그인 페이지 입력 창 렌더링 테스트", async () => {
	const mockedPost = vi.fn();

	beforeEach(() => {
		vi.mock("@/utils/axiosInstance", () => ({
			post: mockedPost.mockResolvedValue({
				data: {
					ok: 1,
					item: {
						token: { accessToken: "access123", refreshToken: "refresh123" },
					},
				},
			}),
		}));
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	it("로그인 페이지 렌더링 테스트", () => {
		render(
			<HelmetProvider>
				<SignIn />
			</HelmetProvider>,
		);

		const emailInput = screen.getByLabelText("이메일");
		const passwordInput = screen.getByLabelText("비밀번호");
		const loginButton = screen.getByRole("button", { name: "로그인" });

		// expect(screen.getByText("이메일")).toBeInTheDocument();
		expect(emailInput).toBeInTheDocument();
		expect(passwordInput).toBeInTheDocument();
		expect(loginButton).toBeInTheDocument();
	});

	it("로그인 페이지 값 입력 테스트", async () => {
		render(
			<HelmetProvider>
				<SignIn />
			</HelmetProvider>,
		);
		const emailInput = screen.getByLabelText("이메일");
		const passwordInput = screen.getByLabelText("비밀번호");

		await userEvent.type(emailInput, "u1@market.com");
		await userEvent.type(passwordInput, "11111111");

		expect(emailInput).toHaveValue("u1@market.com");
		expect(passwordInput).toHaveValue("11111111");
	});
});
