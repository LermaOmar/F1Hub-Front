import React from 'react';

const PlayerGuide = () => {
  return (
    <div className="doc-section">
      <h1>Player Guide</h1>

      <section>
        <h2>🏆 Main Actions</h2>
        <p>As a player, you can:</p>
        <ul>
          <li>View the <strong>GP MVPs</strong> of the last race.</li>
          <li>Track your <strong>rankings</strong> against other users.</li>
          <li>Manage your participation in <strong>Fantasy Leagues</strong>.</li>
        </ul>
      </section>

      <section>
        <h2>📌 My Leagues</h2>
        
        <img src={`${import.meta.env.BASE_URL}docs/league-panel.png`} alt="League Section" className="doc-image" />
        <p>In this section, you can view all the leagues you’ve joined.</p>
        <ul>
          <li>Click the <span className="emoji">🔗</span> button to copy the invitation link to the clipboard.</li>
          <li>Click <span className="emoji">🚪 Leave</span> to exit a league.</li>
          <li>Click on a league card to enter its <strong>Lineup & Market view</strong>.</li>
        </ul>

        <br />
        <p>League Creation:</p>
        <img src={`${import.meta.env.BASE_URL}docs/league-modal.png`} alt="League Creation" className="doc-image" />

        <br />
        <p>Joining League:</p>
        <img src={`${import.meta.env.BASE_URL}docs/join-league.png`} alt="Joining League" className="doc-image" />

      </section>

      <section>
        <h2>👥 Lineup for a League</h2>
        <img src={`${import.meta.env.BASE_URL}docs/lineup.png`} alt="Lineup Section" className="doc-image" />

        <p>Once inside a league, your current lineup will be shown:</p>
        <ul>
          <li>Use <strong>Display in Market</strong> to list an item for sale.</li>
          <li>Use <strong>View Offers</strong> to check who wants to buy your item.</li>
          
          <li>Access the <strong>Market</strong> section from below, using the <strong>▲</strong> / <strong>▼</strong> button to toggle the market panel and acquire new items.</li>
        </ul>
      </section>

      <section>
        <h2>💬 Offers Modal</h2>
        <img src={`${import.meta.env.BASE_URL}docs/offer-modal.png`} alt="Offer Modal" className="doc-image" />
        <p>This modal will show all offers made by other users for a specific item you own.</p>
        <p>If no one has made an offer yet, a message will appear stating it.</p>
      </section>

      <section>
        <h2>🛒 Market Section</h2>
        <img src={`${import.meta.env.BASE_URL}docs/market.png`} alt="Market Section" className="doc-image" />
        <p>The market allows you to purchase items from other users. Here you can:</p>
        <ul>
          <li>See items listed for sale by other players.</li>
          <li>Make a new offer using the <span className="emoji">➕</span> button.</li>
          <li>Edit an existing offer using the <span className="emoji">✏️</span> button.</li>
        </ul>
        <div className="warning-box">
          ⚠️ Offers can only be edited, not deleted. Make your selections wisely.
        </div>
      </section>

      <section>
        <h2>✍️ Creating or Editing an Offer</h2>
        <img src={`${import.meta.env.BASE_URL}docs/offer-creation-modal.png`} alt="Offer Creation Modal" className="doc-image" />
        <p>Fill in the desired offer amount and click <strong>Save</strong>. Your offer will be sent to the item owner.</p>
        <p>You can always come back and edit the amount, but not remove the offer.</p>
      </section>

      <section>
        <h2>🌟 MVPs of the Race</h2>
        <img src={`${import.meta.env.BASE_URL}docs/mvps.png`} alt="MVPS" className="doc-image" />
        <p>After each GP, you can check the top-performing drivers and teams based on the fantasy points they earned.</p>
        <p>This helps strategize your next lineup decisions and trades.</p>
      </section>
    </div>
  );
};

export default PlayerGuide;
