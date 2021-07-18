import React from "react";

export default React.createContext({
    _canvas: null,
    setCanvas: (_canvas: HTMLCanvasElement) => {}
});