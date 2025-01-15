"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const services = [
    {
        id: 1,
        icon: "/service-1.jpg",
        title: "Structural Design",
        description:
            "The Design Department of Sytem Steel is staffed with highly experienced Structural Engineers who specialize in designing complete Steel Frames and Connections, adhering to the latest British and American Codes. We utilize advanced software such as ETABS, SAP, and STAAD for member design, and IDEA STATICA for Connection Design. With nearly two decades of experience coordinating & collaborating with Local Authorities, we have a streamlined approval process that sets us apart from our competitors.",
    },
    {
        id: 2,
        icon: "/service-2.jpg",
        title: "Detailing Service & BIM",
        description:
            "System Steel Engineering LLC has extensive experience in using Tekla Structures and BIM (Building Information Modeling) on building projects. We primarily utilize Tekla Structures for Modeling, detailing & manufacturing. We also have significant expertise in CAD, which is employed throughout our value chain, customer interactions, internal processes, and engagement with supply chain partners. BIM has become increasingly crucial for collaboration within the construction supply chain, involving design and detailing teams, professionals, and trade contractors. This results in improved visualization, enhanced coordination in designs, and a common understanding of building functionality and specifications right from the project's inception. The widespread adoption of BIM has led to numerous shared benefits for both System Steel Engineering LLC and our customers.",
    },
    {
        id: 3,
        icon: "/service-3.jpg",
        title: "Fabrication",
        description:
            "Our company boasts an exceptionally skilled and experienced workforce capable of handling a wide range of fabrication projects with utmost precision and quality. To guarantee the highest standards, we have implemented rigorous quality control procedures as an integral part of our ISO 9001 certified Quality Management System. These procedures ensure that all our steelwork is fabricated in accordance with international standards and within specified tolerances.",
    },
    {
        id: 4,
        icon: "/service-4.jpg",
        title: "Painting / Surface Treatment",
        description:
            "System Steel Engineering LLC offers a comprehensive painting service for its steelwork, catering to even the most demanding specifications and turnaround times. Our capabilities include shot blasting, epoxy/polyurethane coating, galvanizing, and other finishes as required by project specifications. We also offer specialized finishes for stainless steel such as mirror, brush/satin, or hairline finishes.",
    },
    {
        id: 5,
        icon: "/service-5.jpg",
        title: "Steelwork Erection",
        description:
            "We provide efficient and precise steelwork erection services. Our experienced team ensures the highest quality standards, complying with international guidelines and tolerances. By utilizing modern techniques and an ISO 9001 certified Quality Management System, we deliver outstanding results that exceed client expectations.",
    },
    {
        id: 6,
        icon: "/service-6.jpg",
        title: "Decking Roofing & Cladding",
        description:
            "We offer a complete package of steelwork, decking, roofing, and cladding solutions. With expertise in multiple product groups like insulated panel systems, decking profiles, and architectural façades, we deliver tailored solutions that meet diverse client needs while supporting sustainability and energy efficiency goals.",
    },
    {
        id: 7,
        icon: "/service-7.jpg",
        title: "Value Engineering",
        description:
            "System Steel Engineering LLC is frequently approached by customers seeking a review of their pre-designed projects, with a focus on identifying opportunities for cost savings and value creation. With our extensive expertise in steel construction and the overall construction process, our design team is well-equipped to provide valuable advice that often leads to significant savings in program durations, material usage, fabrication, and erection costs. We take pride in offering in-depth consultation services aimed at helping our customers achieve cost efficiencies and maximize profitability in their projects. By leveraging our knowledge and experience, we provide valuable insights and recommendations that set us apart as a trusted partner in optimizing the success of construction schemes.",
    },
    
];

export default function Services() {
    const [selectedService, setSelectedService] = useState<number>(1);

    const handleTabClick = (id: number) => {
        setSelectedService(id);
    };

    const selectedServiceData = services.find(
        (service) => service.id === selectedService
    );

    return (
        <div className="min-h-screen flex flex-col bg-white">
            <Navbar />

            <main className="flex-1 py-20 px-4 bg-gray-50">
                <div className="max-w-6xl mx-auto">
                    {/* Hero Section */}
                    <section className="relative h-96 mb-16">
                        <Image
                            src="/service-banner.jpg"
                            alt="Our Services"
                            layout="fill"
                            objectFit="cover"
                            className="brightness-50 rounded-xl"
                        />
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-4">
                            <h1 className="text-4xl font-bold mb-4">Our Services</h1>
                            <p className="text-lg">
                                Advanced Steel Solutions Tailored to Your Needs
                            </p>
                        </div>
                    </section>

                    {/* Tabbed Services Section */}
                    <section className="bg-white p-6 rounded-xl shadow-sm">
                        <div className="flex flex-col">
                            {/* Services Menu (Top) */}
                            <div className="flex flex-wrap space-x-0 sm:space-x-4 mb-6">
                                {services.map((service) => (
                                    <div
                                        key={service.id}
                                        onClick={() => handleTabClick(service.id)}
                                        className={`w-full sm:w-auto p-4 rounded-lg cursor-pointer transition-all ${
                                            selectedService === service.id
                                                ? "bg-blue-50 border-b-4 border-blue-500"
                                                : "hover:bg-gray-50"
                                        } mb-4 sm:mb-0`}
                                    >
                                        <h3 className="font-medium text-gray-800 text-center sm:text-left">
                                            {service.title}
                                        </h3>
                                    </div>
                                ))}
                            </div>

                            {/* Service Content (Below) */}
                            <div className="bg-gray-50 p-8 rounded-xl">
                                {selectedServiceData && (
                                    <div className="flex flex-col lg:flex-row items-start gap-8">
                                        <div>
                                            <h2 className="text-3xl font-bold text-gray-800">
                                                {selectedServiceData.title}
                                            </h2>
                                            <p className="text-gray-600 text-lg leading-relaxed mt-4">
                                                {selectedServiceData.description}
                                            </p>
                                        </div>
                                        <Image
                                            src={selectedServiceData.icon}
                                            alt={selectedServiceData.title}
                                            width={500}
                                            height={500}
                                            className="object-contain"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    </section>
                </div>
            </main>

            <Footer />
        </div>
    );
}
