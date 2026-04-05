import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  Target,
  Award,
  Users,
  Rocket,
  CheckCircle,
  ShieldCheck,
} from "lucide-react";
import Counter from "@/components/Counter";

export default function About() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      {/* Page Header */}
      <section className="bg-purple-900 text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-1/2 translate-y-1/2"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6">
            About Royal Hire Consulting
          </h1>
          <p className="text-xl text-purple-100 max-w-3xl mx-auto">
            Bridging the gap between potential and professional excellence since
            2018.
          </p>
        </div>
      </section>

      {/* Story & Founder Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16 items-center flex-row-reverse">
            <div className="order-2 md:order-1 relative">
              <div className="aspect-[4/5] bg-purple-100 rounded-[2rem] overflow-hidden shadow-2xl relative group">
                <img
                  src="/founder.jpg"
                  alt="Founder of Royal Hire Consulting"
                  className="w-full h-full object-cover grayscale transition duration-700 group-hover:grayscale-0 scale-105 group-hover:scale-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-purple-900/80 via-transparent to-transparent opacity-60"></div>
                <div className="absolute bottom-10 left-10 text-white">
                  <div className="bg-yellow-400 text-purple-900 text-[10px] font-black uppercase tracking-wide px-3 py-1 rounded-full mb-3 inline-block">
                    Founder & CEO
                  </div>
                  <h3 className="text-3xl font-black tracking-wide">Mrs <br />Clare Onyegbu</h3>
                  <p className="text-purple-100 font-medium">
                    Visionary behind Royal Hire
                  </p>
                </div>
              </div>

              {/* Accredited Badge */}
              <div className="relative mt-12 md:mt-0 md:absolute md:-bottom-10 md:-right-6 bg-white p-8 rounded-3xl shadow-2xl border border-purple-50 w-fit mx-auto md:w-auto md:max-w-[280px] group transition-transform md:hover:-translate-y-2">
                <div className="flex items-start gap-5">
                  <div className="w-14 h-14 bg-purple-700 rounded-2xl flex items-center justify-center text-white flex-shrink-0 shadow-lg shadow-purple-200">
                    <Award size={32} />
                  </div>
                  <div>
                    <div className="font-black text-gray-900 leading-tight mb-1 uppercase tracking-tight">
                      Accredited Excellence
                    </div>
                    <div className="text-[11px] text-gray-500 font-bold uppercase tracking-wide leading-relaxed">
                      ISO 9001:2015 Certified <br />
                      <span className="text-purple-600">
                        Accredited Training Provider
                      </span>
                    </div>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-50 flex gap-2">
                  <CheckCircle size={14} className="text-green-500" />
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    Global Standards
                  </span>
                </div>
              </div>
            </div>

            <div className="order-1 md:order-2 space-y-8">
              <div>
                <h2 className="text-4xl font-black text-gray-900 mb-6 leading-tight">
                  Our Story & <br />
                  <span className="text-purple-700">Founder's Vision</span>
                </h2>
                <p className="text-gray-600 text-lg leading-relaxed">
                  Royal Hire Consulting was founded with a singular vision: to
                  empower individuals with the critical skills required to
                  navigate and thrive in the modern corporate landscape.
                </p>
              </div>

              <p className="text-gray-500 leading-relaxed italic border-l-4 border-yellow-400 pl-6 text-xl">
                "We believe that talent is everywhere, but opportunity and
                guidance are not. Our mission is to democratize professional
                excellence."
              </p>

              <p className="text-gray-600 leading-relaxed">
                Under the leadership of our founder, **Laughter Irolewe**, we
                have evolved into a premier learning and consultancy powerhouse.
                We focus on producing world-class professionals through
                structured, results-driven programs that are globally recognized
                and fully accredited.
              </p>

              <div className="grid grid-cols-2 gap-8 pt-6">
                <div className="space-y-1">
                  <div className="text-4xl font-black text-purple-700">
                    <Counter n={5} suffix="k+" />
                  </div>
                  <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                    Professionals Trained
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-4xl font-black text-purple-700">
                    <Counter n={98} suffix="%" />
                  </div>
                  <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                    Success Rate
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 bg-gray-50 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tighter">
              Our Core Foundations
            </h2>
            <div className="w-20 h-1.5 bg-purple-700 mx-auto mt-4 rounded-full"></div>
          </div>
          <div className="grid md:grid-cols-3 gap-10">
            {[
              {
                icon: <Target size={32} />,
                title: "Precision",
                desc: "We focus on the exact skills that translate to immediate value in the workplace.",
              },
              {
                icon: <Rocket size={32} />,
                title: "Innovation",
                desc: "Our curriculum evolves faster than the market to keep our students ahead.",
              },
              {
                icon: <ShieldCheck size={32} />,
                title: "Integrity",
                desc: "High standards of ethical conduct in every professional interaction.",
              },
            ].map((value, i) => (
              <div
                key={i}
                className="bg-white p-10 rounded-3xl shadow-sm hover:shadow-xl transition duration-500 group border border-gray-100"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-50 text-purple-700 rounded-2xl mb-8 group-hover:bg-purple-700 group-hover:text-white transition duration-500">
                  {value.icon}
                </div>
                <h3 className="text-2xl font-black mb-4 text-gray-900">
                  {value.title}
                </h3>
                <p className="text-gray-500 leading-relaxed font-medium">
                  {value.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
