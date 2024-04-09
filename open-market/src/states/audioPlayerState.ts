import { atom } from "recoil";

export const currentAudioIdState = atom<number | null>({
	key: "currentAudioIdState",
	default: null,
});
