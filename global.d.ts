import { MatchImageSnapshotOptions } from "jest-image-snapshot";

declare global {
  namespace jest {
    interface Matchers<R, T> {
      toMatchImageSnapshot(options?: MatchImageSnapshotOptions): R;
    }
  }
}