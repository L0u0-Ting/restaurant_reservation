/**
 * ==============================
 * Imports
 * ==============================
 */
import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

/**
 * ==============================
 * Component: Home
 * Description: Homepage displaying the restaurant's philosophy.
 * Features:
 * - Hero banner
 * - Short intro text
 * - Call to action
 * ==============================
 */
const Home = () => {
    const { t, language } = useLanguage();

    const text = {
        title: {
            zh: "歡迎回到 棲所",
            en: "Welcome to The Haven",
            jp: "温かい食堂へようこそ"
        },
        philosophy: {
            zh: (
                <>
                    在這個繁忙的城市裡，我們希望成為您心靈的避風港。<br />
                    不只是填飽肚子，更希望能用溫暖的家常料理，<br />
                    輕輕接住每一個疲憊的靈魂。
                </>
            ),
            en: (
                <>
                    In this busy city, we hope to be your sanctuary.<br />
                    More than just filling your stomach, we aim to comfort your soul<br />
                    with the warmth of home-style cooking.
                </>
            ),
            jp: (
                <>
                    この忙しい都会の中で、私たちはあなたの心の安らぎの場所でありたいと願っています。<br />
                    お腹を満たすだけでなく、温かい家庭料理で、<br />
                    疲れた心を優しく受け止めたいと思っています。
                </>
            )
        },
        extra: {
            zh: '"好好吃飯，好好休息，明天又是新的一天。"',
            en: '"Eat well, rest well, tomorrow is a new day."',
            jp: '「よく食べ、よく休み、明日はまた新しい一日。」'
        }
    };

    return (
        <div className="home-container">
            {/* Philosophy Section */}
            <div className="philosophy-content">
                <h1 className="main-title">{text.title[language]}</h1>
                <p className="philosophy-text">
                    {text.philosophy[language]}
                </p>
                <p className="philosophy-quote">
                    {text.extra[language]}
                </p>
                <div className="cta-container">
                    <Link to="/menu" className="cta-btn">
                        {t('menu')}
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Home;
