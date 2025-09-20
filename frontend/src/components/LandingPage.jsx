import React, { useState, useEffect } from 'react';

const LandingPage = ({ onGetStarted }) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    const features = [
        {
            icon: (
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                    <circle cx="24" cy="24" r="20" fill="#007AFF" opacity="0.1"/>
                    <path d="M24 8v8m0 16v8m8-24h8m-16 0H8m25.66 6.34l5.66-5.66M8.68 39.32l5.66-5.66m0-19.32L8.68 8.68m25.66 25.66l5.66 5.66" stroke="#007AFF" strokeWidth="2" strokeLinecap="round"/>
                </svg>
            ),
            title: "Real-time Feedback",
            description: "Get instant corrections and suggestions as you speak, helping you improve your English fluency naturally."
        },
        // {
        //     icon: (
        //         <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
        //             <circle cx="24" cy="24" r="20" fill="#007AFF" opacity="0.1"/>
        //             <path d="M16 24l6 6 12-12" stroke="#007AFF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
        //         </svg>
        //     ),
        //     title: "Progress Tracking",
        //     description: "Monitor your improvement with detailed analytics and personalized insights into your learning journey."
        // },
        {
            icon: (
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                    <circle cx="24" cy="24" r="20" fill="#007AFF" opacity="0.1"/>
                    <path d="M24 16v16l8-8" stroke="#007AFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="24" cy="24" r="12" stroke="#007AFF" strokeWidth="2"/>
                </svg>
            ),
            title: "24/7 Availability",
            description: "Practice anytime, anywhere. Your AI English coach is always ready to help you improve your skills."
        },
        {
            icon: (
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                    <circle cx="24" cy="24" r="20" fill="#007AFF" opacity="0.1"/>
                    <path d="M24 8c8.837 0 16 7.163 16 16s-7.163 16-16 16S8 32.837 8 24 15.163 8 24 8z" stroke="#007AFF" strokeWidth="2"/>
                    <path d="M24 16v8l4 4" stroke="#007AFF" strokeWidth="2" strokeLinecap="round"/>
                </svg>
            ),
            title: "Personalized Learning",
            description: "Adaptive AI that learns your strengths and weaknesses to provide customized practice sessions."
        }
    ];

    const testimonials = [
        {
            name: "Priya Sharma",
            role: "College Student",
            avatar: "https://ui-avatars.com/api/?name=Priya+Sharma&background=007AFF&color=fff",
            quote: "TalkBuddy helped me gain confidence in speaking English. The real-time feedback is amazing!"
        },
        {
            name: "Rahul Patel",
            role: "Working Professional",
            avatar: "https://ui-avatars.com/api/?name=Rahul+Patel&background=007AFF&color=fff",
            quote: "I improved my pronunciation significantly in just 2 months. Highly recommended!"
        },
        {
            name: "Anita Singh",
            role: "Job Seeker",
            avatar: "https://ui-avatars.com/api/?name=Anita+Singh&background=007AFF&color=fff",
            quote: "The progress tracking feature keeps me motivated. I can see my improvement every day."
        }
    ];

    const stats = [
        { number: "10,000+", label: "Active Learners" },
        { number: "95%", label: "Success Rate" },
        { number: "50+", label: "Countries" },
        { number: "4.9/5", label: "User Rating" }
    ];

    return (
        <div className={`landing-page ${isVisible ? 'visible' : ''}`}>
            {/* Navigation */}
            <nav className="landing-nav">
                <div className="nav-container">
                    <div className="nav-brand">
                        <div className="brand-logo">
                            <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                                <circle cx="20" cy="20" r="20" fill="#007AFF"/>
                                <path d="M13 17h14v6H13z" fill="white" opacity="0.9"/>
                                <circle cx="17" cy="20" r="1.5" fill="#007AFF"/>
                                <circle cx="23" cy="20" r="1.5" fill="#007AFF"/>
                                <path d="M15 26c1.5-1.5 4-1.5 5.5 0s4 1.5 5.5 0" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                            </svg>
                        </div>
                        <span className="brand-name">TalkBuddy</span>
                    </div>
                    <div className="nav-actions">
                        <button onClick={onGetStarted} className="btn btn-primary">
                            Get Started Free
                        </button>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="hero-section">
                <div className="hero-container">
                    <div className="hero-content">
                        <div className="hero-text">
                            <h1 className="hero-title">
                                Master English with Your
                                <span className="highlight"> AI Coach</span>
                            </h1>
                            <p className="hero-description">
                                Improve your English fluency through natural conversations with our advanced AI tutor. 
                                Get real-time feedback, track your progress, and build confidence in speaking English.
                            </p>
                            <div className="hero-actions">
                                <button onClick={onGetStarted} className="btn btn-primary btn-large">
                                    Start Learning Now
                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"/>
                                    </svg>
                                </button>
                                <button className="btn btn-secondary btn-large">
                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd"/>
                                    </svg>
                                    Watch Demo
                                </button>
                            </div>
                            <div className="hero-stats">
                                {stats.map((stat, index) => (
                                    <div key={index} className="stat-item">
                                        <div className="stat-number">{stat.number}</div>
                                        <div className="stat-label">{stat.label}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="hero-visual">
                            <div className="hero-image">
                                <div className="chat-preview">
                                    <div className="chat-header">
                                        <div className="chat-avatar">
                                            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                                                <circle cx="16" cy="16" r="16" fill="#007AFF"/>
                                                <path d="M10 13h12v6H10z" fill="white" opacity="0.9"/>
                                                <circle cx="13" cy="16" r="1" fill="#007AFF"/>
                                                <circle cx="19" cy="16" r="1" fill="#007AFF"/>
                                                <path d="M12 20c1-1 3-1 4 0s3 1 4 0" stroke="white" strokeWidth="1" strokeLinecap="round"/>
                                            </svg>
                                        </div>
                                        <div className="chat-info">
                                            <div className="chat-name">TalkBuddy AI</div>
                                            <div className="chat-status">Online</div>
                                        </div>
                                    </div>
                                    <div className="chat-messages">
                                        <div className="message assistant">
                                            <div className="message-bubble">
                                                Hello! I'm here to help you improve your English. Let's start with a conversation!
                                            </div>
                                        </div>
                                        <div className="message user">
                                            <div className="message-bubble">
                                                Hi! I want to practice speaking English.
                                            </div>
                                            <div className="message-score">
                                                <span className="score">9/10</span>
                                                <span className="feedback">Great pronunciation!</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="features-section">
                <div className="features-container">
                    <div className="section-header">
                        <h2 className="section-title">Why Choose TalkBuddy?</h2>
                        <p className="section-description">
                            Experience the future of language learning with our AI-powered English coach
                        </p>
                    </div>
                    <div className="features-grid">
                        {features.map((feature, index) => (
                            <div key={index} className="feature-card">
                                <div className="feature-icon">{feature.icon}</div>
                                <h3 className="feature-title">{feature.title}</h3>
                                <p className="feature-description">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="how-it-works-section">
                <div className="how-it-works-container">
                    <div className="section-header">
                        <h2 className="section-title">How It Works</h2>
                        <p className="section-description">
                            Start your English learning journey in just three simple steps
                        </p>
                    </div>
                    <div className="steps-grid">
                        <div className="step-card">
                            <div className="step-number">1</div>
                            <h3 className="step-title">Sign Up</h3>
                            <p className="step-description">
                                Create your free account and tell us about your English learning goals
                            </p>
                        </div>
                        <div className="step-card">
                            <div className="step-number">2</div>
                            <h3 className="step-title">Start Talking</h3>
                            <p className="step-description">
                                Begin conversations with our AI tutor on topics that interest you
                            </p>
                        </div>
                        <div className="step-card">
                            <div className="step-number">3</div>
                            <h3 className="step-title">Improve Daily</h3>
                            <p className="step-description">
                                Get instant feedback and track your progress as you build fluency
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="testimonials-section">
                <div className="testimonials-container">
                    <div className="section-header">
                        <h2 className="section-title">What Our Users Say</h2>
                        <p className="section-description">
                            Join thousands of learners who have improved their English with TalkBuddy
                        </p>
                    </div>
                    <div className="testimonials-grid">
                        {testimonials.map((testimonial, index) => (
                            <div key={index} className="testimonial-card">
                                <div className="testimonial-content">
                                    <p className="testimonial-quote">"{testimonial.quote}"</p>
                                </div>
                                <div className="testimonial-author">
                                    <img src={testimonial.avatar} alt={testimonial.name} className="author-avatar" />
                                    <div className="author-info">
                                        <div className="author-name">{testimonial.name}</div>
                                        <div className="author-role">{testimonial.role}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="cta-section">
                <div className="cta-container">
                    <div className="cta-content">
                        <h2 className="cta-title" style={{color: 'var(--color-text-primary)'}}>Ready to Start Your English Journey?</h2>
                        <p className="cta-description">
                            Join thousands of learners who are already improving their English with TalkBuddy. 
                            Start your free trial today!
                        </p>
                        <div className="cta-actions">
                            <button onClick={onGetStarted} className="btn btn-primary btn-large">
                                Get Started Free
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"/>
                                </svg>
                            </button>
                        </div>
                        <p className="cta-note">No credit card required • Free forever plan available</p>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="landing-footer">
                <div className="footer-container">
                    <div className="footer-content">
                        <div className="footer-brand">
                            <div className="brand-logo">
                                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                                    <circle cx="16" cy="16" r="16" fill="#007AFF"/>
                                    <path d="M10 13h12v6H10z" fill="white" opacity="0.9"/>
                                    <circle cx="13" cy="16" r="1" fill="#007AFF"/>
                                    <circle cx="19" cy="16" r="1" fill="#007AFF"/>
                                    <path d="M12 20c1-1 3-1 4 0s3 1 4 0" stroke="white" strokeWidth="1" strokeLinecap="round"/>
                                </svg>
                            </div>
                            <span className="brand-name">TalkBuddy</span>
                        </div>
                        <p className="footer-description">
                            Your AI English coach for fluent conversations and confident communication.
                        </p>
                    </div>
                    <div className="footer-bottom">
                        <p>&copy; 2024 TalkBuddy. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;