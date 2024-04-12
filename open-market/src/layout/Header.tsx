import {
	categoryValueState,
	fetchProductListState,
	productListState,
	searchKeywordState,
} from "@/states/productListState";
import { Common } from "@/styles/common";
import styled from "@emotion/styled";
import {
	AccountCircle,
	ExitToApp,
	FileUpload,
	Search,
} from "@mui/icons-material";
import {
	AppBar,
	Button,
	CircularProgress,
	IconButton,
	InputAdornment,
	Menu,
	MenuItem,
	TextField,
	Toolbar,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { KeyboardEvent, useEffect, useState } from "react";
import { currentUserState } from "@/states/authState";
import { axiosInstance } from "@/utils";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import logoImage from "/logo/logo2.svg";

const HeaderContainer = styled(AppBar)`
	background: rgba(40, 40, 44, 0.8);
	box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
	width: 100%;
	align-items: center;
	position: fixed;
	z-index: 100;
`;

const HeaderWrapper = styled(Toolbar)`
	width: 1440px;
	height: 80px;
	display: flex;
	justify-content: space-between;
	align-items: center;
	height: 100%;
	padding: 0 20px;
`;

const Logo = styled.h1`
	a {
		text-decoration: none;
		color: inherit;
		display: flex;
		align-items: center;

		img {
			height: 40px;
		}
	}
`;

const SearchBar = styled(TextField)`
	& .MuiOutlinedInput-root {
		width: 700px;
		border-radius: 100px;
		background-color: ${Common.colors.white};
		&.Mui-focused fieldset {
			border-color: ${Common.colors.emphasize};
		}
	}

	& .MuiInputLabel-root.Mui-focused {
		color: ${Common.colors.primary};
	}

	& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline {
		border-color: ${Common.colors.emphasize};
	}

	& .MuiIconButton-root {
		margin-right: -8px;
		padding: 2px;
		background-color: ${Common.colors.emphasize};
		color: ${Common.colors.white};
	}
`;

const ButtonWrapper = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 10px;
`;

const UploadButton = styled(Button)`
	color: ${Common.colors.white};
	background-color: transparent;
	border-radius: 10px;
	border: 1px solid ${Common.colors.emphasize};

	&:hover {
		background-color: ${Common.colors.black};
	}

	.MuiButton-startIcon {
		margin-right: ${Common.space.spacingMd};
		color: ${Common.colors.primary};
	}
`;

const UserButton = styled(Button)`
	color: ${Common.colors.white};
	&:hover {
		color: ${Common.colors.emphasize};
	}
`;

function Header() {
	const navigate = useNavigate();

	const [isLogoLoaded, setIsLogoLoaded] = useState(false);

	const [currentUser, setCurrentUser] = useRecoilState(currentUserState);
	const [productList, setProductList] = useRecoilState(productListState);

	const setSearchKeyword = useSetRecoilState<string>(searchKeywordState);
	const setCategoryValue = useSetRecoilState<string>(categoryValueState);

	const fetchedProductList = useRecoilValue(fetchProductListState(0));

	const { refetch } = useQuery({
		queryKey: ["productList", productList],
		queryFn: fetchProductList,
		refetchOnWindowFocus: false,
	});

	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const [notificationAnchorEl, setNotificationAnchorEl] =
		useState<null | HTMLElement>(null);

	const [searchInput, setSearchInput] = useState("");

	async function fetchProductList() {
		try {
			return await axiosInstance.get("/products");
		} catch (error) {
			console.error(error);
		}
	}

	function onLogoLoad() {
		setIsLogoLoaded(true);
	}

	function handleSearchInputChange(event: React.ChangeEvent<HTMLInputElement>) {
		setSearchInput(event.target.value);
	}

	function handleEnterKeyPress(e: KeyboardEvent<HTMLInputElement>) {
		const target = e.target as HTMLInputElement;
		if (e.key === "Enter" && !e.nativeEvent.isComposing) {
			e.preventDefault();
			setSearchKeyword(target.value);
			setSearchInput("");
			setCategoryValue("all");
		}
	}

	function handleSearchClick() {
		setSearchKeyword(searchInput);
		setSearchInput("");
	}

	function handleProfileMenuOpen(event: React.MouseEvent<HTMLElement>) {
		const currentTarget = event.currentTarget;
		if (currentTarget && document.body.contains(currentTarget)) {
			setAnchorEl(currentTarget);
		}
	}

	function handleMenuClose() {
		setAnchorEl(null);
		setNotificationAnchorEl(null);
	}

	function handleLogout() {
		setCurrentUser(null);
		localStorage.removeItem("accessToken");
		localStorage.removeItem("refreshToken");
		sessionStorage.clear();

		toast.success(`로그아웃 되었습니다.`, {
			ariaProps: {
				role: "status",
				"aria-live": "polite",
			},
		});
		navigate("/");
	}

	useEffect(() => {
		setProductList(fetchedProductList!);
	}, []);

	useEffect(() => {
		refetch();
	}, [productList]);

	return (
		<HeaderContainer position="static" color="default" elevation={1}>
			<HeaderWrapper>
				<Logo>
					<Link
						to="/"
						onClick={() => {
							setSearchKeyword("");
							setCategoryValue("all");
							localStorage.removeItem("userProductsInfo");
							localStorage.removeItem("searchOrderKeyword");
						}}
					>
						<img
							src={logoImage}
							alt="모디 로고"
							onLoad={onLogoLoad}
							style={{ display: isLogoLoaded ? "block" : "none" }}
						/>
						{!isLogoLoaded && <CircularProgress />}
					</Link>
				</Logo>
				<SearchBar
					size="small"
					variant="outlined"
					placeholder="검색어를 입력하세요"
					label="검색"
					value={searchInput}
					onChange={handleSearchInputChange}
					onKeyDown={(e) =>
						handleEnterKeyPress(e as KeyboardEvent<HTMLInputElement>)
					}
					InputProps={{
						endAdornment: (
							<InputAdornment position="end">
								<IconButton onClick={handleSearchClick}>
									<Search />
								</IconButton>
							</InputAdornment>
						),
					}}
					sx={{ m: 2 }}
				/>
				{currentUser && (
					<ButtonWrapper>
						<UploadButton
							startIcon={<FileUpload />}
							variant="outlined"
							color="inherit"
							onClick={() => navigate("/productregistration")}
						>
							업로드
						</UploadButton>

						<Menu
							anchorEl={notificationAnchorEl}
							open={Boolean(notificationAnchorEl)}
							onClose={handleMenuClose}
						>
							<MenuItem onClick={handleMenuClose}>알림1</MenuItem>
						</Menu>

						<UserButton color="inherit" onClick={handleProfileMenuOpen}>
							<AccountCircle />
						</UserButton>
						<Menu
							anchorEl={anchorEl}
							open={Boolean(anchorEl)}
							onClose={handleMenuClose}
						>
							<MenuItem
								component={Link}
								to="/mypage"
								onClick={() => {
									handleMenuClose();
									localStorage.removeItem("userProductsInfo");
									localStorage.removeItem("searchOrderKeyword");
								}}
							>
								마이페이지
							</MenuItem>
							<MenuItem onClick={handleLogout}>
								<ExitToApp />
								로그아웃
							</MenuItem>
						</Menu>
					</ButtonWrapper>
				)}
				{!currentUser && (
					<ButtonWrapper>
						<UserButton onClick={handleProfileMenuOpen}>
							<AccountCircle />
						</UserButton>
						<Menu
							anchorEl={anchorEl}
							open={Boolean(anchorEl)}
							onClose={handleMenuClose}
						>
							<MenuItem component={Link} to="/signin" onClick={handleMenuClose}>
								회원가입 / 로그인
							</MenuItem>
						</Menu>
					</ButtonWrapper>
				)}
			</HeaderWrapper>
		</HeaderContainer>
	);
}

export default Header;
