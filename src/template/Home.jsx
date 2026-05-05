import React, { useEffect } from "react";
import { WOW } from "wowjs";

export default function Home() {
  
  // Initialize Animations
  useEffect(() => {
   const timer = setTimeout(() => {
      const wow = new WOW({ live: false });
      wow.init();
    }, 100); // 100ms delay ensures the DOM is fully ready

    // Cleanup the timer if you navigate away
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
    
        {/* Hero Start */}
        <div className="container-fluid py-5 hero-header wow fadeIn" data-wow-delay="0.1s">
            <div className="container py-5">
                <div className="row g-5">
                    <div className="col-lg-7 col-md-12">
                        <h1 className="mb-3 text-primary">We Care Your Child</h1>
                        <h1 className="mb-5 display-1 text-white">The Best Play Area For Your Kids</h1>
                        <a href="" className="btn btn-primary px-4 py-3 px-md-5  me-4 btn-border-radius">Get Started</a>
                        <a href="" className="btn btn-primary px-4 py-3 px-md-5 btn-border-radius">Learn More</a>
                    </div>
                </div>
            </div>
        </div>
        {/* Hero End */}


        {/* About Start */}
        <div className="container-fluid py-5 about bg-light">
            <div className="container py-5">
                <div className="row g-5 align-items-center">
                    <div className="col-lg-5 wow fadeIn" data-wow-delay="0.1s">
                        <div className="video border">
                            <button type="button" className="btn btn-play" data-bs-toggle="modal" data-src="https://www.youtube.com/embed/DWRcNpR6Kdc" data-bs-target="#videoModal">
                                <span></span>
                            </button>
                        </div>
                    </div>
                    <div className="col-lg-7 wow fadeIn" data-wow-delay="0.3s">
                        <h4 className="text-primary mb-4 border-bottom border-primary border-2 d-inline-block p-2 title-border-radius">About Us</h4>
                        <h1 className="text-dark mb-4 display-5">We Learn Smart Way To Build Bright Futute For Your Children</h1>
                        <p className="text-dark mb-4">At ChildCare, we believe every child deserves a loving and stimulating environment to grow. Our interactive programs are designed to spark curiosity, build confidence, and foster a lifelong love of learning. Join us in laying a strong foundation for your child's success
                        </p>
                        <div className="row mb-4">
                            <div className="col-lg-6">
                                <h6 className="mb-3"><i className="fas fa-check-circle me-2"></i>Sport Activites</h6>
                                <h6 className="mb-3"><i className="fas fa-check-circle me-2 text-primary"></i>Outdoor Games</h6>
                                <h6 className="mb-3"><i className="fas fa-check-circle me-2 text-secondary"></i>Nutritious Foods</h6>
                            </div>
                            <div className="col-lg-6">
                                <h6 className="mb-3"><i className="fas fa-check-circle me-2"></i>Highly Secured</h6>
                                <h6 className="mb-3"><i className="fas fa-check-circle me-2 text-primary"></i>Friendly Environment</h6>
                                <h6><i className="fas fa-check-circle me-2 text-secondary"></i>Qualified Teacher</h6>
                            </div>
                        </div>
                        <a href="" className="btn btn-primary px-5 py-3 btn-border-radius">More Details</a>
                    </div>
                </div>
            </div>
        </div>
        {/* Modal Video */}
        <div className="modal fade" id="videoModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content rounded-0">
                    <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalLabel">Youtube Video</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        {/* 16:9 aspect ratio */}
                        <div className="ratio ratio-16x9">
                            <iframe className="embed-responsive-item" src="about:blank" id="video" allowFullScreen allow="autoplay"></iframe>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        {/* About End */}


        {/* Service Start */}
        <div className="container-fluid service py-5">
            <div className="container py-5">
                <div className="mx-auto text-center wow fadeIn" data-wow-delay="0.1s" style={{ maxWidth: "700px" }}>
                    <h4 className="text-primary mb-4 border-bottom border-primary border-2 d-inline-block p-2 title-border-radius">What We Do</h4>
                    <h1 className="mb-5 display-3">Thanks To Get Started With Our School</h1>
                </div>
                <div className="row g-5">
                    <div className="col-md-6 col-lg-6 col-xl-3 wow fadeIn" data-wow-delay="0.1s">
                        <div className="text-center border-primary border bg-white service-item">
                            <div className="service-content d-flex align-items-center justify-content-center p-4">
                                <div className="service-content-inner">
                                    <div className="p-4"><i className="fas fa-gamepad fa-6x text-primary"></i></div>
                                    <a href="#" className="h4">Study & Game</a>
                                    <p className="my-3">We seamlessly integrate interactive gamified tasks with foundational learning. By replacing traditional methods with engaging gameplay, we keep children motivated while quietly capturing authentic progress and behavioral insights.</p>
                                    <a href="#" className="btn btn-primary text-white px-4 py-2 my-2 btn-border-radius">Read More</a>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6 col-lg-6 col-xl-3 wow fadeIn" data-wow-delay="0.3s">
                        <div className="text-center border-primary border bg-white service-item">
                            <div className="service-content d-flex align-items-center justify-content-center p-4">
                                <div className="service-content-inner">
                                    <div className="p-4"><i className="fas fa-sort-alpha-down fa-6x text-primary"></i></div>
                                    <a href="#" className="h4">A to Z Programs</a>
                                    <p className="my-3">Our multi-module system offers a comprehensive suite of learning and screening tools. Each interactive program is meticulously designed to support different developmental metrics from start to finish.</p>
                                    <a href="#" className="btn btn-primary text-white px-4 py-2 my-2 btn-border-radius">Read More</a>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6 col-lg-6 col-xl-3 wow fadeIn" data-wow-delay="0.5s">
                        <div className="text-center border-primary border bg-white service-item">
                            <div className="service-content d-flex align-items-center justify-content-center p-4">
                                <div className="service-content-inner">
                                    <div className="p-4"><i className="fas fa-users fa-6x text-primary"></i></div>
                                    <a href="#" className="h4">Expert Teacher</a>
                                    <p className="my-3">Behind our advanced platform are dedicated professionals focused on actionable results. We equip educators and caregivers with intuitive, data-driven dashboards to better understand and support each child's unique needs.</p>
                                    <a href="#" className="btn btn-primary text-white px-4 py-2 my-2 btn-border-radius">Read More</a>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6 col-lg-6 col-xl-3 wow fadeIn" data-wow-delay="0.7s">
                        <div className="text-center border-primary border bg-white service-item">
                            <div className="service-content d-flex align-items-center justify-content-center p-4">
                                <div className="service-content-inner">
                                    <div className="p-4"><i className="fas fa-user-nurse fa-6x text-primary"></i></div>
                                    <a href="#" className="h4">Mental Health</a>
                                    <p className="my-3">Emotional well-being is the cornerstone of growth. Our platform monitors behavioral patterns to help identify early cognitive trends, ensuring children receive the proactive support and interventions they deserve.</p>
                                    <a href="#" className="btn btn-primary text-white px-4 py-2 my-2 btn-border-radius">Read More</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        {/* Service End */}


        {/* Programs Start */}
        <div className="container-fluid program  py-5">
            <div className="container py-5">
                <div className="mx-auto text-center wow fadeIn" data-wow-delay="0.1s" style={{ maxWidth: "700px" }}>
                    <h4 className="text-primary mb-4 border-bottom border-primary border-2 d-inline-block p-2 title-border-radius">Our Programs</h4>
                    <h1 className="mb-5 display-3">We Offer An Exclusive Program For Kids</h1>
                </div>
                <div className="row g-5 justify-content-center">
                    <div className="col-md-6 col-lg-6 col-xl-4 wow fadeIn" data-wow-delay="0.1s">
                        <div className="program-item rounded">
                            <div className="program-img position-relative">
                                <div className="overflow-hidden img-border-radius">
                                    <img src="/src/public/img/program-1.jpg" className="img-fluid w-100" alt="Image" />
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
                                <img src="/src/public/img/program-teacher.jpg" className="img-fluid rounded-circle p-2 border border-primary bg-white" alt="Image" style={{ width: "70px", height: "70px" }} />
                                <div className="ms-3">
                                    <h6 className="mb-0 text-primary">Mary Mordern</h6>
                                    <small className="text-primary">Arts Designer</small>
                                </div>
                            </div>
                            <div className="d-flex justify-content-between px-4 py-2 bg-primary rounded-bottom">
                                <small className="text-white"><i className="fas fa-wheelchair me-1"></i> 30 Sits</small>
                                <small className="text-white"><i className="fas fa-book me-1"></i> 11 Lessons</small>
                                <small className="text-white"><i className="fas fa-clock me-1"></i> 60 Hours</small>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6 col-lg-6 col-xl-4 wow fadeIn" data-wow-delay="0.3s">
                        <div className="program-item rounded">
                            <div className="program-img position-relative">
                                <div className="overflow-hidden img-border-radius">
                                    <img src="/img/program-2.jpg" className="img-fluid w-100" alt="Image" />
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
                                <img src="/img/program-teacher.jpg" className="img-fluid rounded-circle p-2 border border-primary bg-white" alt="" style={{ width: "70px", height: "70px" }} />
                                <div className="ms-3">
                                    <h6 className="mb-0 text-primary">Mary Mordern</h6>
                                    <small className="text-primary">Arts Designer</small>
                                </div>
                            </div>
                            <div className="d-flex justify-content-between px-4 py-2 bg-primary rounded-bottom">
                                <small className="text-white"><i className="fas fa-wheelchair me-1"></i> 30 Sits</small>
                                <small className="text-white"><i className="fas fa-book me-1"></i> 11 Lessons</small>
                                <small className="text-white"><i className="fas fa-clock me-1"></i> 60 Hours</small>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6 col-lg-6 col-xl-4 wow fadeIn" data-wow-delay="0.5s">
                        <div className="program-item rounded">
                            <div className="program-img position-relative">
                                <div className="overflow-hidden img-border-radius">
                                    <img src="/img/program-3.jpg" className="img-fluid w-100" alt="Image" />
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
                                <img src="/img/program-teacher.jpg" className="img-fluid rounded-circle p-2 border border-primary bg-white" alt="" style={{ width: "70px", height: "70px" }} />
                                <div className="ms-3">
                                    <h6 className="mb-0 text-primary">Mary Mordern</h6>
                                    <small className="text-primary">Arts Designer</small>
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


        {/* Events Start */}
        <div className="container-fluid events py-5 bg-light">
            <div className="container py-5">
                <div className="mx-auto text-center wow fadeIn" data-wow-delay="0.1s" style={{ maxWidth: "700px" }}>
                    <h4 className="text-primary mb-4 border-bottom border-primary border-2 d-inline-block p-2 title-border-radius">Our Events</h4>
                    <h1 className="mb-5 display-3">Our Upcoming Events</h1>
                </div>
                <div className="row g-5 justify-content-center">
                    <div className="col-md-6 col-lg-6 col-xl-4 wow fadeIn" data-wow-delay="0.1s">
                        <div className="events-item bg-primary rounded">
                            <div className="events-inner position-relative">
                                <div className="events-img overflow-hidden rounded-circle position-relative">
                                    <img src="/img/event-1.jpg" className="img-fluid w-100 rounded-circle" alt="Image" />
                                    <div className="event-overlay">
                                        <a href="/img/event-1.jpg" data-lightbox="event-1"><i className="fas fa-search-plus text-white fa-2x"></i></a>
                                    </div>
                                </div>
                                <div className="px-4 py-2 bg-secondary text-white text-center events-rate">29 Nov</div>
                                <div className="d-flex justify-content-between px-4 py-2 bg-secondary">
                                    <small className="text-white"><i className="fas fa-calendar me-1 text-primary"></i> 10:00am - 12:00pm</small>
                                    <small className="text-white"><i className="fas fa-map-marker-alt me-1 text-primary"></i> New York</small>
                                </div>
                            </div>
                            <div className="events-text p-4 border border-primary bg-white border-top-0 rounded-bottom">
                                <a href="#" className="h4">Music & drawing workshop</a>
                                <p className="mb-0 mt-3">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec sed purus consectetur,</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6 col-lg-6 col-xl-4 wow fadeIn" data-wow-delay="0.3s">
                        <div className="events-item bg-primary rounded">
                            <div className="events-inner position-relative">
                                <div className="events-img overflow-hidden rounded-circle position-relative">
                                    <img src="/img/event-2.jpg" className="img-fluid w-100 rounded-circle" alt="Image" />
                                    <div className="event-overlay">
                                        <a href="/img/event-3.jpg" data-lightbox="event-1"><i className="fas fa-search-plus text-white fa-2x"></i></a>
                                    </div>
                                </div>
                                <div className="px-4 py-2 bg-secondary text-white text-center events-rate">29 Nov</div>
                                <div className="d-flex justify-content-between px-4 py-2 bg-secondary">
                                    <small className="text-white"><i className="fas fa-calendar me-1 text-primary"></i> 10:00am - 12:00pm</small>
                                    <small className="text-white"><i className="fas fa-map-marker-alt me-1 text-primary"></i> New York</small>
                                </div>
                            </div>
                            <div className="events-text p-4 border border-primary bg-white border-top-0 rounded-bottom">
                                <a href="#" className="h4">Why need study</a>
                                <p className="mb-0 mt-3">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec sed purus consectetur,</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6 col-lg-6 col-xl-4 wow fadeIn" data-wow-delay="0.5s">
                        <div className="events-item bg-primary rounded">
                            <div className="events-inner position-relative">
                                <div className="events-img overflow-hidden rounded-circle position-relative">
                                    <img src="/img/event-3.jpg" className="img-fluid w-100 rounded-circle" alt="Image" />
                                    <div className="event-overlay">
                                        <a href="/img/event-3.jpg" data-lightbox="event-1"><i className="fas fa-search-plus text-white fa-2x"></i></a>
                                    </div>
                                </div>
                                <div className="px-4 py-2 bg-secondary text-white text-center events-rate">29 Nov</div>
                                <div className="d-flex justify-content-between px-4 py-2 bg-secondary">
                                    <small className="text-white"><i className="fas fa-calendar me-1 text-primary"></i> 10:00am - 12:00pm</small>
                                    <small className="text-white"><i className="fas fa-map-marker-alt me-1 text-primary"></i> New York</small>
                                </div>
                            </div>
                            <div className="events-text p-4 border border-primary bg-white border-top-0 rounded-bottom">
                                <a href="#" className="h4">Child health consciousness</a>
                                <p className="mb-0 mt-3">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec sed purus consectetur,</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        {/* Events End*/}


        {/* Blog Start*/}
        <div className="container-fluid blog py-5">
            <div className="container py-5">
                <div className="mx-auto text-center wow fadeIn" data-wow-delay="0.1s" style={{ maxWidth: "600px" }}>
                    <h4 className="text-primary mb-4 border-bottom border-primary border-2 d-inline-block p-2 title-border-radius">Latest News & Blog</h4>
                    <h1 className="mb-5 display-3">Read Our Latest News & Blog</h1>
                </div>
                <div className="row g-5 justify-content-center">
                    <div className="col-md-6 col-lg-6 col-xl-4 wow fadeIn" data-wow-delay="0.1s">
                        <div className="blog-item rounded-bottom">
                            <div className="blog-img overflow-hidden position-relative img-border-radius">
                                <img src="/img/blog-1.jpg" className="img-fluid w-100" alt="Image" />
                            </div>
                            <div className="d-flex justify-content-between px-4 py-3 bg-light border-bottom border-primary blog-date-comments">
                                <small className="text-dark"><i className="fas fa-calendar me-1 text-dark"></i> 29 Nov 2023</small>
                                <small className="text-dark"><i className="fas fa-comment-alt me-1 text-dark"></i> Comments (15)</small>
                            </div>
                            <div className="blog-content d-flex align-items-center px-4 py-3 bg-light">
                                <div className="overflow-hidden rounded-circle rounded-top border border-primary">
                                    <img src="/img/program-teacher.jpg" className="img-fluid rounded-circle p-2 rounded-top" alt="Image" style={{ width: "70px", height: "70px", borderStyle: "dotted", borderColor: "var(--bs-primary)" }} />
                                </div>
                                <div className="ms-3">
                                    <h6 className="text-primary">Mary Mordern</h6>
                                    <p className="text-muted">Baby Care</p>
                                </div>
                            </div>
                            <div className="px-4 pb-4 bg-light rounded-bottom">
                                <div className="blog-text-inner">
                                    <a href="#" className="h4">How to pay attention to your child?</a>
                                    <p className="mt-3 mb-4">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec sed purus</p>
                                </div>
                                <div className="text-center">
                                    <a href="#" className="btn btn-primary text-white px-4 py-2 mb-3 btn-border-radius">View Details</a>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6 col-lg-6 col-xl-4 wow fadeIn" data-wow-delay="0.3s">
                        <div className="blog-item rounded-bottom">
                            <div className="blog-img overflow-hidden position-relative img-border-radius">
                                <img src="/img/blog-2.jpg" className="img-fluid w-100" alt="Image" />
                            </div>
                            <div className="d-flex justify-content-between px-4 py-3 bg-light border-bottom border-primary blog-date-comments">
                                <small className="text-dark"><i className="fas fa-calendar me-1 text-dark"></i> 29 Nov 2023</small>
                                <small className="text-dark"><i className="fas fa-comment-alt me-1 text-dark"></i> Comments (15)</small>
                            </div>
                            <div className="blog-content d-flex align-items-center px-4 py-3 bg-light">
                                <div className="overflow-hidden rounded-circle rounded-top border border-primary">
                                    <img src="/img/program-teacher.jpg" className="img-fluid rounded-circle p-2 rounded-top" alt="" style={{ width: "70px", height: "70px", borderStyle: "dotted", borderColor: "var(--bs-primary)" }} />
                                </div>
                                <div className="ms-3">
                                    <h6 className="text-primary">Mary Mordern</h6>
                                    <p className="text-muted">Baby Care</p>
                                </div>
                            </div>
                            <div className="px-4 pb-4 bg-light rounded-bottom">
                                <div className="blog-text-inner">
                                    <a href="#" className="h4">Play outdoor sports with your child</a>
                                    <p className="mt-3 mb-4">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec sed purus</p>
                                </div>
                                <div className="text-center">
                                    <a href="#" className="btn btn-primary text-white px-4 py-2 mb-3 btn-border-radius">View Details</a>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6 col-lg-6 col-xl-4 wow fadeIn" data-wow-delay="0.5s">
                        <div className="blog-item rounded-bottom">
                            <div className="blog-img overflow-hidden position-relative img-border-radius">
                                <img src="/img/blog-3.jpg" className="img-fluid w-100" alt="Image" />
                            </div>
                            <div className="d-flex justify-content-between px-4 py-3 bg-light border-bottom border-primary blog-date-comments">
                                <small className="text-dark"><i className="fas fa-calendar me-1 text-dark"></i> 29 Nov 2023</small>
                                <small className="text-dark"><i className="fas fa-comment-alt me-1 text-dark"></i> Comments (15)</small>
                            </div>
                            <div className="blog-content d-flex align-items-center px-4 py-3 bg-light">
                                <div className="overflow-hidden rounded-circle rounded-top border border-primary">
                                    <img src="/img/program-teacher.jpg" className="img-fluid rounded-circle p-2 rounded-top" alt="" style={{ width: "70px", height: "70px", borderStyle: "dotted", borderColor: "var(--bs-primary)" }} />
                                </div>
                                <div className="ms-3">
                                    <h6 className="text-primary">Mary Mordern</h6>
                                    <p className="text-muted">Baby Care</p>
                                </div>
                            </div>
                            <div className="px-4 pb-4 bg-light rounded-bottom">
                                <div className="blog-text-inner">
                                    <a href="#" className="h4">How to make time for your kids?</a>
                                    <p className="mt-3 mb-4">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec sed purus</p>
                                </div>
                                <div className="text-center">
                                    <a href="#" className="btn btn-primary text-white px-4 py-2 mb-3 btn-border-radius">View Details</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        {/* Blog End*/}


        {/* Team Start*/}
        <div className="container-fluid team py-5">
            <div className="container py-5">
                <div className="mx-auto text-center wow fadeIn" data-wow-delay="0.1s" style={{ maxWidth: "600px" }}>
                    <h4 className="text-primary mb-4 border-bottom border-primary border-2 d-inline-block p-2 title-border-radius">Our Team</h4>
                    <h1 className="mb-5 display-3">Meet With Our Expert Teacher</h1>
                </div>
                <div className="row g-5 justify-content-center">
                    <div className="col-md-6 col-lg-4 col-xl-3 wow fadeIn" data-wow-delay="0.1s">
                        <div className="team-item border border-primary img-border-radius overflow-hidden">
                            <img src="/img/team-1.jpg" className="img-fluid w-100" alt="" />
                            <div className="team-icon d-flex align-items-center justify-content-center">
                                <a className="share btn btn-primary btn-md-square text-white rounded-circle me-3" href=""><i className="fas fa-share-alt"></i></a>
                                <a className="share-link btn btn-primary btn-md-square text-white rounded-circle me-3" href=""><i className="fab fa-facebook-f"></i></a>
                                <a className="share-link btn btn-primary btn-md-square text-white rounded-circle me-3" href=""><i className="fab fa-twitter"></i></a>
                                <a className="share-link btn btn-primary btn-md-square text-white rounded-circle" href=""><i className="fab fa-instagram"></i></a>
                            </div>
                            <div className="team-content text-center py-3">
                                <h4 className="text-primary">Linda Carlson</h4>
                                <p className="text-muted mb-2">English Teacher</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6 col-lg-4 col-xl-3 wow fadeIn" data-wow-delay="0.3s">
                        <div className="team-item border border-primary img-border-radius overflow-hidden">
                            <img src="/img/team-2.jpg" className="img-fluid w-100" alt="" />
                            <div className="team-icon d-flex align-items-center justify-content-center">
                                <a className="share btn btn-primary btn-md-square text-white rounded-circle me-3" href=""><i className="fas fa-share-alt"></i></a>
                                <a className="share-link btn btn-primary btn-md-square text-white rounded-circle me-3" href=""><i className="fab fa-facebook-f"></i></a>
                                <a className="share-link btn btn-primary btn-md-square text-white rounded-circle me-3" href=""><i className="fab fa-twitter"></i></a>
                                <a className="share-link btn btn-primary btn-md-square text-white rounded-circle" href=""><i className="fab fa-instagram"></i></a>
                            </div>
                            <div className="team-content text-center py-3">
                                <h4 className="text-primary">Linda Carlson</h4>
                                <p className="text-muted mb-2">English Teacher</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6 col-lg-4 col-xl-3 wow fadeIn" data-wow-delay="0.5s">
                        <div className="team-item border border-primary img-border-radius overflow-hidden">
                            <img src="/img/team-3.jpg" className="img-fluid w-100" alt="" />
                            <div className="team-icon d-flex align-items-center justify-content-center">
                                <a className="share btn btn-primary btn-md-square text-white rounded-circle me-3" href=""><i className="fas fa-share-alt"></i></a>
                                <a className="share-link btn btn-primary btn-md-square text-white rounded-circle me-3" href=""><i className="fab fa-facebook-f"></i></a>
                                <a className="share-link btn btn-primary btn-md-square text-white rounded-circle me-3" href=""><i className="fab fa-twitter"></i></a>
                                <a className="share-link btn btn-primary btn-md-square text-white rounded-circle" href=""><i className="fab fa-instagram"></i></a>
                            </div>
                            <div className="team-content text-center py-3">
                                <h4 className="text-primary">Linda Carlson</h4>
                                <p className="text-muted mb-2">English Teacher</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6 col-lg-4 col-xl-3 wow fadeIn" data-wow-delay="0.7s">
                        <div className="team-item border border-primary img-border-radius overflow-hidden">
                            <img src="/img/team-4.jpg" className="img-fluid w-100" alt="" />
                            <div className="team-icon d-flex align-items-center justify-content-center">
                                <a className="share btn btn-primary btn-md-square text-white rounded-circle me-3" href=""><i className="fas fa-share-alt"></i></a>
                                <a className="share-link btn btn-primary btn-md-square text-white rounded-circle me-3" href=""><i className="fab fa-facebook-f"></i></a>
                                <a className="share-link btn btn-primary btn-md-square text-white rounded-circle me-3" href=""><i className="fab fa-twitter"></i></a>
                                <a className="share-link btn btn-primary btn-md-square text-white rounded-circle" href=""><i className="fab fa-instagram"></i></a>
                            </div>
                            <div className="team-content text-center py-3">
                                <h4 className="text-primary">Linda Carlson</h4>
                                <p className="text-muted mb-2">English Teacher</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        {/* Team End*/}


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
        {/* Testimonial End */}
    </>
  );
}