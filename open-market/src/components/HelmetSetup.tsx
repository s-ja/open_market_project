import { Helmet } from "react-helmet-async";

interface HelmetProps {
	title: string;
	description: string;
	// imageUrl: string;
	url: string;
}

const HelmetSetup: React.FC<HelmetProps> = ({ title, description, url }) => {
	return (
		<Helmet>
			<title>{title} - 모두의 오디오 MODI</title>
			<meta
				name="description"
				content={`소규모 음원 제작자들을 위한 오픈마켓 플랫폼 - ${description}`}
			/>
			<meta name="author" content="IP3" />

			{/* Open Graph / Facebook */}
			<meta property="og:type" content="website" />
			<meta property="og:site_name" content="모두의 오디오 MODI" />
			<meta property="og:url" content={`https://ip3-modi.netlify.app/${url}`} />
			<meta property="og:title" content={`${title} - 모두의 오디오 MODI`} />
			<meta
				property="og:description"
				content={`소규모 음원 제작자들을 위한 오픈마켓 플랫폼 - ${description}`}
			/>
			<meta
				property="og:image"
				content="https://modi-ip3-modi.koyeb.app/api/files/KrlpaHRt3.png"
			/>
			<meta property="og:image:alt" content="모두의 오디오! MODI" />

			{/* Twitter or X */}
			<meta property="twitter:card" content="summary_large_image" />
			<meta
				property="twitter:url"
				content={`https://ip3-modi.netlify.app/${url}`}
			/>
			<meta
				property="twitter:title"
				content={`${title} - 모두의 오디오 MODI`}
			/>
			<meta
				property="twitter:description"
				content={`소규모 음원 제작자들을 위한 오픈마켓 플랫폼 - ${description}`}
			/>
			<meta
				property="twitter:image"
				content="https://modi-ip3-modi.koyeb.app/api/files/KrlpaHRt3.png"
			/>
			<meta property="twitter:image:alt" content="모두의 오디오! MODI" />

			{/* Canonical URL */}
			<link rel="canonical" href="https://ip3-modi.netlify.app/" />
		</Helmet>
	);
};

export default HelmetSetup;
