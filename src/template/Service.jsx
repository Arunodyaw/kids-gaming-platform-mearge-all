import React from 'react';

const Service = () => {
  return (
    <>
      {/* Page Header Start */}
      <div className="container-fluid page-header py-5 wow fadeIn" data-wow-delay="0.1s">
        <div className="container text-center py-5">
          <h1 className="display-2 text-white mb-4">Services</h1>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb justify-content-center mb-0">
              <li className="breadcrumb-item"><a href="#">Home</a></li>
              <li className="breadcrumb-item"><a href="#">Pages</a></li>
              <li className="breadcrumb-item text-white" aria-current="page">Services</li>
            </ol>
          </nav>
        </div>
      </div>
      {/* Page Header End */}

      {/* Service Start */}
      <div className="container-fluid service py-5">
        <div className="container py-5">
          <div className="mx-auto text-center wow fadeIn" data-wow-delay="0.1s" style={{ maxWidth: '700px' }}>
            <h4 className="text-primary mb-4 border-bottom border-primary border-2 d-inline-block p-2 title-border-radius">What We Do</h4>
            <h1 className="mb-5 display-3">Thanks To Get Started With Our School</h1>
          </div>
          <div className="row g-5">
            
            {/* Service Item 1 */}
            <div className="col-md-6 col-lg-6 col-xl-3 wow fadeIn" data-wow-delay="0.1s">
              <div className="text-center border-primary border bg-white service-item">
                <div className="service-content d-flex align-items-center justify-content-center p-4">
                  <div className="service-content-inner">
                    <div className="p-4"><i className="fas fa-gamepad fa-6x text-primary"></i></div>
                    <a href="#" className="h4">Study & Game</a>
                    <p className="my-3">We blend traditional classroom learning with interactive play to keep children engaged. Our game-based approach ensures that mastering new skills is always an exciting and joyful adventure.</p>
                    <a href="#" className="btn btn-primary text-white px-4 py-2 my-2 btn-border-radius">Read More</a>
                  </div>
                </div>
              </div>
            </div>

            {/* Service Item 2 */}
            <div className="col-md-6 col-lg-6 col-xl-3 wow fadeIn" data-wow-delay="0.3s">
              <div className="text-center border-primary border bg-white service-item">
                <div className="service-content d-flex align-items-center justify-content-center p-4">
                  <div className="service-content-inner">
                    <div className="p-4"><i className="fas fa-sort-alpha-down fa-6x text-primary"></i></div>
                    <a href="#" className="h4">A to Z Programs</a>
                    <p className="my-3">From early alphabet recognition to advanced problem-solving, our comprehensive curriculum covers every milestone. We provide structured, step-by-step learning paths tailored to each child's pace.</p>
                    <a href="#" className="btn btn-primary text-white px-4 py-2 my-2 btn-border-radius">Read More</a>
                  </div>
                </div>
              </div>
            </div>

            {/* Service Item 3 */}
            <div className="col-md-6 col-lg-6 col-xl-3 wow fadeIn" data-wow-delay="0.5s">
              <div className="text-center border-primary border bg-white service-item">
                <div className="service-content d-flex align-items-center justify-content-center p-4">
                  <div className="service-content-inner">
                    <div className="p-4"><i className="fas fa-users fa-6x text-primary"></i></div>
                    <a href="#" className="h4">Expert Teacher</a>
                    <p className="my-3">Our passionate, highly-trained educators are dedicated to your child's success. They provide personalized guidance, fostering a supportive and inspiring environment for every single student.</p>
                    <a href="#" className="btn btn-primary text-white px-4 py-2 my-2 btn-border-radius">Read More</a>
                  </div>
                </div>
              </div>
            </div>

            {/* Service Item 4 */}
            <div className="col-md-6 col-lg-6 col-xl-3 wow fadeIn" data-wow-delay="0.7s">
              <div className="text-center border-primary border bg-white service-item">
                <div className="service-content d-flex align-items-center justify-content-center p-4">
                  <div className="service-content-inner">
                    <div className="p-4"><i className="fas fa-user-nurse fa-6x text-primary"></i></div>
                    <a href="#" className="h4">Mental Health</a>
                    <p className="my-3">We prioritize a child's happiness just as much as their academic growth. Our nurturing atmosphere helps children build resilience, manage their feelings, and develop strong, positive social skills.</p>
                    <a href="#" className="btn btn-primary text-white px-4 py-2 my-2 btn-border-radius">Read More</a>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
      {/* Service End */}
    </>
  );
};

export default Service;