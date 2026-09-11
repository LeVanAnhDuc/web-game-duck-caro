/**
 * Barrel của tầng hook (R-18).
 *
 * Chỉ gom bốn hook mà `views/` gọi tới. `pointerGesture.ts` KHÔNG có ở đây: nó là hàm
 * thuần dùng riêng cho `useBoardCanvas`, và đưa vào barrel là biến một chi tiết nội bộ
 * thành API công khai.
 *
 * `export * from` chứ không re-export default — cả tầng này dùng named export.
 */
export * from './useBoardCanvas';
export * from './useGame';
export * from './usePersistence';
export * from './useSettings';
