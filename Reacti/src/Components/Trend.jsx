import React, { useState } from 'react'
import "./Trend.css"
import first from "../assets/1.webp";
import sec from "../assets/2.webp";
import thrd from "../assets/3.webp";
import four from "../assets/4.webp";
import five from "../assets/5.webp";
import tv from "../assets/monitor.png"
import download from "../assets/arrow.png"
import telescope from "../assets/spy.png"
import kids from "../assets/user.png"

function Trend() {
  const [openId, setOpenId] = useState(null);

  const faqs = [
    {
      id: 1,
      question: "What is Netflix?",
      answer: "Netflix is a streaming service that offers a wide variety of award-winning TV shows, movies, anime, documentaries and more – on thousands of internet-connected devices.\n\nYou can watch as much as you want, whenever you want, without a single ad – all for one low monthly price. There's always something new to discover, and new TV shows and movies are added every week!"
    },
    {
      id: 2,
      question: "How much does Netflix cost?",
      answer: "Watch Netflix on your smartphone, tablet, Smart TV, laptop, or streaming device, all for one fixed monthly fee. Plans range from ₹149 to ₹649 a month."
    },
    {
      id: 3,
      question: "Where can I watch?",
      answer: "Watch anywhere, anytime. Sign in with your Netflix account to watch instantly on the web or on any internet-connected device."
    },
    {
      id: 4,
      question: "How do I cancel?",
      answer: "Netflix is flexible. There are no pesky contracts and no commitments. You can easily cancel your account online in two clicks."
    },
    {
      id: 5,
      question: "What can I watch on Netflix?",
      answer: "Netflix has an extensive library of feature films, documentaries, shows, anime, award-winning Netflix originals, and more. Watch as much as you want, anytime you want."
    },
    {
      id: 6,
      question: "Is Netflix good for kids?",
      answer:
        ["The Netflix Kids experience is included in your membership to give parents control while kids enjoy family-friendly TV shows and films in their own space.", <br />, <br />,
          "Kids profiles come with PIN-protected parental controls that let you restrict the maturity rating of content kids can watch and block specific titles you don't want kids to see."]
    }
  ];

  const toggle = (id) => {
    setOpenId(openId === id ? null : id);
  };

  const movies = [
    { id: 1, image: first },
    { id: 2, image: sec },
    { id: 3, image: thrd },
    { id: 4, image: four },
    { id: 5, image: five },
  ];

  const reasons = [
    {
      title: "Enjoy on your TV",
      desc: "Watch on smart TVs, PlayStation, Xbox, Chromecast, Apple TV, Blu-ray players and more.",
      icon: tv
    },
    {
      title: "Watch your shows to watch offline",
      desc: "Save your favourites easily and always have something to watch.",
      icon: download
    },
    {
      title: "Watch everywhere",
      desc: "Stream unlimited movies and TV shows on your phone, tablet, laptop, and TV.",
      icon: telescope
    },
    {
      title: "Create profiles for kids",
      desc: "Send kids on adventures with their favourite characters in a space made just for them — free with your membership.",
      icon: kids
    }
  ];

  const [email, setEmail] = useState('');

  function Enter() {
    if (email === '') {
      alert('Please Enter Your Mail');
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
      alert('Please Enter Valid Mail');
      return;
    }
    console.log(email);
    setEmail("")
  }

  return (
    <>
      <div className="curve-line"></div>

      <section className="trending-section">
        <div className="hero-curve"> </div>
        <h2 className="trend-title">Trending Now</h2>

        <div className="trend">
          {movies.map((movie) => (
            <div className="movie-card" key={movie.id}>
              <span className="rank">{movie.id}</span>
              <img src={movie.image} alt={`Movie ${movie.id}`} />
            </div>
          ))}
        </div>

        <div className='reason'>
          <h2>More reasons to join</h2>
          <section className="reasons">
            {reasons.map((item) => (
              <div className="reason-card" key={item.title}>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
                <img src={item.icon} alt={item.title} />
              </div>
            ))}
          </section>
        </div>

        <div className='faq-container'>
          <h2 className='faq-title'>Frequently Asked Questions</h2>

          {faqs.map((item) => (
            <div key={item.id} className="faq-item">
              <div className="faq-question" onClick={() => toggle(item.id)}>
                <span>{item.question}</span>
                <span className="faq-icon">{openId === item.id ? "×" : "+"}</span>
              </div>
              {openId === item.id && (
                <div className="faq-answer">
                  {item.answer}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="input-f">
          <p>Ready to watch? Enter your email to start your membership.</p>
          <div className="hero-input">
            <div className="form-floating">
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="form-control" id="floatingInput" placeholder="name@example.com" />
              <label htmlFor="floatingInput">Email address</label>
            </div>
            <button onClick={Enter}>Get Started Netflix</button>
          </div>
        </div>
        <p className='content'>This offer is only valid for new members. This offer is non-transferrable. You agree that Netflix will charge the membership fee at the end of the free trial to your payment method and will automatically continue your membership until you cancel. Some methods of payment may not be eligible to redeem this offer.</p>
      </section>
    </>
  )
}

export default Trend