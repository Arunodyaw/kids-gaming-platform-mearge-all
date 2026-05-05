import React from 'react';

const Program = () => {
  return (
    <>
      {/* Page Header Start */}
      <div className="container-fluid page-header py-5 wow fadeIn" data-wow-delay="0.1s">
        <div className="container text-center py-5">
          <h1 className="display-2 text-white mb-4">Programs</h1>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb justify-content-center mb-0">
              <li className="breadcrumb-item"><a href="#">Home</a></li>
              <li className="breadcrumb-item"><a href="#">Pages</a></li>
              <li className="breadcrumb-item text-white" aria-current="page">Programs</li>
            </ol>
          </nav>
        </div>
      </div>
      {/* Page Header End */}

      {/* Programs Start */}
      <div className="container-fluid program py-5">
        <div className="container py-5">
          <div className="mx-auto text-center wow fadeIn" data-wow-delay="0.1s" style={{ maxWidth: '700px' }}>
            <h4 className="text-primary mb-4 border-bottom border-primary border-2 d-inline-block p-2 title-border-radius">Our Programs</h4>
            <h1 className="mb-5 display-3">We Offer An Exclusive Program For Kids</h1>
          </div>
          <div className="row g-5 justify-content-center">
            
            {/* Program Item 1 */}
            <div className="col-md-6 col-lg-6 col-xl-4 wow fadeIn" data-wow-delay="0.1s">
              <div className="program-item rounded">
                <div className="program-img position-relative">
                  <div className="overflow-hidden img-border-radius">
                    <img src="img/program-1.jpg" className="img-fluid w-100" alt="Image" />
                  </div>
                  <div className="px-4 py-2 bg-primary text-white program-rate">$60.99</div>
                </div>
                <div className="program-text bg-white px-4 pb-3">
                  <div className="program-text-inner">
                    <a href="#" className="h4">English For Today</a>
                    <p className="mt-3 mb-0">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec sed purus consectetur,</p>
                  </div>
                </div>
                <div className="program-teacher d-flex align-items-center border-top border-primary bg-white px-4 py-3">
                  <img src="img/program-teacher.jpg" className="img-fluid rounded-circle p-2 border border-primary bg-white" alt="Image" style={{ width: '70px', height: '70px' }} />
                  <div className="ms-3">
                    <h6 className="mb-0 text-primary">Mary Mordern</h6>
                    <small>Arts Designer</small>
                  </div>
                </div>
                <div className="d-flex justify-content-between px-4 py-2 bg-primary rounded-bottom">
                  <small className="text-white"><i className="fas fa-wheelchair me-1"></i> 30 Sits</small>
                  <small className="text-white"><i className="fas fa-book me-1"></i> 11 Lessons</small>
                  <small className="text-white"><i className="fas fa-clock me-1"></i> 60 Hours</small>
                </div>
              </div>
            </div>

            {/* Program Item 2 */}
            <div className="col-md-6 col-lg-6 col-xl-4 wow fadeIn" data-wow-delay="0.3s">
              <div className="program-item rounded">
                <div className="program-img position-relative">
                  <div className="overflow-hidden img-border-radius">
                    <img src="img/program-2.jpg" className="img-fluid w-100" alt="Image" />
                  </div>
                  <div className="px-4 py-2 bg-primary text-white program-rate">$60.99</div>
                </div>
                <div className="program-text bg-white px-4 pb-3">
                  <div className="program-text-inner">
                    <a href="#" className="h4">Graphics Arts</a>
                    <p className="mt-3 mb-0">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec sed purus consectetur,</p>
                  </div>
                </div>
                <div className="program-teacher d-flex align-items-center border-top border-primary bg-white px-4 py-3">
                  <img src="img/program-teacher.jpg" className="img-fluid rounded-circle p-2 border border-primary bg-white" alt="" style={{ width: '70px', height: '70px' }} />
                  <div className="ms-3">
                    <h6 className="mb-0 text-primary">Mary Mordern</h6>
                    <small>Arts Designer</small>
                  </div>
                </div>
                <div className="d-flex justify-content-between px-4 py-2 bg-primary rounded-bottom">
                  <small className="text-white"><i className="fas fa-wheelchair me-1"></i> 30 Sits</small>
                  <small className="text-white"><i className="fas fa-book me-1"></i> 11 Lessons</small>
                  <small className="text-white"><i className="fas fa-clock me-1"></i> 60 Hours</small>
                </div>
              </div>
            </div>

            {/* Program Item 3 */}
            <div className="col-md-6 col-lg-6 col-xl-4 wow fadeIn" data-wow-delay="0.5s">
              <div className="program-item rounded">
                <div className="program-img position-relative">
                  <div className="overflow-hidden img-border-radius">
                    <img src="img/program-3.jpg" className="img-fluid w-100" alt="Image" />
                  </div>
                  <div className="px-4 py-2 bg-primary text-white program-rate">$60.99</div>
                </div>
                <div className="program-text bg-white px-4 pb-3">
                  <div className="program-text-inner">
                    <a href="#" className="h4">General Science</a>
                    <p className="mt-3 mb-0">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec sed purus consectetur,</p>
                  </div>
                </div>
                <div className="program-teacher d-flex align-items-center border-top border-primary bg-white px-4 py-3">
                  <img src="img/program-teacher.jpg" className="img-fluid rounded-circle p-2 border border-primary bg-white" alt="" style={{ width: '70px', height: '70px' }} />
                  <div className="ms-3">
                    <h6 className="mb-0 text-primary">Mary Mordern</h6>
                    <small>Arts Designer</small>
                  </div>
                </div>
                <div className="d-flex justify-content-between px-4 py-2 bg-primary rounded-bottom">
                  <small className="text-white"><i className="fas fa-wheelchair me-1"></i> 30 Sits</small>
                  <small className="text-white"><i className="fas fa-book me-1"></i> 11 Lessons</small>
                  <small className="text-white"><i className="fas fa-clock me-1"></i> 60 Hours</small>
                </div>
              </div>
            </div>

            <div className="d-inline-block text-center wow fadeIn" data-wow-delay="0.1s">
              <a href="#" className="btn btn-primary px-5 py-3 text-white btn-border-radius">Vew All Programs</a>
            </div>

          </div>
        </div>
      </div>
      {/* Program End */}
    </>
  );
};

export default Program;