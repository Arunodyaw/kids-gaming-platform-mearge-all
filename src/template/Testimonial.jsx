import React from 'react';

const Testimonial = () => {
  return (
    <>
      {/* Page Header Start */}
      <div className="container-fluid page-header py-5 wow fadeIn" data-wow-delay="0.1s">
        <div className="container text-center py-5">
          <h1 className="display-2 text-white mb-4">Testimonial</h1>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb justify-content-center mb-0">
              <li className="breadcrumb-item"><a href="#">Home</a></li>
              <li className="breadcrumb-item"><a href="#">Pages</a></li>
              <li className="breadcrumb-item text-white" aria-current="page">Testimonial</li>
            </ol>
          </nav>
        </div>
      </div>
      {/* Page Header End */}

      {/* Testimonial Start */}
      <div className="container-fluid testimonial py-5">
        <div className="container py-5">
          <div className="mx-auto text-center wow fadeIn" data-wow-delay="0.1s" style={{ maxWidth: '700px' }}>
            {/* <h4 className="text-primary mb-4 border-bottom border-primary border-2 d-inline-block p-2 title-border-radius">Our Testimonials</h4>
            <h1 className="mb-5 display-3">Parents Say About Us</h1> */}
          </div>
          {/* Testimonial Start */}
<div className="container-fluid testimonial py-5">
    <div className="container py-5">
        
        {/* Removed 'wow fadeIn' and 'data-wow-delay' */}
        <div className="mx-auto text-center" style={{ maxWidth: "700px" }}>
            <h4 className="text-primary mb-4 border-bottom border-primary border-2 d-inline-block p-2 title-border-radius">Our Testimonials</h4>
            <h1 className="mb-5 display-3">What Parents Say About Us</h1>
        </div>

        {/* Replaced 'owl-carousel' with a Bootstrap Row for native React compatibility */}
        <div className="row g-4 justify-content-center mt-2">
            
            {/* Testimonial Item 1 */}
            <div className="col-md-6 col-lg-5">
                <div className="testimonial-item img-border-radius bg-light border border-primary p-4 h-100">
                    {/* Added d-flex and flex-column to make heights match perfectly */}
                    <div className="p-4 position-relative h-100 d-flex flex-column">
                        <i className="fa fa-quote-right fa-2x text-primary position-absolute" style={{ top: "15px", right: "15px" }}></i>
                        <div className="d-flex align-items-center">
                            <div className="border border-primary bg-white rounded-circle">
                                <img src="/img/testimonial-2.jpg" className="rounded-circle p-2" style={{ width: "80px", height: "80px", borderStyle: "dotted", borderColor: "var(--bs-primary)", objectFit: "cover" }} alt="Client" />
                            </div>
                            <div className="ms-4">
                                <h4 className="text-dark">Sarah Jenkins</h4>
                                <p className="m-0 pb-3">Parent</p>
                                <div className="d-flex pe-5">
                                    <i className="fas fa-star text-primary"></i>
                                    <i className="fas fa-star text-primary"></i>
                                    <i className="fas fa-star text-primary"></i>
                                    <i className="fas fa-star text-primary"></i>
                                    <i className="fas fa-star text-primary"></i>
                                </div>
                            </div>
                        </div>
                        {/* mt-auto pushes the text to the bottom if names are different heights */}
                        <div className="border-top border-primary mt-4 pt-3 mt-auto">
                            <p className="mb-0">
                                "This platform has completely transformed how my child interacts with learning. The gamified tasks are engaging, and the progress dashboard gives me so much peace of mind!"
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Testimonial Item 2 */}
            <div className="col-md-6 col-lg-5">
                <div className="testimonial-item img-border-radius bg-light border border-primary p-4 h-100">
                    <div className="p-4 position-relative h-100 d-flex flex-column">
                        <i className="fa fa-quote-right fa-2x text-primary position-absolute" style={{ top: "15px", right: "15px" }}></i>
                        <div className="d-flex align-items-center">
                            <div className="border border-primary bg-white rounded-circle">
                                <img src="/img/testimonial-2.jpg" className="rounded-circle p-2" style={{ width: "80px", height: "80px", borderStyle: "dotted", borderColor: "var(--bs-primary)", objectFit: "cover" }} alt="Client" />
                            </div>
                            <div className="ms-4">
                                <h4 className="text-dark">Michael Torres</h4>
                                <p className="m-0 pb-3">Educator</p>
                                <div className="d-flex pe-5">
                                    <i className="fas fa-star text-primary"></i>
                                    <i className="fas fa-star text-primary"></i>
                                    <i className="fas fa-star text-primary"></i>
                                    <i className="fas fa-star text-primary"></i>
                                    <i className="fas fa-star text-primary"></i>
                                </div>
                            </div>
                        </div>
                        <div className="border-top border-primary mt-4 pt-3 mt-auto">
                            <p className="mb-0">
                                "The cognitive screening tools combined with fun activities make this an invaluable resource. The behavioral data we get from the interactive modules is outstanding."
                            </p>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    </div>
</div>
          <div className="owl-carousel testimonial-carousel wow fadeIn" data-wow-delay="0.3s">
            
            {/* Testimonial Item 1 */}
            <div className="testimonial-item img-border-radius bg-light border border-primary p-4">
              <div className="p-4 position-relative">
                <i className="fa fa-quote-right fa-2x text-primary position-absolute" style={{ top: '15px', right: '15px' }}></i>
                <div className="d-flex align-items-center">
                  <div className="border border-primary bg-white rounded-circle">
                    <img 
                      src="img/testimonial-2.jpg" 
                      className="rounded-circle p-2" 
                      style={{ width: '80px', height: '80px', borderStyle: 'dotted', borderColor: 'var(--bs-primary)' }} 
                      alt="" 
                    />
                  </div>
                  <div className="ms-4">
                    <h4 className="text-dark">Client Name</h4>
                    <p className="m-0 pb-3">Profession</p>
                    <div className="d-flex pe-5">
                      <i className="fas fa-star text-primary"></i>
                      <i className="fas fa-star text-primary"></i>
                      <i className="fas fa-star text-primary"></i>
                      <i className="fas fa-star text-primary"></i>
                      <i className="fas fa-star text-primary"></i>
                    </div>
                  </div>
                </div>
                <div className="border-top border-primary mt-4 pt-3">
                  <p className="mb-0">Lorem Ipsum is simply dummy text of the printing Ipsum has been the industry's standard dummy text ever since the 1500s,</p>
                </div>
              </div>
            </div>

            {/* Testimonial Item 2 */}
            <div className="testimonial-item img-border-radius bg-light border border-primary p-4">
              <div className="p-4 position-relative">
                <i className="fa fa-quote-right fa-2x text-primary position-absolute" style={{ top: '15px', right: '15px' }}></i>
                <div className="d-flex align-items-center">
                  <div className="border border-primary bg-white rounded-circle">
                    <img 
                      src="img/testimonial-2.jpg" 
                      className="rounded-circle p-2" 
                      style={{ width: '80px', height: '80px', borderStyle: 'dotted', borderColor: 'var(--bs-primary)' }} 
                      alt="" 
                    />
                  </div>
                  <div className="ms-4">
                    <h4 className="text-dark">Client Name</h4>
                    <p className="m-0 pb-3">Profession</p>
                    <div className="d-flex pe-5">
                      <i className="fas fa-star text-primary"></i>
                      <i className="fas fa-star text-primary"></i>
                      <i className="fas fa-star text-primary"></i>
                      <i className="fas fa-star text-primary"></i>
                      <i className="fas fa-star text-primary"></i>
                    </div>
                  </div>
                </div>
                <div className="border-top border-primary mt-4 pt-3">
                  <p className="mb-0">Lorem Ipsum is simply dummy text of the printing Ipsum has been the industry's standard dummy text ever since the 1500s,</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
      {/* Testimonial End */}
    </>
  );
};

export default Testimonial;