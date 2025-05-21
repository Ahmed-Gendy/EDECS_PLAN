import React from 'react';

function Header({ title, onBack }) {
  return (
    <header className="bg-primary text-white py-3 mb-4">
      <div className="container-fluid">
        <div className="d-flex align-items-center">
          {onBack && (
            <button
              className="btn btn-link text-white me-3 p-0"
              onClick={onBack}
            >
              <i className="bi bi-arrow-left fs-4"></i>
            </button>
          )}
          <h1 className="mb-0 h3">{title}</h1>
        </div>
      </div>
    </header>
  );
}

export default Header;
