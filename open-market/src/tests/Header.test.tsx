import Header from "@/layout/Header";
import { currentUserState } from "@/states/authState";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { HttpResponse, http } from "msw";
import { setupServer } from "msw/node";
import { FunctionComponent, ReactNode, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { BrowserRouter } from "react-router-dom";
import { RecoilRoot, useSetRecoilState } from "recoil";
import {
	afterAll,
	afterEach,
	beforeAll,
	describe,
	expect,
	it,
	vi,
} from "vitest";

vi.mock("react-hot-toast");
interface MockLoginStateProps {
	children: ReactNode;
	user: User | null;
}

// MSW를 이용한 API 모킹
const server = setupServer(
	http.get("/products", () => {
		return HttpResponse.json({
			_id: "1",
			name: "test",
		});
	}),
);

// QueryClient 설정: 테스트 중 재시도 비활성화 및 초기 데이터 설정
const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			retry: false,
			initialData: [],
		},
	},
});

// User를 CurrentUser로 변환
const toCurrentUser = (user: User | null): CurrentUser | null => {
	if (!user) return null;
	return {
		_id: user._id,
		name: user.name,
		profileImage: user.extra?.profileImage || null,
	};
};

// 컴포넌트 마운트 상태 확인을 위한 훅
const useIsMounted = () => {
	const isMounted = useRef(false);
	useEffect(() => {
		// console.log("컴포넌트 마운트");
		isMounted.current = true;
		return () => {
			// console.log("컴포넌트 언마운트");
			isMounted.current = false;
		};
	}, []);
	return isMounted;
};

// User 상태를 안전하게 업데이트하는 함수
const updateUserState = (
	user: User | null,
	setUser: (user: CurrentUser | null) => void,
	isMounted: React.MutableRefObject<boolean>,
) => {
	if (isMounted.current) {
		const currentUser = toCurrentUser(user);
		setUser(currentUser);
	} else {
		console.log("컴포넌트가 언마운트 된 후 상태 업데이트 시도");
	}
};

// 로그인 상태를 테스트하는 컴포넌트
const MockLoginState: FunctionComponent<MockLoginStateProps> = ({
	children,
	user,
}) => {
	const setUser = useSetRecoilState(currentUserState);
	const isMounted = useIsMounted();

	useEffect(() => {
		// console.log("Setting user", user);
		updateUserState(user, setUser, isMounted);
	}, [setUser, user, isMounted]);

	return <>{children}</>;
};

beforeAll(() => server.listen());
afterEach(() => {
	server.resetHandlers();
	queryClient.clear(); // QueryClient의 캐시 정리
});
afterAll(() => server.close());

describe("Header 컴포넌트", () => {
	it("로그인 상태에서 사용자 인터페이스를 테스트", async () => {
		// User 인터페이스에 따라 필요한 모든 속성을 포함하는 객체
		const user: User = {
			_id: 1,
			email: "test@example.com",
			password: "password123",
			name: "Test User",
			phone: "123-456-7890",
			type: "normal",
			createdAt: "2021-01-01T00:00:00.000Z",
			updatedAt: "2021-01-01T00:00:00.000Z",
			extra: {
				profileImage: "path/to/image.jpg",
				terms: {
					termsOfUse: true,
					providingPersonalInformation: true,
					recievingMarketingInformation: true,
					confirmAge: true,
				},
			},
			token: {
				accessToken: "access-token",
				refreshToken: "refresh-token",
			},
		};

		render(
			<QueryClientProvider client={queryClient}>
				<RecoilRoot>
					<BrowserRouter>
						<MockLoginState user={user}>
							<Header />
						</MockLoginState>
					</BrowserRouter>
				</RecoilRoot>
			</QueryClientProvider>,
		);

		// 로그아웃, 마이페이지 버튼 확인
		await waitFor(() => {
			expect(screen.getByTestId("logout-button")).toBeInTheDocument();
			expect(screen.getByTestId("mypage-button")).toBeInTheDocument();
		});
	});

	it("로그아웃 상태에서 사용자 인터페이스를 테스트", async () => {
		render(
			<QueryClientProvider client={queryClient}>
				<RecoilRoot>
					<BrowserRouter>
						<MockLoginState user={null}>
							<Header />
						</MockLoginState>
					</BrowserRouter>
				</RecoilRoot>
			</QueryClientProvider>,
		);

		// 로그인/회원가입 버튼 확인
		await waitFor(() =>
			expect(screen.getByText("로그인 / 회원가입")).toBeInTheDocument(),
		);
	});

	it("로그아웃 기능을 테스트", async () => {
		// 사용자 정보를 초기화하고 로그인 상태로 설정
		const user: User = {
			_id: 1,
			email: "test@example.com",
			password: "password123",
			name: "Test User",
			phone: "123-456-7890",
			type: "normal",
			createdAt: "2021-01-01T00:00:00.000Z",
			updatedAt: "2021-01-01T00:00:00.000Z",
			extra: {
				profileImage: "path/to/image.jpg",
				terms: {
					termsOfUse: true,
					providingPersonalInformation: true,
					recievingMarketingInformation: true,
					confirmAge: true,
				},
			},
			token: {
				accessToken: "access-token",
				refreshToken: "refresh-token",
			},
		};

		render(
			<QueryClientProvider client={queryClient}>
				<RecoilRoot>
					<BrowserRouter>
						<MockLoginState user={user}>
							<Header />
						</MockLoginState>
					</BrowserRouter>
				</RecoilRoot>
			</QueryClientProvider>,
		);

		// 로그아웃 버튼 클릭 시뮬레이션
		const logoutButton = screen.getByTestId("logout-button");
		await userEvent.click(logoutButton);

		// 로컬 및 세션 스토리지에서 토큰이 제거되었는지 확인
		expect(localStorage.getItem("accessToken")).toBeNull();
		expect(localStorage.getItem("refreshToken")).toBeNull();
		expect(sessionStorage.length).toBe(0);

		// 리디렉션 및 알림 메시지가 표시되었는지 확인
		await waitFor(() => {
			expect(toast.success).toHaveBeenCalledWith(
				"로그아웃 되었습니다.",
				expect.anything(),
			);
			expect(window.location.pathname).toBe("/");
		});
	});
});
