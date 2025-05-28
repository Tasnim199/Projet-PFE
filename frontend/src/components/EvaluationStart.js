// src/components/EvaluationStart.jsx
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import confetti from 'canvas-confetti';
import './EvaluationStart.css';

// Fisher–Yates shuffle
function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export default function EvaluationStart() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const [questions, setQuestions] = useState(state?.questions || []);
  const [timeLeft, setTimeLeft] = useState(180);
  const [initialTime] = useState(180);
  const [answered, setAnswered] = useState([]);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [resultStored, setResultStored] = useState(false);
  const [shuffledOptions, setShuffledOptions] = useState([]);
  const [showWrongPopup, setShowWrongPopup] = useState(false);

  useEffect(() => {
    if (questions.length) {
      const q = questions[currentQuestionIndex];
      setShuffledOptions(shuffleArray([q.correctAnswer, ...q.incorrectAnswers]));
    }
  }, [questions, currentQuestionIndex]);

  useEffect(() => {
    if (isFinished || timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
    return () => clearInterval(timer);
  }, [isFinished, timeLeft]);

  useEffect(() => {
    if (timeLeft <= 0 && !isFinished) setIsFinished(true);
  }, [timeLeft, isFinished]);

  useEffect(() => {
    if (!isFinished) return;
    const used = initialTime - timeLeft;
    const m = Math.floor(used / 60), s = used % 60;
    const pct = (correctAnswers / questions.length) * 100;
    const msg = pct >= 90 ? 'Excellent 🎉' : pct >= 70 ? 'Bravo 👏' : pct >= 50 ? 'Très bien 👍' : 'Tu peux faire mieux 😊';

    Swal.fire({
      title: 'Évaluation Terminée',
      html: `
        <div class="result-alert">
          <p>Score : <strong>${correctAnswers}/${questions.length}</strong></p>
          <p>Temps utilisé : <strong>${m}m${String(s).padStart(2,'0')}s</strong></p>
          <p class="result-message">${msg}</p>
        </div>
      `,
      icon: 'success',
      confirmButtonText: 'OK'
    });
  }, [isFinished, correctAnswers, questions.length, timeLeft, initialTime]);

  const handleAnswer = (idx, ans) => {
    if (answered.includes(idx)) return;
    setAnswered(prev => [...prev, idx]);
    setQuestions(prev => prev.map((q, i) => i === idx ? { ...q, selectedAnswer: ans } : q));
    const isCorr = questions[idx].correctAnswer === ans;
    if (isCorr) {
      setCorrectAnswers(c => c + 1);
      confetti();
      Swal.fire({ title: 'Bonne réponse !', icon: 'success', confirmButtonText: 'OK' });
      setTimeout(() => idx < questions.length - 1 ? setCurrentQuestionIndex(idx + 1) : setIsFinished(true), 800);
    } else {
      setShowWrongPopup(true);
      setTimeout(() => setShowWrongPopup(false), 2800);
      setTimeout(() => idx < questions.length - 1 ? setCurrentQuestionIndex(idx + 1) : setIsFinished(true), 3000);
    }
  };
const handleFinish = () => {
    if (!isFinished && timeLeft > 0) {
      Swal.fire({
        title: 'Voulez-vous vraiment terminer ?',
        html: '<img src="/confused.gif" style="width:80px;margin-top:10px"/>',
        showCancelButton: true,
        confirmButtonText: 'Oui',
        cancelButtonText: 'Non'
      }).then(res => res.isConfirmed && setIsFinished(true));
    }
  };
  const handleStoreResult = async () => {
    const res = await Swal.fire({
      title: 'Stocker résultat ?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Oui',
      cancelButtonText: 'Non'
    });
    if (!res.isConfirmed) return;
    const token = localStorage.getItem('studentToken');
    if (!token) return Swal.fire('Erreur', 'Token manquant ou expiré.', 'error');
    try {
      const payload = {
        correctAnswers,
        totalQuestions: questions.length,
        remainingTime: timeLeft,
        questions: questions.map(q => ({
          questionText: q.questionText,
          options: [q.correctAnswer, ...q.incorrectAnswers],
          correctAnswer: q.correctAnswer,
          clickedAnswer: q.selectedAnswer || ''
        }))
      };
      await axios.post('http://localhost:5000/api/results', payload, { headers: { Authorization: `Bearer ${token}` } });
      setResultStored(true);
      Swal.fire('Succès', 'Résultat enregistré !', 'success');
    } catch (error) {
      console.error('StoreResult error:', error.response || error);
      Swal.fire('Erreur', error.response?.data?.msg || error.message, 'error');
    }
  };

  const handleReviewAnswers = () => {
    let i = 0;
    const slides = questions;

    const buildSlide = idx => {
      const q = slides[idx];
      const opts = shuffleArray([q.correctAnswer, ...q.incorrectAnswers]);
      return `
        <div class="carousel-content">
          <h3>Question ${idx + 1}/${slides.length}</h3>
          <p class="single-line-question">${q.questionText}</p>
          <div class="answers-inputs">
            ${opts.map(o => {
              const isCorrect = o === q.correctAnswer;
              const isSelected = o === q.selectedAnswer;
              // Toutes les incorrectes en rouge, la correcte en vert
              const classes = [
                'answer-field',
                isCorrect ? 'correct-field' : 'incorrect-field',
                isSelected ? 'selected-field' : ''
              ].filter(Boolean).join(' ');
              return `<input type="text" readonly value="${o}" class="${classes}"/>`;
            }).join('')}
          </div>
        </div>
      `;
    };

    const showSlide = () => {
      Swal.fire({
        width: '700px',
        html: buildSlide(i),
        showCloseButton: true,
        showConfirmButton: false,
        footer: `
          <button id="prev-btn" class="swal2-arrow-btn">←</button>
          <button id="next-btn" class="swal2-arrow-btn">→</button>
        `,
        didOpen: () => {
          const prev = Swal.getFooter().querySelector('#prev-btn');
          const next = Swal.getFooter().querySelector('#next-btn');
          prev.style.visibility = i === 0 ? 'hidden' : 'visible';
          next.style.visibility = i === slides.length - 1 ? 'hidden' : 'visible';
          prev.addEventListener('click', () => { if (i > 0) { i--; showSlide(); }});
          next.addEventListener('click', () => { if (i < slides.length - 1) { i++; showSlide(); }});
        }
      });
    };
    showSlide();
  };

  if (!questions.length) {
    return (
      <div id="evaluation-start-wrapper">
        <p>Aucune question. <button onClick={() => navigate(-1)}>Retour</button></p>
      </div>
    );
  }

  const q = questions[currentQuestionIndex];

  return (
    <div id="evaluation-start-wrapper">
      <h2>Évaluation — {questions.length} questions</h2>
      <p className="timer">
        <img src="/hourglass.gif" alt="hourglass" className="hourglass-icon" />
        Temps restant : {Math.floor(timeLeft/60)}:{String(timeLeft%60).padStart(2,'0')}
      </p>
      {showWrongPopup && (
        <div className="wrong-popup">
          <img src="/nopefinger.gif" className="wrong-icon" alt="" />
          <p>Oops ! Mauvaise réponse</p>
        </div>
      )}
      {!isFinished ? (
        <div className="question-card">
          <p><strong>Q{currentQuestionIndex+1} :</strong> {q.questionText}</p>
          <ul className="answer-list">
            {shuffledOptions.map((o, j) => (
              <li key={j}>
                <button
                  disabled={answered.includes(currentQuestionIndex)}
                  onClick={() => handleAnswer(currentQuestionIndex, o)}
                >{o}</button>
              </li>
            ))}
          </ul>  
         <button className="action-button" onClick={handleFinish}>
            Terminer l’évaluation
          </button>
        </div>
      ) : (
        <div className="action-buttons-container">
          {!resultStored && (
            <button className="action-button" onClick={handleStoreResult}>
              Enregistrer mon résultat
            </button>
          )}
          <button className="action-button" onClick={() => navigate('/student-dashboard/evaluations')}>
            Passer une nouvelle évaluation
          </button>
          <button className="action-button" onClick={handleReviewAnswers}>
            Voir mes réponses
          </button>
        </div>
      )}
    </div>
  );
}
