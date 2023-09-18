import { useEffect } from "react";

export default function Timer({ secondsRemain, dispatch }) {
    const minutes = Math.floor(secondsRemain / 60);
    const seconds = secondsRemain % 60;

    useEffect(() => {
        const counter = setInterval(() => {
            dispatch({ type: "tick" });
        }, 1000);

        return () => clearInterval(counter);
    }, []);
    return <div className="timer">{`${minutes < 10 ? "0" : ""}${minutes}:${seconds < 10 ? "0" : ""}${seconds}`}</div>;
}
