import React from "react";
import "../index.css";

const Home = () => {
  const user = JSON.parse(localStorage.getItem("user")); //  get user

  return (
    <div className="home-container">
      <header className="hero-section">
        <h1>Welcome to Expense Tracker</h1>
        {user && <p className="welcome-msg">Hello, {user.email} 👋</p>}
        <p>Manage your spending. Save smart. Live better.</p>
        <img
          src="https://img.freepik.com/free-vector/budget-management-concept-illustration_114360-7883.jpg"
          alt="Budgeting Illustration"
          className="hero-img"
        />
      </header>

      <section className="feature-section">
        <h2>Why Choose Us?</h2>
        <div className="features">
          <div className="feature-card">
            <img
              src="https://cdn-icons-png.flaticon.com/512/3022/3022672.png"
              alt="Simple Tracking"
              className="icon-class"
            />
            <h3>Simple Tracking</h3>
            <p>Easily log your daily expenses and track them in one place.</p>
          </div>
          <div className="feature-card">
            <img
              src="https://cdn-icons-png.flaticon.com/512/4149/4149624.png"
              alt="Data Insights"
              className="icon-class"
            />
            <h3>Data Insights</h3>
            <p>Visualize your spending trends and plan your budget wisely.</p>
          </div>
          <div className="feature-card">
            <img
              src="https://cdn-icons-png.flaticon.com/512/3064/3064197.png"
              alt="Secure Storage"
              className="icon-class"
            />
            <h3>Secure Storage</h3>
            <p>All your data is securely stored and backed up.</p>
          </div>
        </div>
      </section>

      <section className="about-section">
        <h2>About Expense Tracker</h2>
        <p>
          Our mission is to empower individuals to take control of their
          finances through simple and efficient tools. Whether you're managing
          bills, splitting costs, or just keeping an eye on your monthly budget,
          our app is your best companion.
        </p>
        <img
          src="https://cdn-icons-png.flaticon.com/512/2721/2721298.png"
          alt="About Expense Tracker"
          className="about-img"
        />
      </section>
    </div>
  );
};

export default Home;
