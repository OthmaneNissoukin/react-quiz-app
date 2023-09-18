export default function FinishScreen({ score, maxScore, dispatch, highscore }) {
    const result = Math.ceil((score / maxScore) * 100);
    return (
        <>
            <p className="result">
                You scored <strong>{score}</strong> out of {maxScore} ({result}%)
            </p>
            <p className="highscore">Highscore: {highscore}</p>
            <button className="btn btn-ui" onClick={() => dispatch({ type: "reset" })}>
                Restart
            </button>
        </>
    );
}
