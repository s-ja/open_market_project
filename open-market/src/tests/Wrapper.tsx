import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();
const TestWrapper = ({ children }: React.PropsWithChildren) => (
	<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

export default TestWrapper;
