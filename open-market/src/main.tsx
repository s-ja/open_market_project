import App from "@/App";
import React from "react";
import ReactDOM from "react-dom/client";
import { Toaster } from "react-hot-toast";
import { BrowserRouter } from "react-router-dom";
import { RecoilRoot } from "recoil";

ReactDOM.createRoot(document.getElementById("root")!).render(
	<RecoilRoot>
		<React.Suspense>
			<BrowserRouter>
				<Toaster />
				<App />
			</BrowserRouter>
		</React.Suspense>
	</RecoilRoot>,
);
