import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import './ResultsPage.css';
import { SearchContext } from '../SearchContext';

export default function ResultsPage() {
  const [results, setResults] = useState([]);
  const { searchQuery } = useContext(SearchContext);

  useEffect(() => {
    (async () => {
      try {
        const token = localStorage.getItem('studentToken');
        if (!token) throw new Error('Token manquant');
        const { data } = await axios.get('http://localhost:5000/api/results', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setResults(data);
      } catch (err) {
        console.error('Erreur récupération résultats :', err);
        Swal.fire('Erreur', err.message || 'Impossible de charger les résultats.', 'error');
      }
    })();
  }, []);

  const getMention = pct =>
    pct >= 90 ? 'Excellent 🎉' :
    pct >= 70 ? 'Très bien 👍' :
    pct >= 50 ? 'Bien 👏' :
    'Peut mieux faire 😅';

  function shuffleArray(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  const handleShowDetails = result => {
    if (!Array.isArray(result.questions) || result.questions.length === 0) {
      return Swal.fire('Erreur', 'Aucune question associée à ce résultat.', 'error');
    }

    let idx = 0;
    const slides = result.questions;
// Préparation de la date sans secondes
     const d = new Date(result.date);
      const formattedDate = d.toLocaleDateString() + ' ' +
       d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const buildSlide = i => {
      const q = slides[i];
      const opts = Array.isArray(q.options) ? q.options : [];
      const shuffled = shuffleArray(opts);

      return `
        <div class="carousel-question">
          <h3>Question ${i + 1}</h3>
          <p class="question-text">${q.questionText}</p>
          <ul class="carousel-options">
            ${shuffled.map(o => {
              const isCorrect = o === q.correctAnswer;
              const isSelected = o === q.clickedAnswer;
              const classNames = [
                isCorrect ? 'correct' : 'wrong',
                isSelected ? 'selected' : ''
              ].join(' ');
              return `<li class="${classNames}">${o}</li>`;
            }).join('')}
          </ul>
        </div>
      `;
    };

    const showSlide = () => {
      Swal.fire({
        
        html: `
          ${buildSlide(idx)}
          <hr/>
          <p><strong>Score :</strong> ${result.correctAnswers}/${result.totalQuestions}</p>
          <p><strong>Mention :</strong> ${getMention((result.correctAnswers / result.totalQuestions) * 100)}</p>
         <p><strong>Date :</strong> ${formattedDate}</p>
          <p><strong>Temps restant :</strong> ${Math.floor(result.remainingTime / 60)}:${String(result.remainingTime % 60).padStart(2, '0')}</p>
        `,
        width: '700px',
        showCancelButton: true,
        showCloseButton: true,
        reverseButtons: true,
        closeButtonAriaLabel: 'Fermer',
        confirmButtonText: 'Suivant →',
        cancelButtonText: '← Précédent',
        allowOutsideClick: false,
        customClass: {
          popup: 'swal-wide',
          confirmButton: 'swal-btn', // classe partagée
    cancelButton: 'swal-btn'  
        },
        didOpen: () => {
          // Affichage/masquage des flèches
          Swal.getConfirmButton().style.visibility = idx === slides.length - 1 ? 'hidden' : 'visible';
          Swal.getCancelButton().style.visibility  = idx === 0 ? 'hidden' : 'visible';
        }
      }).then(nav => {
        if (nav.isConfirmed && idx < slides.length - 1) {
          idx++;
          showSlide();
        }
        if (nav.dismiss === Swal.DismissReason.cancel && idx > 0) {
          idx--;
          showSlide();
        }
      });
    };

    showSlide();
  };

  const filteredResults = results.filter(r => {
    const text = `${new Date(r.date).toLocaleDateString()} ${r.correctAnswers}/${r.totalQuestions}`;
    return text.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="results-page">
      <h2>Mes Résultats</h2>
      {filteredResults.length === 0 ? (
        <p>Aucun résultat pour le moment.</p>
      ) : (
        <ul className="results-list">
          {filteredResults.map(r => (
            <li key={r._id} onClick={() => handleShowDetails(r)}>
              📅 {new Date(r.date).toLocaleDateString()} — 🕒 {new Date(r.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} — Score : {r.correctAnswers}/{r.totalQuestions}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
