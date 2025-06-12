import React from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import './Guide.css';

const GuideLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isHowToActive = location.pathname.includes('/docs/how-to/');

  return (
    <div className="guide-container">
      <aside className="guide-sidebar">
        <h1>📘 Guide</h1>
        <nav>
          <ul>
            <li>
              <NavLink to="introduction" end className={({ isActive }) => isActive ? 'active' : ''}>
                Intro
              </NavLink>
            </li>
            <li className={isHowToActive ? 'active' : ''}>
              <span>How to use?</span>
              <ul style={{ display: isHowToActive ? 'block' : undefined }}>
                <li>
                  <NavLink to="how-to/admin" className={({ isActive }) => isActive ? 'active' : ''}>
                    Admin
                  </NavLink>
                </li>
                <li>
                  <NavLink to="how-to/reviewer" className={({ isActive }) => isActive ? 'active' : ''}>
                    Reviewer
                  </NavLink>
                </li>
                <li>
                  <NavLink to="how-to/player" className={({ isActive }) => isActive ? 'active' : ''}>
                    Player
                  </NavLink>
                </li>
              </ul>
            </li>
            <li>
              <NavLink to="faq" className={({ isActive }) => isActive ? 'active' : ''}>
                FAQ
              </NavLink>
            </li>
            <li onClick={() => navigate("/login")}>
              <p style={{ cursor: 'pointer' }}>Login</p>
            </li>
          </ul>
        </nav>
      </aside>

      <main className="guide-main">
        <div className="doc-section">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default GuideLayout;
