import { uploadFile } from "@/utils";
import { describe, expect, it, vi } from "vitest";

describe("uploadFile", () => {
	it("성공적으로 파일을 업로드하고 결과를 반환한다", async () => {
		// 파일 업로드 함수 호출
		const mockFile = new File([], "test", {
			type: "text/plain",
			lastModified: +new Date(),
		});
		const mockSetItemCallback = vi.fn();
		const itemType = "testType";
		const result = await uploadFile(mockFile, mockSetItemCallback, itemType);

		// 예상 결과와 실제 결과 비교
		expect(result).toEqual("/mockPath");
	});
});
