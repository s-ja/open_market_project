import SignIn from "@/pages/user/SignIn";
import { axiosInstance } from "@/utils";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { HelmetProvider } from "react-helmet-async";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RecoilRoot } from "recoil";
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

// Mock axiosInstance at module level
vi.mock("@/utils", async (importOriginal) => {
	const actual = await importOriginal() as any;
	return {
		...actual,
		axiosInstance: {
			post: vi.fn(),
		},
	};
});

describe("로그인 페이지 입력 창 렌더링 테스트", () => {
	let queryClient: QueryClient;

	beforeEach(() => {
		queryClient = new QueryClient({
			defaultOptions: {
				queries: { retry: false },
				mutations: { retry: false },
			},
		});
		
		(axiosInstance.post as any).mockResolvedValue({
			data: {
				ok: 1,
				item: {
					token: { accessToken: "access123", refreshToken: "refresh123" },
				},
			},
		});
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	it("로그인 페이지 렌더링 테스트", () => {
		render(
			<QueryClientProvider client={queryClient}>
				<RecoilRoot>
					<HelmetProvider>
						<SignIn />
					</HelmetProvider>
				</RecoilRoot>
			</QueryClientProvider>,
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
			<QueryClientProvider client={queryClient}>
				<RecoilRoot>
					<HelmetProvider>
						<SignIn />
					</HelmetProvider>
				</RecoilRoot>
			</QueryClientProvider>,
		);
		const emailInput = screen.getByLabelText("이메일");
		const passwordInput = screen.getByLabelText("비밀번호");

		await userEvent.type(emailInput, "u1@market.com");
		await userEvent.type(passwordInput, "11111111");

		expect(emailInput).toHaveValue("u1@market.com");
		expect(passwordInput).toHaveValue("11111111");
	});
});
