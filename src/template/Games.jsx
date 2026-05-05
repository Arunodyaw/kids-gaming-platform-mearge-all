import React from "react";
import { Link } from "react-router-dom";
import puzzImg from '../assets/puzzle.jpg';


export default function Games() {
  return (
    <>
        {/* --- Page Header Start --- */}
        {/* This creates the nice blue banner at the top of the page */}
        <div className="container-fluid page-header py-5 mb-5" >
            <div className="container text-center py-5">
                <h1 className="display-2 text-white mb-4"> Game Hub</h1>
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb justify-content-center mb-0">
                        <li className="breadcrumb-item"><Link to="/" className="text-white">Home</Link></li>
                        <li className="breadcrumb-item text-white" aria-current="page">Games</li>
                    </ol>
                </nav>
            </div>
        </div>
        {/* --- Page Header End --- */}

        {/* --- Games Grid Start --- */}
        <div className="container-fluid service py-5">
            <div className="container py-5">
                
                {/* Section Title */}
                <div className="mx-auto text-center mb-5" style={{ maxWidth: "700px" }}>
                    <h4 className="text-primary mb-4 border-bottom border-primary border-2 d-inline-block p-2 title-border-radius">
                        Our Interactive Games
                    </h4>
                    <h1 className="mb-5 display-4">Train Your Brain While Having Fun</h1>
                </div>

                {/* Game Cards Row */}
                <div className="row g-5 justify-content-center">
                    
                    {/* Game 1: Memory Game */}
<div className="col-md-6 col-xl-3 mb-4">
    <div className="card border-0 h-100 shadow-sm" style={{ borderRadius: '20px', overflow: 'hidden', transition: 'transform 0.2s ease-in-out' }} onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-10px)'} onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
        <div className="position-relative">
            {/* Image Banner */}
            <img src="https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?q=80&w=500&auto=format&fit=crop" className="card-img-top" alt="Memory Game" style={{ height: '180px', objectFit: 'cover' }} />
            {/* Dark Gradient Overlay for contrast */}
            <div className="position-absolute top-0 start-0 w-100 h-100" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0) 50%, rgba(0,0,0,0.4) 100%)' }}></div>
            {/* Floating Icon Badge */}
            <div className="position-absolute bottom-0 start-50 translate-middle-x bg-white rounded-circle d-flex align-items-center justify-content-center shadow" style={{ width: '70px', height: '70px', marginBottom: '-35px' }}>
                <i className="fas fa-brain fa-2x text-primary"></i>
            </div>
        </div>
        <div className="card-body text-center pt-5 d-flex flex-column">
            <h4 className="card-title fw-bold mb-3">Memory Game</h4>
            <p className="card-text text-muted mb-4">
                Test and improve your short-term memory by finding matching pairs of cards before time runs out!
            </p>
            {/* mt-auto pushes the button to the bottom so all buttons align perfectly */}
            <Link to="/memorygame" className="btn btn-primary rounded-pill mt-auto fw-bold py-2 px-4">
                Play Now <i className="fas fa-gamepad ms-2"></i>
            </Link>
        </div>
    </div>
</div>

{/* Game 2: No-Go Game */}
<div className="col-md-6 col-xl-3 mb-4">
    <div className="card border-0 h-100 shadow-sm" style={{ borderRadius: '20px', overflow: 'hidden', transition: 'transform 0.2s ease-in-out' }} onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-10px)'} onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
        <div className="position-relative">
            <img src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=500&auto=format&fit=crop" className="card-img-top" alt="No-Go Game" style={{ height: '180px', objectFit: 'cover' }} />
            <div className="position-absolute top-0 start-0 w-100 h-100" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0) 50%, rgba(0,0,0,0.4) 100%)' }}></div>
            <div className="position-absolute bottom-0 start-50 translate-middle-x bg-white rounded-circle d-flex align-items-center justify-content-center shadow" style={{ width: '70px', height: '70px', marginBottom: '-35px' }}>
                <i className="fas fa-hand-paper fa-2x text-primary"></i>
            </div>
        </div>
        <div className="card-body text-center pt-5 d-flex flex-column">
            <h4 className="card-title fw-bold mb-3">No-Go Game</h4>
            <p className="card-text text-muted mb-4">
                Practice impulse control and rapid decision making. Click on green, but stop when you see red!
            </p>
            <Link to="/nogo-game" className="btn btn-primary rounded-pill mt-auto fw-bold py-2 px-4">
                Play Now <i className="fas fa-gamepad ms-2"></i>
            </Link>
        </div>
    </div>
</div>

{/* Game 3: Jigsaw Puzzle */}
<div className="col-md-6 col-xl-3 mb-4">
    <div className="card border-0 h-100 shadow-sm" style={{ borderRadius: '20px', overflow: 'hidden', transition: 'transform 0.2s ease-in-out' }} onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-10px)'} onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
        <div className="position-relative">
            <img src={puzzImg} className="card-img-top" alt="Jigsaw Puzzle" style={{ height: '180px', objectFit: 'cover' }} />
            <div className="position-absolute top-0 start-0 w-100 h-100" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0) 50%, rgba(0,0,0,0.4) 100%)' }}></div>
            <div className="position-absolute bottom-0 start-50 translate-middle-x bg-white rounded-circle d-flex align-items-center justify-content-center shadow" style={{ width: '70px', height: '70px', marginBottom: '-35px' }}>
                <i className="fas fa-puzzle-piece fa-2x text-primary"></i>
            </div>
        </div>
        <div className="card-body text-center pt-5 d-flex flex-column">
            <h4 className="card-title fw-bold mb-3">Jigsaw Puzzle</h4>
            <p className="card-text text-muted mb-4">
                Enhance spatial awareness and problem-solving skills by piecing together beautiful images.
            </p>
            <Link to="/games/puzzle" className="btn btn-primary rounded-pill mt-auto fw-bold py-2 px-4">
                Play Now <i className="fas fa-gamepad ms-2"></i>
            </Link>
        </div>
    </div>
</div>

{/* Game 4: Fish Attention */}
<div className="col-md-6 col-xl-3 mb-4">
    <div className="card border-0 h-100 shadow-sm" style={{ borderRadius: '20px', overflow: 'hidden', transition: 'transform 0.2s ease-in-out' }} onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-10px)'} onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
        <div className="position-relative">
            <img src="https://images.unsplash.com/photo-1524704654690-b56c05c78a00?q=80&w=500&auto=format&fit=crop" className="card-img-top" alt="Fish Attention" style={{ height: '180px', objectFit: 'cover' }} />
            <div className="position-absolute top-0 start-0 w-100 h-100" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0) 50%, rgba(0,0,0,0.4) 100%)' }}></div>
            <div className="position-absolute bottom-0 start-50 translate-middle-x bg-white rounded-circle d-flex align-items-center justify-content-center shadow" style={{ width: '70px', height: '70px', marginBottom: '-35px' }}>
                <i className="fas fa-fish fa-2x text-primary"></i>
            </div>
        </div>
        <div className="card-body text-center pt-5 d-flex flex-column">
            <h4 className="card-title fw-bold mb-3">Fish Attention</h4>
            <p className="card-text text-muted mb-4">
                Focus your attention and track the correct swimming fish among a school of distractions.
            </p>
            <Link to="/games/fish-attention" className="btn btn-primary rounded-pill mt-auto fw-bold py-2 px-4">
                Play Now <i className="fas fa-gamepad ms-2"></i>
            </Link>
        </div>
    </div>
</div>

                </div>
            </div>
        </div>
        {/* --- Games Grid End --- */}
    </>
  );
}