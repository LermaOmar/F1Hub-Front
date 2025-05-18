import React, {useEffect, useState} from 'react';
import '../../styles/DashBoard.css';
import axiosInstance from '../../utils/AxiosInstance';
import { useNavigate } from 'react-router-dom'

const parseJwt = (token) => {
    try {
        const base64Payload = token.split('.')[1];
        const payload = atob(base64Payload);
        return JSON.parse(payload);
    } catch (e) {
        return null;
    }
};


const DashboardPage = () => {

    const navigate = useNavigate()
    const [roles, setRoles] = useState([]);
    
    useEffect(() => {
        const token = localStorage.getItem('auth_token');
    
        if (!token) {
            navigate('/login');
        } else {
            axiosInstance.post('/auth/check')
            .then(() => {
                console.log("Valid token")
            })
            .catch((error) => {
                console.error('Token invalid or expired:', error);
                navigate('/login');
            });
        }
        }, []);

    useEffect(() => {
        const token = localStorage.getItem('auth_token');
        const decoded = parseJwt(token);
        if (
            decoded
                ?.authorities
        ) {
            const extractedRoles = decoded
                .authorities
                .map(auth => auth.authority.replace('ROLE_', '').toLowerCase());
            setRoles(extractedRoles);
        }
    }, []);

    const hasRole = (r) => roles.includes(r.toLowerCase());

    const adminCards = [
        {
            icon: '👤',
            label: 'Users maintenance',
            route: '/admin/mantainence/users'
        },
        {
            icon: '⚙️',
            label: 'Content maintenance',
            route: '/admin/mantainence/content'
        }
    ]


    const reviewerCards = [
        {
            icon: '📊',
            label: 'Assign points - Teams',
            route: '/reviewer/assign/teams'
        }, {
            icon: '🏎️',
            label: 'Assign points - Drivers',
            route: '/reviewer/assign/drivers'
        }
    ];

    const playerCards = [
        {
            icon: '🛡️',
            label: 'Leagues',
            route: '/player/leagues'
        }, {
            icon: '🏆',
            label: 'Rankings',
            route: '/player/rankings'
        }, {
            icon: '⭐',
            label: 'MVP\'s',
            route: '/player/mvps'
        }
    ];

    const handleLogout = () => {
        localStorage.removeItem('auth_token');
        window.location.href = '/';
    };

    return (
        <div className="dashboard-wrapper">
            <div className="dashboard-container">
                <header className="dashboard-header">
                    <div className="header-content">DASHBOARD</div>
                </header>

                <main className="dashboard-main">

                    <div className="dashboard-top-row">
                        {
                            hasRole('admin') && (
                                <section className="dashboard-section admin-section">
                                    <h3>Admin</h3>
                                    <div className="dashboard-card-group">
                                        {
                                            adminCards.map((card, i) => (
                                                <div key={i} className="dashboard-card"
                                                onClick={() => card.route && navigate(card.route)}>
                                                    <span className="dashboard-icon">{card.icon}</span>
                                                    <span className="dashboard-label">{card.label}</span>
                                                </div>
                                            ))
                                        }
                                    </div>
                                </section>
                            )
                        }

                        {
                            hasRole('reviewer') && (
                                <section className="dashboard-section reviewer-section">
                                    <h3>Reviewer</h3>
                                    <div className="dashboard-card-group">
                                        {
                                            reviewerCards.map((card, i) => (
                                                <div key={i} className="dashboard-card">
                                                    <span className="dashboard-icon">{card.icon}</span>
                                                    <span className="dashboard-label">{card.label}</span>
                                                </div>
                                            ))
                                        }
                                    </div>
                                </section>
                            )
                        }
                    </div>

                    {
                        hasRole('player') && (
                            <section className="dashboard-section player-section full-width-section">
                                <h3>Player</h3>
                                <div className="dashboard-card-group">
                                    {
                                        playerCards.map((card, i) => (
                                            <div key={i} className="dashboard-card">
                                                <span className="dashboard-icon">{card.icon}</span>
                                                <span className="dashboard-label">{card.label}</span>
                                            </div>
                                        ))
                                    }
                                </div>
                            </section>
                        )
                    }
                </main>

                <footer className="dashboard-footer">
                    <button className="logout-btn" onClick={handleLogout}>Logout</button>
                </footer>
            </div>
        </div>
    );

};

export default DashboardPage;
