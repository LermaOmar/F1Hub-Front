import { NavLink } from 'react-router-dom';

const Sidebar = () => (
  <nav className="guide-sidebar">
    <h2>📘 Guide</h2>
    <ul>
      <li><NavLink to="/guide/introduction">Intro</NavLink></li>
      <li><NavLink to="/guide/how-to-play">How to Play</NavLink></li>
      <li><NavLink to="/guide/market">Market</NavLink></li>
      <li><NavLink to="/guide/faq">FAQ</NavLink></li>
    </ul>
  </nav>
);

export default Sidebar;
