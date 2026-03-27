import { useState, useEffect } from "react";
const WindowSize = () => {
    const [windowSize, setWindowSize] = useState<{ width: number; height: number }>({
        width: 0,
        height: 0,
    });

    useEffect(() => {
        // Fiz essa função para atualizar o estado conforme a tela 
        const handleResize = () => {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        };

        window.addEventListener("resize", handleResize);

        handleResize();

        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return windowSize;
};

export default WindowSize;
