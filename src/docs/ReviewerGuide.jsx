import React from 'react';

const ReviewerGuide = () => {
  return (
    <div className="guide-content">
      <h1>👨‍🔧 Reviewer Panel</h1>

      <section>
        <h2>🧮 Automatic Points Assignment</h2>
        <p>
          As a reviewer, you don't need to calculate points manually. The system automatically assigns points based on the drivers' and teams' performance during the event.
        </p>
        <p>
          You only need to input relevant data such as:
        </p>
        <ul>
          <li>Driver's Qualifying position</li>
          <li>Race position</li>
          <li>Positions in Sprint Qualifying / Sprint Race</li>
          <li>Flags like MVP, Fast Lap, and Grand Chelem</li>
        </ul>
      <img src={`${import.meta.env.BASE_URL}docs/assign-drivers.png`} alt="Assign Drivers Points" className="doc-image" />
      </section>

      <section>
        <h2>⚠️ Grand Chelem Validation</h2>
        <p>
          To mark a driver with <strong>Grand Chelem</strong>, you must ensure they meet all the following conditions:
        </p>
        <ul className="doc-warning">
          <li>🏁 Fastest Lap</li>
          <li>🥇 1st in Qualifying</li>
          <li>🥇 1st in Race</li>
          <li>🚥 Led every lap of the main race</li>
        </ul>
        <p>
          If one of these is missing, Grand Chelem cannot be validly assigned.
        </p>
      </section>

      <section>
        <h2>🏎️ Assigning Team Points</h2>
        <p>
          Team points are also computed automatically. You simply indicate the final race position of both drivers from each team.
        </p>
        <img src={`${import.meta.env.BASE_URL}docs/assign-teams.png`} alt="Assign Teams Points" className="doc-image" />
        <p>
          The app calculates total team points using the positions provided for Driver 1 and Driver 2.
        </p>
      </section>

      <section>
        <h2>💾 Saving</h2>
        <p>
          You can save data for each driver individually using the yellow “Save” buttons, or submit everything at once with the “Save All” button at the top right. But you can only save all the team's data at once.
        </p>
      </section>
    </div>
  );
};

export default ReviewerGuide;
