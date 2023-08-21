/** 親ウィンドウ → 子ウィンドウ */
export type P2CMessage = { type: 'saved' };

/** 子ウィンドウ → 親ウィンドウ */
export type C2PMessage = { type: 'close' };
