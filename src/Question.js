export default function Question({ question, dispatch, selectedAnswer }) {
    // const { question, options, points, correctOption } = question;
    const hasAnswered = selectedAnswer !== null;

    return (
        <div>
            <h4>{question.question}</h4>

            <div className="options">
                {question.options.map((item, answerIndex) => (
                    <button
                        className={`btn btn-option ${
                            hasAnswered ? (question.correctOption === answerIndex ? "correct" : "wrong") : ""
                        } ${selectedAnswer === answerIndex ? "answer" : ""}`}
                        disabled={hasAnswered}
                        key={item}
                        onClick={() => dispatch({ type: "newAnswer", payload: answerIndex })}
                    >
                        {item}
                    </button>
                ))}
            </div>
        </div>
    );
}
