import { describe, it, expect } from "vitest";
import { render, fireEvent, screen } from "@testing-library/react";
import Counter from "./Counter";

describe("Counter Component", () => {
	it("증가 버튼을 클릭한 경우", async () => {
		render(<Counter />);
		const button = screen.getByRole("button", { name: "Increase" });
		const counterText = screen.getByRole("heading", { name: /counter/i });

		// 초기 카운터 값 검증
		expect(counterText).toHaveTextContent("Counter: 0");

		// 버튼 클릭
		fireEvent.click(button);

		// 클릭 후 카운터 값 검증
		expect(counterText).toHaveTextContent("Counter: 1");
	});
});
