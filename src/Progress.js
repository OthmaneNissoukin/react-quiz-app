export default function Progress({ index, numQuestions, score, maxScore, selectedAnswer }) {
    return (
        <div className="progress">
            <progress max={numQuestions} value={index + Number(selectedAnswer !== null)}></progress>
            <p>
                Question <strong>{index + 1}</strong> / {numQuestions}
            </p>
            <p>
                Points {score} / {maxScore}
            </p>
        </div>
    );
}
