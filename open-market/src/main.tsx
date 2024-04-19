import App from "@/App";
import React from "react";
import ReactDOM from "react-dom/client";
import { Toaster } from "react-hot-toast";
import { BrowserRouter } from "react-router-dom";
import { RecoilRoot } from "recoil";
import LoadingSpinner from "./components/LoadingSpinner";

ReactDOM.createRoot(document.getElementById("root")!).render(
	<RecoilRoot>
		<React.Suspense fallback={<LoadingSpinner width="100vw" height="100vh" />}>
			<BrowserRouter>
				<Toaster />
				<App />
			</BrowserRouter>
		</React.Suspense>
	</RecoilRoot>,
);
