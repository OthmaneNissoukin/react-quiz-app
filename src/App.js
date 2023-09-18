import { useReducer, useEffect } from "react";

import Header from "./Header";
import Main from "./Main";
import Loader from "./Loader";
import Error from "./Error";
import StartScreen from "./StartScreen";
import Question from "./Question";
import Progress from "./Progress";
import FinishScreen from "./FinishScreen";
import Timer from "./Timer";

const initialState = {
    questions: [],
    status: "loading",
    index: 0,
    selectedAnswer: null,
    score: 0,
    highscore: 0,
    secondsRemain: null,
};

const secondsPerQuestion = 30;

function reducer(state, action) {
    let highscore;
    switch (action.type) {
        case "recievedData":
            return {
                ...state,
                questions: action.payload,
                status: "ready",
            };
        case "dataFailed":
            return { ...state, status: "error" };
        case "start":
            const secondsRemain = state.questions.length * secondsPerQuestion;
            return { ...state, status: "active", secondsRemain: secondsRemain };
        case "newAnswer":
            const correctAnswer = state.questions.at(state.index).correctOption;
            const questionScore = state.questions.at(state.index).points;

            return {
                ...state,
                score: action.payload === correctAnswer ? state.score + questionScore : state.score,
                selectedAnswer: action.payload,
            };

        case "nextQuestion":
            return { ...state, selectedAnswer: null, index: state.index + 1 };
        case "finish":
            highscore = state.highscore;
            if (state.score > highscore) highscore = state.score;

            return { ...state, selectedAnswer: null, status: "finished", highscore: highscore };
        case "reset":
            return {
                ...state,
                index: 0,
                status: "ready",
                score: 0,
                secondsRemain: state.questions.length * secondsPerQuestion,
            };

        case "tick":
            highscore = state.highscore;
            if (state.score > highscore) highscore = state.score;

            return {
                ...state,
                secondsRemain: state.secondsRemain - 1,
                status: state.secondsRemain === 0 && state.status === "active" ? "finished" : state.status,
                highscore: state.secondsRemain === 0 ? highscore : state.highscore,
            };

        default:
            throw new Error("Unknown action!");
    }
}

export default function App() {
    const [{ questions, status, index, selectedAnswer, score, highscore, secondsRemain }, dispatch] = useReducer(
        reducer,
        initialState
    );

    const numQuestions = questions.length;

    const maxScore = questions.reduce((curr, next) => curr + next.points, 0);

    useEffect(() => {
        async function fetchQuestions() {
            try {
                const request = await fetch(
                    "https://my-json-server.typicode.com/othmanenissoukin/json-questions-server/questions"
                );
                const data = await request.json();

                dispatch({ type: "recievedData", payload: data });
            } catch (err) {
                dispatch({ type: "dataFailed" });
            }
        }
        fetchQuestions();
    }, []);

    return (
        <div className="app">
            <Header />
            <Main>
                {status === "loading" && <Loader />}
                {status === "error" && <Error />}
                {status === "ready" && <StartScreen numQuestions={numQuestions} dispatch={dispatch} />}
                {status === "active" && (
                    <>
                        <Progress
                            numQuestions={numQuestions}
                            index={index}
                            score={score}
                            maxScore={maxScore}
                            selectedAnswer={selectedAnswer}
                        />
                        <Question
                            question={questions[index]}
                            dispatch={dispatch}
                            index={index}
                            selectedAnswer={selectedAnswer}
                        />

                        <Timer secondsRemain={secondsRemain} dispatch={dispatch} />

                        {selectedAnswer !== null ? (
                            <ButtonNext dispatch={dispatch} numQuestions={numQuestions} index={index} />
                        ) : (
                            ""
                        )}
                    </>
                )}
                {status === "finished" && (
                    <FinishScreen score={score} maxScore={maxScore} dispatch={dispatch} highscore={highscore} />
                )}
            </Main>
        </div>
    );
}

function ButtonNext({ dispatch, index, numQuestions }) {
    const isLastQuestion = index + 1 >= numQuestions;
    return (
        <button className="btn btn-ui" onClick={() => dispatch({ type: isLastQuestion ? "finish" : "nextQuestion" })}>
            Next
        </button>
    );
}
