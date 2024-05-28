import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";

// uploadFile 함수는 파일을 업로드하고 결과 경로를 문자열로 반환하는 것을 가정합니다. 이 함수는 @/utils 모듈에 정의되어 있다고 가정
vi.mock("@/utils", async () => ({
	uploadFile: vi.fn(() => Promise.resolve("/mockPath")), // uploadFile 함수 목킹
	debounce: (fn: Function) => fn,
}));
// uploadFile 함수를 vi.fn()으로 모킹하여, 이 함수가 호출될 때마다 프로미스를 반환하도록 설정. 이 프로미스는 성공 시 "/mockPath" 문자열을 결과로 해서 이행(resolve) 즉, uploadFile 함수를 호출하면, 실제 로직 대신 이 가짜 로직이 실행되어 항상 "/mockPath"를 반환
