import React, { useState } from 'react';
import { ENDPOINTS, apiCall } from '../config/api';

const AuthScreen = ({ onLogin }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        name: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        if (!isLogin) {
            if (!formData.name) {
                newErrors.name = 'Name is required';
            }
            if (formData.password !== formData.confirmPassword) {
                newErrors.confirmPassword = 'Passwords do not match';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) return;

        setLoading(true);
        
        try {
            const endpoint = isLogin ? ENDPOINTS.LOGIN : ENDPOINTS.REGISTER;
            const payload = isLogin 
                ? { email: formData.email, password: formData.password }
                : { name: formData.name, email: formData.email, password: formData.password };
            
            const response = await apiCall(endpoint, {
                method: 'POST',
                body: JSON.stringify(payload)
            });
            
            if (response.success) {
                // Store user data with token in localStorage
                const userData = {
                    ...response.user,
                    token: response.token
                };
                
                localStorage.setItem('talkbuddy_user', JSON.stringify(userData));
                onLogin(userData);
            } else {
                setErrors({ form: response.error || 'Authentication failed' });
            }
        } catch (error) {
            console.error('Authentication error:', error);
            setErrors({ form: error.message || 'Authentication failed. Please try again.' });
        } finally {
            setLoading(false);
        }
    };

    const toggleMode = () => {
        setIsLogin(!isLogin);
        setFormData({
            email: '',
            password: '',
            name: '',
            confirmPassword: ''
        });
        setErrors({});
    };

    return (
        <div className="auth-container">
            <div className="auth-content">
                {/* Left Side - Branding */}
                <div className="auth-branding">
                    <div className="brand-content">
                        <div className="brand-logo">
                            <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
                                <circle cx="30" cy="30" r="30" fill="#007AFF"/>
                                <path d="M20 25h20v10H20z" fill="white" opacity="0.9"/>
                                <circle cx="25" cy="30" r="2" fill="#007AFF"/>
                                <circle cx="35" cy="30" r="2" fill="#007AFF"/>
                                <path d="M22 38c2-2 6-2 8 0s6 2 8 0" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                            </svg>
                        </div>
                        <h1 className="brand-title">TalkBuddy</h1>
                        <p className="brand-subtitle">Your AI English Coach</p>
                        <div className="brand-features">
                            <div className="feature-item">
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                </svg>
                                <span>Real-time feedback</span>
                            </div>
                            <div className="feature-item">
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M7 4V2a1 1 0 011-1h4a1 1 0 011 1v2h4a1 1 0 110 2h-1v10a2 2 0 01-2 2H6a2 2 0 01-2-2V6H3a1 1 0 110-2h4zM9 3v1h2V3H9zm-2 3v8h6V6H7z"/>
                                </svg>
                                <span>Progress tracking</span>
                            </div>
                            <div className="feature-item">
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/>
                                </svg>
                                <span>Personalized learning</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side - Auth Form */}
                <div className="auth-form-container">
                    <div className="auth-form-content">
                        <div className="auth-header">
                            <h2 className="auth-title">
                                {isLogin ? 'Welcome back!' : 'Create your account'}
                            </h2>
                            <p className="auth-subtitle">
                                {isLogin 
                                    ? 'Sign in to continue your English learning journey' 
                                    : 'Start your journey to fluent English today'
                                }
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="auth-form">
                            {!isLogin && (
                                <div className="form-group">
                                    <label htmlFor="name" className="form-label">Full Name</label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className={`form-input ${errors.name ? 'error' : ''}`}
                                        placeholder="Enter your full name"
                                    />
                                    {errors.name && <span className="error-message">{errors.name}</span>}
                                </div>
                            )}

                            <div className="form-group">
                                <label htmlFor="email" className="form-label">Email Address</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className={`form-input ${errors.email ? 'error' : ''}`}
                                    placeholder="Enter your email"
                                />
                                {errors.email && <span className="error-message">{errors.email}</span>}
                            </div>

                            <div className="form-group">
                                <label htmlFor="password" className="form-label">Password</label>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    className={`form-input ${errors.password ? 'error' : ''}`}
                                    placeholder="Enter your password"
                                />
                                {errors.password && <span className="error-message">{errors.password}</span>}
                            </div>

                            {!isLogin && (
                                <div className="form-group">
                                    <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                                    <input
                                        type="password"
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleInputChange}
                                        className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
                                        placeholder="Confirm your password"
                                    />
                                    {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
                                </div>
                            )}

                            <button 
                                type="submit" 
                                className="btn btn-primary btn-full"
                                disabled={loading}
                            >
                                {loading ? (
                                    <span className="loading-spinner">
                                        <svg className="animate-spin" width="20" height="20" viewBox="0 0 24 24">
                                            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" opacity="0.25"/>
                                            <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                                        </svg>
                                        {isLogin ? 'Signing in...' : 'Creating account...'}
                                    </span>
                                ) : (
                                    isLogin ? 'Sign In' : 'Create Account'
                                )}
                            </button>
                        </form>

                        <div className="auth-footer">
                            <p className="auth-switch">
                                {isLogin ? "Don't have an account? " : "Already have an account? "}
                                <button 
                                    type="button" 
                                    onClick={toggleMode}
                                    className="auth-switch-btn"
                                >
                                    {isLogin ? 'Sign up' : 'Sign in'}
                                </button>
                            </p>
                        </div>

                        {/* Demo Access */}
                        <div className="demo-access">
                            <div className="divider">
                                <span>or</span>
                            </div>
                            <button 
                                type="button"
                                onClick={() => onLogin({
                                    id: 'demo-user',
                                    name: 'Demo User',
                                    email: 'demo@talkbuddy.com',
                                    joinDate: new Date().toISOString(),
                                    avatar: 'https://ui-avatars.com/api/?name=Demo+User&background=007AFF&color=fff'
                                })}
                                className="btn btn-secondary btn-full"
                            >
                                Continue as Demo User
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthScreen;