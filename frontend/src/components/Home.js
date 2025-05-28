import React, { useState , useEffect } from 'react';
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaSchool,
  FaUserShield,
  FaChalkboardTeacher,
  FaChild
} from 'react-icons/fa';
import { Link } from 'react-router-dom';
import './Home.css';


export default function Home() {

   useEffect(() => {
    // Si on n'a pas encore compté cette session…
    if (!sessionStorage.getItem('siteVisitsCounted')) {
      const cur = Number(localStorage.getItem('siteVisits') || 0) + 1;
     localStorage.setItem('siteVisits', cur);
      // On marque dans la session qu’on a déjà compté
      sessionStorage.setItem('siteVisitsCounted', 'true');
    }
  }, []);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [popupType, setPopupType] = useState('');
  const [readArticle, setReadArticle] = useState(null);

  const handlePopupToggle = (type) => {
    setPopupType(type);
    setIsPopupOpen(true);
  };
  const handleClosePopup = () => setIsPopupOpen(false);

  const articles = [
    {
      id: 1,
      title: 'Réussir son apprentissage du français',
      excerpt: 'Découvrez nos conseils pour progresser rapidement en français…',
      full: `Découvrez nos conseils pour progresser rapidement en français. 
- Utilisez des cartes-mémoires pour le vocabulaire. 
- Pratiquez la conversation 15 minutes par jour. 
- Regardez des vidéos en français sous-titrées.`,
      img: '/images/article11.jpg'
    },
    {
      id: 2,
      title: '5 astuces pour mémoriser le vocabulaire',
      excerpt: 'Techniques ludiques et efficaces pour retenir du vocabulaire…',
      full: `Techniques ludiques et efficaces pour retenir du vocabulaire :
1. Associez chaque mot à une image.
2. Créez des phrases insolites.
3. Utilisez des applications mobiles.
4. Jouez à des quiz interactifs.
5. Revoyez régulièrement.`,
      img: '/images/article2.jpg'
    },
    {
      id: 3,
      title: 'Comment bien réviser avant un quiz ?',
      excerpt: 'Méthodes et outils pour préparer vos quiz en toute sérénité…',
      full: `Méthodes et outils pour préparer vos quiz :
- Planifiez 5 sessions courtes.
- Alternez lecture et exercices.
- Faites des fiches de synthèse.
- Corrigez vos erreurs immédiatement.
- Utilisez des plateformes de quiz en ligne.`,
      img: '/images/article3.jpg'
    }
  ];

  return (
    <div className="home-page">
      {/* HEADER */}
      <header className="site-header">
        <div className="container">
       <img src="/RIA.png" alt="Logo" style={{ width: '55px', height: 'auto', marginRight: '1px', marginLeft: '10pxpx'  }} />
  <h1>EduFrançais</h1>
          <nav className="main-nav">
            {['Accueil','À propos','Ressources','Exercices','Blog','Avis','Contact'].map(link => (
              <a key={link} href={`#${link.toLowerCase().replace(/\s+/g,'')}`}>{link}</a>
            ))}
          </nav>
          <div className="actions">
            <button onClick={() => handlePopupToggle('login')} className="btn-login">Se connecter</button>
            <button onClick={() => handlePopupToggle('signup')} className="btn-signup">S'inscrire</button>
            {isPopupOpen && (
              <div className="popup" onClick={handleClosePopup}>
                <div className="popup-content" onClick={e => e.stopPropagation()}>
                  <div className="popup-header">
                    <h2>{popupType === 'login' ? 'Connexion' : 'Inscription'}</h2>
                    <button className="close-popup" onClick={handleClosePopup}>×</button>
                  </div>
                  <div className="role-buttons">
                    {popupType === 'login' ? (
                      <>
                        <Link to="/login"><button><FaUserShield /> Admin</button></Link>
                        <Link to="/teacher/login"><button><FaChalkboardTeacher /> Enseignant</button></Link>
                        <Link to="/student-login"><button><FaChild /> Élève</button></Link>
                      </>
                    ) : (
                      <>
                        <Link to="/teacher/register"><button><FaChalkboardTeacher /> Enseignant</button></Link>
                        <Link to="/student-signup"><button><FaChild /> Élève</button></Link>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="hero" id="home">
        <div className="container hero-inner">
          <div className="hero-text">
            <h1>Bienvenue sur <span className="highlight">EduFrançais</span></h1>
            <p>Une plateforme éducative ludique pour réviser le français tout en s'amusant, où les enseignants partagent leurs ressources et où les élèves développent leurs compétences jour après jour.</p>
          </div>
          <div className="hero-image">
            <img src="/images/freepik__background__26006.png" alt="Illustration plateforme" />
          </div>
        </div>
      </section>

      {/* À PROPOS */}
      <section className="wave-section" id="apropos">
        <div className="container about-inner">
          <div className="about-image">
            <img src="/images/alphabet.png" alt="Mission EduKids" />
          </div>
          <div className="about-text">
            <h2>À propos</h2>
            <p>EduFrançais est une plateforme pensée pour faciliter l'apprentissage de la langue française chez les jeunes apprenants. <span>Grâce à des ressources variées et des quiz adaptés à chaque niveau, ce site met en lien enseignants et élèves dans un espace éducatif stimulant et motivant.</span></p>
          </div>
        </div>
      </section>

      {/* RESSOURCES */}
      <section className="education" id="ressources">
        <div className="container">
          <h2>Ressources</h2>
          <p className="section-subtitle">
            Accédez à une large bibliothèque de leçons, de documents illustrés et de quiz interactifs. Les enseignants peuvent facilement ajouter et organiser leurs contenus, tandis que les élèves peuvent consulter librement ce qui est proposé.
          </p>
          <div className="cards">
            {[
              { title: 'Leçons', img: '/images/leçonn.png' },
              { title: 'Documents', img: '/images/doc.png' },
              { title: 'Exercices', img: '/images/exercice.png' }
            ].map(e => (
              <div className="card" key={e.title}>
                <img src={e.img} alt={e.title} />
                <h3>{e.title}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* EXERCICES */}
      <section className=" green-section" id="exercices">
        <div className="container-exer">
          <h2>Exercices</h2>
          <p className="section-subtitle-ex">
            Teste tes connaissances avec des quiz<span> amusants et adaptés à ton niveau ! </span>Faciles à utiliser, interactifs et conçus pour renforcer tes acquis.
          </p>
          <div className="exercices-content">
            <img src="/images/exercicequiz.png" alt="Exercices interactifs" className="exercices-gif floating" />
          </div>
        </div>
      </section>

      {/* BLOG */}
      <section className="gallery" id="blog">
        <div className="container">
          <h2>Blog</h2>
          <p className="section-subtitle">
            Découvrez des articles, des astuces pour mieux apprendre le français, des idées d'activités ludiques, et bien plus encore !
          </p>
          <div className="grid-gallery">
            {articles.map(a => (
              <div className="card-article" key={a.id}>
                <img src={a.img} alt={a.title} />
                <h3>{a.title}</h3>
                <p>{a.excerpt}</p>
                <button className="btn-read" onClick={() => setReadArticle(a.id)}>Lire la suite</button>
              </div>
            ))}
          </div>
        </div>
        {readArticle != null && (
          <div className="article-modal" onClick={() => setReadArticle(null)}>
            <div className="article-content" onClick={e => e.stopPropagation()}>
              <button className="close-modal" onClick={() => setReadArticle(null)}>×</button>
              <h3>{articles.find(x => x.id === readArticle).title}</h3>
              <p>{articles.find(x => x.id === readArticle).full}</p>
            </div>
          </div>
        )}
      </section>

      {/* AVIS & TÉMOIGNAGES */}
      <section className="team" id="avis">
        <div className="container">
          <h2>Avis & Témoignages</h2>
          <div className="cards-teachers">
            {[
              { name: 'Mayssam', role: 'Enseignante', quote: 'Plateforme intuitive et complète !', img: '/images/avis1.png' },
              { name: 'Lina', role: 'Élève', quote: 'J’ai progressé rapidement en vocabulaire.', img: '/images/avis2.png' },
              { name: 'Ahmed', role: 'Parent', quote: 'Mes enfants adorent ce site.', img: '/images/avis3.png' }
            ].map((t,i) => (
              <div className="card-teacher" key={i}>
                <img src={t.img} alt={t.name} className="avatar" />
                <h3>{t.name}</h3>
                <p className="role">{t.role}</p>
                <p className="quote">“{t.quote}”</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="site-footer" id="contact">
        <div className="container footer-cols">
          <div>
            <h3>Contact</h3>
            <p>Notre équipe est à votre écoute !</p>
            <p>Email : support@edukids.com</p>
            <p>Tél : +216 28 56 73 46</p>
          </div>
          <div>
            <h4>Liens rapides</h4>
            {['Inscription','Calendrier'].map(l => (
              <a key={l} href="#">{l}</a>
            ))}
          </div>
          <div>
            <h4>Catégories</h4>
            {['À propos','Programme','Admissions','Actualités','Contact'].map(l => (
              <a key={l} href="#">{l}</a>
            ))}
          </div>
          <div className="social-footer">
            <a href="#"><FaFacebookF/></a>
            <a href="#"><FaTwitter/></a>
            <a href="#"><FaInstagram/></a>
          </div>
        </div>
      </footer>
    </div>
  );
}

