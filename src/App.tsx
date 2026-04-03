/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  CreditCard, 
  ChevronRight, 
  Trophy, 
  AlertCircle, 
  CheckCircle2, 
  Phone, 
  Mail, 
  ExternalLink,
  ArrowRight,
  Plus
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { createClient } from '@supabase/supabase-js';

// --- Supabase Client ---
const supabase = createClient(
  'https://dklzqwcgboolzisqngei.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRrbHpxd2NnYm9vbHppc3FuZ2VpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgxNDcxNzEsImV4cCI6MjA4MzcyMzE3MX0.TEqgRDBCHGJJJsOoLdUfXlKXmnR6m_J5woumAjOtw9E'
);

// --- Types ---
interface FormData {
  college: string;
  otherCollege: string;
  teamName: string;
  leaderName: string;
  leaderRoll: string;
  leaderDept: string;
  leaderYear: string;
  leaderMobile: string;
  leaderEmail: string;
  member2Name: string;
  member2Roll: string;
  member3Name: string;
  member3Roll: string;
  transactionId: string;
}

interface FormErrors {
  [key: string]: string;
}

export default function App() {
  const [formData, setFormData] = useState<FormData>({
    college: "NNRG - Nalla Narasimha Reddy Education Society's Group of Institutions",
    otherCollege: "",
    teamName: "",
    leaderName: "",
    leaderRoll: "",
    leaderDept: "CSE",
    leaderYear: "1st Year",
    leaderMobile: "",
    leaderEmail: "",
    member2Name: "",
    member2Roll: "",
    member3Name: "",
    member3Roll: "",
    transactionId: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registrationCount, setRegistrationCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  const formRef = useRef<HTMLDivElement>(null);

  const calculateTimeLeft = () => {
    const eventDate = new Date('2027-02-26T09:30:00').getTime();
    const now = new Date().getTime();
    const difference = eventDate - now;

    if (difference > 0) {
      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60)
      });
    }
  };

  const fetchCount = async () => {
    try {
      const { count } = await supabase
        .from('techtitan')
        .select('*', { count: 'exact', head: true });
      setRegistrationCount(count ?? 0);
    } catch (error) {
      console.error('Error fetching count:', error);
    }
  };

  useEffect(() => {
    fetchCount();
    calculateTimeLeft();
    const countInterval = setInterval(fetchCount, 30000);
    const timerInterval = setInterval(calculateTimeLeft, 1000);
    return () => {
      clearInterval(countInterval);
      clearInterval(timerInterval);
    };
  }, []);

  const colleges = [
    "NNRG - Nalla Narasimha Reddy Education Society's Group of Institutions",
    "GCTC - Geethanjali College of Engineering and Technology",
    "KPRIT - Kommuri Pratap Reddy Institute of Technology",
    "SITS - Siddhartha Institute of Technology & Sciences",
    "ANURAG - Anurag University, Hyderabad",
    "NMREC - Nalla Malla Reddy Engineering College",
    "Other"
  ];

  const departments = ["CSE", "CSE (AI&ML)", "CSE (DS)", "ECE", "CIVIL", "IT"];
  const years = ["1st Year", "2nd Year", "3rd Year", "4th Year"];

  const validate = () => {
    const newErrors: FormErrors = {};
    if (!formData.college) newErrors.college = "College is required";
    if (formData.college === "Other" && !formData.otherCollege) newErrors.otherCollege = "Please specify your college";
    if (!formData.teamName) newErrors.teamName = "Team name is required";
    if (!formData.leaderName) newErrors.leaderName = "Leader name is required";
    if (!formData.leaderRoll) newErrors.leaderRoll = "Roll number is required";
    if (!formData.leaderDept) newErrors.leaderDept = "Department is required";
    if (!formData.leaderYear) newErrors.leaderYear = "Year is required";
    if (!formData.leaderMobile) newErrors.leaderMobile = "Mobile number is required";
    if (!/^\d{10}$/.test(formData.leaderMobile)) newErrors.leaderMobile = "Enter a valid 10-digit mobile number";
    if (!formData.transactionId) newErrors.transactionId = "Transaction ID is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      setIsSubmitting(true);
      
      const collegeName = formData.college === "Other" ? formData.otherCollege : formData.college;
      
      // Save to Supabase
      const { error } = await supabase
        .from('techtitan')
        .insert([{
          college: collegeName,
          name: formData.leaderName,
          roll_number: formData.leaderRoll,
          department: formData.leaderDept,
          year: formData.leaderYear,
          mobile_no: formData.leaderMobile,
          e_mail: formData.leaderEmail || null,
          transaction_id: formData.transactionId
        }]);

      if (error) {
        console.error('Supabase error:', error);
      } else {
        console.log('Saved successfully!');
        fetchCount();
      }
      
      const message = `━━━━━━━━━━━━━━━━━━━━━━━
Hello! I have registered for *TECHTITAN*
event at NNRG Tech Fest 2027.

*Team Details:*
━━━━━━━━━━━━━━━━
College: ${collegeName}
Team Name: ${formData.teamName}

*Team Leader:*
Name: ${formData.leaderName}
Roll No: ${formData.leaderRoll}
Department: ${formData.leaderDept}
Year: ${formData.leaderYear}
Mobile: ${formData.leaderMobile}
Email: ${formData.leaderEmail || "Not provided"}

${formData.member2Name ? `*Member 2:*
Name: ${formData.member2Name}
Roll No: ${formData.member2Roll || "Not provided"}
` : ""}
${formData.member3Name ? `*Member 3:*
Name: ${formData.member3Name}
Roll No: ${formData.member3Roll || "Not provided"}
` : ""}
*Payment Details:*
Amount Paid: ₹300
Transaction ID: ${formData.transactionId}
━━━━━━━━━━━━━━━━
Please verify my payment and confirm
my registration for TechTitan.
Thank you! 🙏
━━━━━━━━━━━━━━━━━━━━━━━`;

      const whatsappUrl = `https://wa.me/918309030400?text=${encodeURIComponent(message)}`;
      
      setTimeout(() => {
        window.open(whatsappUrl, '_blank');
        setIsSubmitting(false);
      }, 800);
    } else {
      // Scroll to first error
      const firstError = document.querySelector('.text-red-500');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const scrollToRegister = () => {
    document.getElementById('register')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen font-sans text-white selection:bg-red-600 selection:text-white">
      {/* --- HERO SECTION --- */}
      <section className="relative h-screen w-full overflow-hidden bg-[#0D1117] flex items-center justify-center px-6">
        {/* Background Layers */}
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center opacity-55"
          style={{ backgroundImage: 'url("https://res.cloudinary.com/djz4ulfhh/image/upload/v1774019432/techtitans_p6twvd.png")' }}
        />
        <div className="absolute inset-0 z-1 bg-gradient-to-r from-[#0D1117]/97 via-[#0D1117]/75 to-[#0D1117]/25" />
        <div className="absolute inset-0 z-1 bg-gradient-to-b from-transparent via-transparent to-[#0D1117]/97" />

        {/* Floating Snippets */}
        <div className="absolute inset-0 pointer-events-none opacity-20">
          {[
            { text: "quiz.start()", top: "15%", left: "10%" },
            { text: "while(thinking) {}", top: "25%", left: "60%" },
            { text: "score += points;", top: "45%", left: "20%" },
            { text: "if(correct) win;", top: "70%", left: "75%" },
            { text: "return answer;", top: "85%", left: "40%" },
          ].map((snippet, i) => (
            <span 
              key={i} 
              className="absolute font-mono text-[13px] text-[#DC2626]"
              style={{ top: snippet.top, left: snippet.left }}
            >
              {snippet.text}
            </span>
          ))}
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-4xl w-full text-center flex flex-col items-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-6 font-mono text-[11px] text-white/35"
          >
            visitor@nnrg:~$ ./launch techtitan --year=2027
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-block bg-[#DC2626] text-white text-[11px] font-bold px-4 py-1.5 rounded-full tracking-wider mb-6"
          >
            QUIZ COMPETITION
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-[56px] md:text-[100px] font-[900] leading-none tracking-[-3px] mb-4"
          >
            TECH <span className="text-[#EF4444] drop-shadow-[0_0_15px_rgba(239,68,68,0.3)]">TITAN</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-lg md:text-xl text-white/70 mb-10"
          >
            Technical quiz competition
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="flex flex-wrap items-center justify-center gap-y-4 mb-10 text-[13px] text-white/90"
          >
            <div className="flex items-center gap-2 pr-4 border-r border-white/10 last:border-0">
              <Calendar size={16} className="text-[#EF4444]" />
              <span>Feb 26, 2027</span>
            </div>
            <div className="flex items-center gap-2 px-4 border-r border-white/10 last:border-0">
              <Clock size={16} className="text-[#EF4444]" />
              <span>9:30 AM</span>
            </div>
            <div className="flex items-center gap-2 px-4 border-r border-white/10 last:border-0">
              <MapPin size={16} className="text-[#EF4444]" />
              <span>Lab 11</span>
            </div>
            <div className="flex items-center gap-2 px-4 border-r border-white/10 last:border-0">
              <Users size={16} className="text-[#EF4444]" />
              <span>1-3 Members</span>
            </div>
            <div className="flex items-center gap-2 pl-4">
              <CreditCard size={16} className="text-[#EF4444]" />
              <span>₹300/team</span>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="flex gap-4 md:gap-6 mb-8 mt-4"
          >
            {[
              { label: 'DD', value: timeLeft.days },
              { label: 'HH', value: timeLeft.hours },
              { label: 'MM', value: timeLeft.minutes },
              { label: 'SS', value: timeLeft.seconds },
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className="bg-white/5 border border-white/10 backdrop-blur-sm rounded-lg w-14 h-14 md:w-16 md:h-16 flex items-center justify-center mb-2">
                  <span className="text-[#EF4444] text-xl md:text-2xl font-black font-mono">
                    {String(item.value).padStart(2, '0')}
                  </span>
                </div>
                <span className="text-white/30 text-[9px] font-bold tracking-[2px] uppercase">{item.label}</span>
              </div>
            ))}
          </motion.div>

          <motion.button
            onClick={scrollToRegister}
            whileHover={{ scale: 1.02, backgroundColor: '#B91C1C' }}
            whileTap={{ scale: 0.98 }}
            className="w-full max-w-[500px] mt-6 py-[18px] bg-[#DC2626] text-white font-bold text-[15px] rounded-xl shadow-[0_0_25px_rgba(220,38,38,0.5)] transition-all flex items-center justify-center gap-3"
          >
            ↓ Register Now →
          </motion.button>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-3 bg-blue-500/12 border border-blue-500/40 rounded-full px-6 py-2.5 backdrop-blur-md shadow-[0_0_30px_rgba(59,130,246,0.2)] mt-8"
          >
            <div className="w-2.5 h-2.5 bg-[#3B82F6] rounded-full shadow-[0_0_10px_rgba(59,130,246,0.8)] animate-pulse" />
            <span className="text-white text-[13px] font-bold tracking-[3px] uppercase">
              LIVE  •  <span className="text-[#3B82F6] text-[18px] font-black">{registrationCount}</span> REGISTERED
            </span>
            <span className="text-blue-500/70 text-[16px]">👥</span>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="mt-12 text-white text-[26px] md:text-[36px] font-bold tracking-tight drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)]"
          >
            Organizing by <span className="text-[#3B82F6] font-black drop-shadow-[0_0_20px_rgba(59,130,246,0.8)]">AI & ML Department</span>
          </motion.div>

          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 text-white/20 text-[10px] tracking-[4px] font-bold">
            ↓ SCROLL TO EXPLORE ↓
          </div>
        </div>
      </section>

      {/* --- EVENT DETAILS --- */}
      <section className="py-24 bg-[#F5F5F5] px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-[36px] font-[900] text-[#DC2626] text-center uppercase tracking-[3px] mb-16">
            EVENT DETAILS
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              { label: "DATE", value: "Feb 26, 2027", icon: <Calendar size={20} /> },
              { label: "TIME", value: "9:30 AM", icon: <Clock size={20} /> },
              { label: "VENUE", value: "Lab 11", icon: <MapPin size={20} /> },
              { label: "TEAM", value: "1-3 Members", icon: <Users size={20} /> },
              { label: "FEE", value: "₹300 / Team", icon: <CreditCard size={20} /> },
            ].map((item, i) => (
              <motion.div 
                key={i}
                whileHover={{ borderColor: 'rgba(220,38,38,0.4)' }}
                className="bg-[#0D1B2A] rounded-2xl p-7 text-center border border-white/5 transition-all"
              >
                <div className="text-[#9CA3AF] text-[11px] uppercase tracking-[2px] mb-3">{item.label}</div>
                <div className="text-[#EF4444] font-bold text-[16px]">{item.value}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- EVENT ROUNDS --- */}
      <section className="py-24 bg-[#F5F5F5] px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-[36px] font-[900] text-[#DC2626] text-center uppercase tracking-[3px] mb-16">
            EVENT ROUNDS
          </h2>

          <div className="space-y-4">
            {/* Round 1 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-[#0D1B2A] rounded-2xl p-7 md:p-10 border border-white/5"
            >
              <div className="flex flex-col md:flex-row md:items-center gap-6 mb-8">
                <div className="w-10 h-10 bg-[#DC2626] rounded-xl flex items-center justify-center font-bold text-white shrink-0">1</div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">Online Quiz</h3>
                  <p className="text-[#6e7681] text-[12px]">⏱ 60 Seconds/Question | Computer Based</p>
                </div>
              </div>
              
              <ul className="space-y-4 mb-8">
                {[
                  "50 computer-based questions",
                  "Multiple-choice, true/false, image identification",
                  "60 seconds per question",
                  "Computer-based subjects",
                  "Top 10 teams advance to Round 2"
                ].map((bullet, i) => (
                  <li key={i} className="flex items-start gap-3 text-[14px] text-white/80">
                    <span className="text-[#DC2626] mt-1">►</span>
                    {bullet}
                  </li>
                ))}
              </ul>

              <div className="bg-[#DC2626]/8 border-l-4 border-[#DC2626] p-4 rounded-r-lg">
                <p className="text-[#EF4444] font-bold text-sm">🏆 Top 10 teams advance to Round 2</p>
              </div>
            </motion.div>

            {/* Round 2 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-[#0D1B2A] rounded-2xl p-7 md:p-10 border border-white/5"
            >
              <div className="flex flex-col md:flex-row md:items-center gap-6 mb-8">
                <div className="w-10 h-10 bg-[#22C55E] rounded-xl flex items-center justify-center font-bold text-white shrink-0">2</div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">Rapid Fire</h3>
                  <p className="text-[#6e7681] text-[12px]">⏱ 10-30 Seconds/Answer | Quick Round</p>
                </div>
              </div>
              
              <ul className="space-y-4 mb-8">
                {[
                  "Answer within 10-30 seconds",
                  "No long pauses between questions",
                  "Speed and accuracy both matter",
                  "Leaderboard rankings displayed live"
                ].map((bullet, i) => (
                  <li key={i} className="flex items-start gap-3 text-[14px] text-white/80">
                    <span className="text-[#22C55E] mt-1">►</span>
                    {bullet}
                  </li>
                ))}
              </ul>

              <div className="bg-[#22C55E]/8 border-l-4 border-[#22C55E] p-4 rounded-r-lg">
                <p className="text-[#22C55E] font-bold text-sm">🏆 Final Round — Winners announced here!</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* --- PREVIOUS YEAR QUESTIONS --- */}
      <section className="py-24 bg-[#F5F5F5] px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-[36px] font-[900] text-[#DC2626] text-center uppercase tracking-[3px] mb-16">
            PREVIOUS YEAR QUESTIONS
          </h2>

          <div className="bg-[#0D1B2A] rounded-2xl p-8 md:p-12 border border-white/5 text-center">
            <div className="bg-[#DC2626]/8 border-l-4 border-[#DC2626] p-4 rounded-r-lg mb-10 text-left">
              <p className="text-[#EF4444] text-[13px] font-bold flex items-center gap-2">
                <AlertCircle size={16} />
                📚 Practice with last year's questions to prepare better for Tech Titans 2027!
              </p>
            </div>

            <div className="mb-8">
              <div className="text-5xl mb-6 text-[#EF4444]">📄</div>
              <h3 className="text-white font-bold text-xl mb-2">TechTitans — Previous Year Questions</h3>
              <p className="text-[#6e7681] text-sm">Computer Basics | Quiz + Rapid Fire</p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
              <button 
                onClick={() => window.open('https://drive.google.com/file/d/1bsk7CA8zsaJU_w6RQF--zQbBJUXvJJvS/view?usp=drive_link', '_blank')}
                className="w-full sm:w-auto px-8 py-3 border border-[#DC2626]/50 text-[#EF4444] font-bold rounded-lg hover:bg-[#DC2626]/10 transition-all flex items-center justify-center gap-2"
              >
                👁 View PDF
              </button>
              <button 
                onClick={() => window.open('https://drive.google.com/uc?export=download&id=1bsk7CA8zsaJU_w6RQF--zQbBJUXvJJvS', '_blank')}
                className="w-full sm:w-auto px-8 py-3 bg-[#DC2626] text-white font-bold rounded-lg hover:bg-[#B91C1C] transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(220,38,38,0.3)]"
              >
                ⬇ Download PDF
              </button>
            </div>

            <div className="bg-[#DC2626]/5 border-l-2 border-[#DC2626]/40 p-3 rounded-r-lg inline-block text-left">
              <p className="text-[#EF4444]/70 text-[12px]">
                💡 Tip: These are for practice only. Actual questions will be different.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- EVENT RULES --- */}
      <section className="py-24 bg-[#F5F5F5] px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-[36px] font-[900] text-[#DC2626] text-center uppercase tracking-[3px] mb-16">
            EVENT RULES
          </h2>

          <div className="bg-[#0D1B2A] rounded-2xl p-8 md:p-12 border border-white/5">
            <div className="space-y-0">
              {[
                "Sign up in advance if required",
                "Log in before the quiz begins",
                "Organizers may monitor the quiz at any time",
                "Leaderboard visible during and after the quiz",
                <>No external sources allowed — <span className="text-[#DC2626] font-bold">no cheating</span></>,
                "Automatic scoring with instant feedback",
                "Tie breakers: bonus question or fastest finger",
                <>Judges' decision is <span className="text-[#DC2626] font-bold">final and binding</span></>
              ].map((rule, i) => (
                <div key={i} className={`flex gap-6 py-6 ${i !== 0 ? 'border-t border-white/5' : ''}`}>
                  <span className="text-[#DC2626] font-bold text-lg shrink-0">0{i + 1}</span>
                  <p className="text-[#8b949e] text-[14px] leading-relaxed">{rule}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* --- PRIZES & REWARDS --- */}
      <section className="py-24 bg-[#F5F5F5] px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-[36px] font-[900] text-[#DC2626] text-center uppercase tracking-[3px] mb-16">
            PRIZES & REWARDS
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* 1st Place */}
            <motion.div 
              whileHover={{ y: -10 }}
              className="bg-[#1A0500] border border-[#DC2626]/35 rounded-2xl p-8 text-center"
            >
              <div className="text-4xl mb-6">🥇</div>
              <div className="text-[#EF4444] text-[11px] uppercase tracking-[3px] mb-2">1ST PLACE</div>
              <div className="text-white font-[900] text-2xl mb-6">WINNER</div>
              <div className="space-y-3 text-white/80 text-sm">
                <div className="flex items-center justify-center gap-2">💵 Cash Prize</div>
                <div className="flex items-center justify-center gap-2">🎖 Certificate</div>
                <div className="flex items-center justify-center gap-2">🏆 Trophy</div>
              </div>
            </motion.div>

            {/* 2nd Place */}
            <motion.div 
              whileHover={{ y: -10 }}
              className="bg-[#0D1B2A] border border-blue-500/30 rounded-2xl p-8 text-center"
            >
              <div className="text-4xl mb-6">🥈</div>
              <div className="text-[#60A5FA] text-[11px] uppercase tracking-[3px] mb-2">2ND PLACE</div>
              <div className="text-white font-[900] text-2xl mb-6">RUNNER-UP</div>
              <div className="space-y-3 text-white/80 text-sm">
                <div className="flex items-center justify-center gap-2">💵 Cash Prize</div>
                <div className="flex items-center justify-center gap-2">🎖 Certificate</div>
              </div>
            </motion.div>

            {/* 3rd Place */}
            <motion.div 
              whileHover={{ y: -10 }}
              className="bg-[#0D1117] border border-gray-500/30 rounded-2xl p-8 text-center"
            >
              <div className="text-4xl mb-6">🥉</div>
              <div className="text-[#9CA3AF] text-[11px] uppercase tracking-[3px] mb-2">3RD PLACE</div>
              <div className="text-white font-[900] text-2xl mb-6">FINALIST</div>
              <div className="space-y-3 text-white/80 text-sm">
                <div className="flex items-center justify-center gap-2">💵 Cash Prize</div>
                <div className="flex items-center justify-center gap-2">🎖 Certificate</div>
              </div>
            </motion.div>
          </div>

          <p className="text-center text-[#6e7681] text-[13px] mt-10">
            🎓 Every participant will receive a participation certificate
          </p>
        </div>
      </section>

      {/* --- PAYMENT DETAILS --- */}
      <section className="py-24 bg-[#F5F5F5] px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-[36px] font-[900] text-[#DC2626] text-center uppercase tracking-[3px] mb-16">
            PAYMENT DETAILS
          </h2>

          <div className="bg-[#0D1B2A] rounded-2xl p-8 md:p-12 border border-white/5">
            <div className="bg-[#DC2626]/8 border-l-4 border-[#DC2626] p-4 rounded-r-lg mb-10">
              <p className="text-[#EF4444] text-[12px] font-bold flex items-center gap-2">
                <AlertCircle size={14} />
                ⚠ PAY FIRST, THEN FILL THE FORM | Keep your Transaction ID ready
              </p>
            </div>

            <div className="text-center mb-8">
              <div className="text-[#6e7681] text-[10px] uppercase tracking-[3px] mb-6">SCAN QR CODE TO PAY</div>
              <div className="inline-block bg-white p-3 rounded-xl mb-8">
                <img 
                  src="https://quickchart.io/qr?text=upi://pay?pa=8309030400-id8e@axl%26pn=GattuAbhinay%26am=300%26cu=INR%26tn=NNRG_TechFest_TechTitan&size=300" 
                  alt="Payment QR Code"
                  className="w-[260px] h-[260px]"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
              <div className="space-y-1">
                <div className="text-[10px] text-[#6e7681] uppercase tracking-wider">UPI ID</div>
                <div className="text-[#EF4444] font-mono text-sm">8309030400-id8e@axl</div>
              </div>
              <div className="space-y-1">
                <div className="text-[10px] text-[#6e7681] uppercase tracking-wider">PHONE</div>
                <div className="text-[#EF4444] font-mono text-sm">8309030400</div>
              </div>
              <div className="space-y-1">
                <div className="text-[10px] text-[#6e7681] uppercase tracking-wider">NAME</div>
                <div className="text-white font-bold text-sm">GATTU ABHINAY</div>
              </div>
              <div className="space-y-1">
                <div className="text-[10px] text-[#6e7681] uppercase tracking-wider">AMOUNT</div>
                <div className="text-[#22C55E] font-bold text-sm">₹300</div>
              </div>
            </div>

            <div className="bg-[#DC2626]/6 border-l-2 border-[#DC2626] p-4 rounded-r-lg">
              <p className="text-[#EF4444] text-[13px]">📋 Note: NNRG TechFest - TechTitan</p>
            </div>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4 my-12">
            <div className="flex-1 h-[1px] bg-white/8" />
            <div className="bg-[#1A1A2E] border border-[#DC2626]/30 text-[#DC2626]/80 text-[9px] tracking-[3px] px-[14px] py-[5px] rounded-[20px] uppercase font-bold">
              OR | ALTERNATIVE
            </div>
            <div className="flex-1 h-[1px] bg-white/8" />
          </div>

          {/* Alternative Payment Card */}
          <div className="bg-[#0D1B2A] rounded-2xl p-8 md:p-12 border border-white/5 relative">
            <div className="absolute top-6 right-6 border border-[#DC2626]/50 text-[#DC2626] text-[9px] font-bold tracking-[2px] px-2 py-0.5 rounded uppercase">
              ALTERNATIVE
            </div>

            <div className="bg-[#DC2626]/5 border-l-[3px] border-[#DC2626]/50 p-[10px] px-[14px] rounded-r-lg mb-10">
              <p className="text-[#DC2626]/80 text-[11px] leading-relaxed">
                ⚡ Use this UPI ID if the primary payment option has reached its daily transaction limit.
              </p>
            </div>

            <div className="text-center mb-8">
              <div className="text-[#6e7681] text-[9px] uppercase tracking-[3px] mb-6">SCAN QR CODE TO PAY</div>
              <div className="inline-block bg-white p-2 rounded-lg mb-8">
                <img 
                  src="https://quickchart.io/qr?text=upi://pay?pa=6301523538-id6e@axl%26pn=Nithish%26am=300%26cu=INR%26tn=NNRG_TechFest_TechTitans&size=300" 
                  alt="Alternative Payment QR Code"
                  className="w-[260px] h-[260px]"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
              <div className="space-y-1">
                <div className="text-[10px] text-[#6e7681] uppercase tracking-wider">UPI ID</div>
                <div className="text-[#EF4444] font-mono text-sm">6301523538-id6e@axl</div>
              </div>
              <div className="space-y-1">
                <div className="text-[10px] text-[#6e7681] uppercase tracking-wider">PHONE</div>
                <div className="text-[#EF4444] font-mono text-sm">6301523538</div>
              </div>
              <div className="space-y-1">
                <div className="text-[10px] text-[#6e7681] uppercase tracking-wider">NAME</div>
                <div className="text-white font-bold text-sm uppercase">NITHISH</div>
              </div>
              <div className="space-y-1">
                <div className="text-[10px] text-[#6e7681] uppercase tracking-wider">AMOUNT</div>
                <div className="text-[#22C55E] font-bold text-sm">₹300</div>
              </div>
            </div>

            <div className="bg-[#DC2626]/3 border-l-2 border-[#DC2626]/50 p-4 rounded-r-lg">
              <p className="text-[#DC2626]/70 text-[13px]">📋 Note: NNRG TechFest - TechTitan</p>
            </div>
          </div>
        </div>
      </section>

      {/* --- REGISTRATION FORM --- */}
      <section id="register" className="py-24 bg-[#F5F5F5] px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-[36px] font-[900] text-[#DC2626] text-center uppercase tracking-[3px] mb-4">
            REGISTRATION FORM
          </h2>
          <p className="text-[#6e7681] text-center mb-16 max-w-lg mx-auto">
            Fill in your team details below. After submission, you'll be redirected to WhatsApp to confirm your registration.
          </p>

          <div ref={formRef} className="bg-[#0D1B2A] rounded-2xl p-8 md:p-12 border border-white/5">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* College */}
              <div>
                <label className="block text-[#EF4444] text-[10px] font-bold uppercase tracking-[2px] mb-2">COLLEGE *</label>
                <select 
                  name="college"
                  value={formData.college}
                  onChange={handleInputChange}
                  className={`w-full bg-white/5 border ${errors.college ? 'border-red-500' : 'border-white/10'} rounded-lg p-3 text-white text-[13px] focus:border-[#DC2626] outline-none transition-all`}
                >
                  {colleges.map(c => <option key={c} value={c} className="bg-[#0D1B2A]">{c}</option>)}
                </select>
                {errors.college && <p className="text-red-500 text-[10px] mt-1">{errors.college}</p>}
              </div>

              {formData.college === "Other" && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                  <label className="block text-[#EF4444] text-[10px] font-bold uppercase tracking-[2px] mb-2">SPECIFY COLLEGE *</label>
                  <input 
                    type="text"
                    name="otherCollege"
                    placeholder="Type your college name"
                    value={formData.otherCollege}
                    onChange={handleInputChange}
                    className={`w-full bg-white/5 border ${errors.otherCollege ? 'border-red-500' : 'border-white/10'} rounded-lg p-3 text-white text-[13px] focus:border-[#DC2626] outline-none transition-all`}
                  />
                  {errors.otherCollege && <p className="text-red-500 text-[10px] mt-1">{errors.otherCollege}</p>}
                </motion.div>
              )}

              {/* Team Name */}
              <div>
                <label className="block text-[#EF4444] text-[10px] font-bold uppercase tracking-[2px] mb-2">TEAM NAME *</label>
                <input 
                  type="text"
                  name="teamName"
                  placeholder="Enter your team name"
                  value={formData.teamName}
                  onChange={handleInputChange}
                  className={`w-full bg-white/5 border ${errors.teamName ? 'border-red-500' : 'border-white/10'} rounded-lg p-3 text-white text-[13px] focus:border-[#DC2626] outline-none transition-all`}
                />
                {errors.teamName && <p className="text-red-500 text-[10px] mt-1">{errors.teamName}</p>}
              </div>

              {/* Team Leader */}
              <div className="pt-4">
                <h3 className="text-white font-bold text-[15px] mb-6">Team Leader</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-[#EF4444] text-[10px] font-bold uppercase tracking-[2px] mb-2">LEADER FULL NAME *</label>
                    <input 
                      type="text"
                      name="leaderName"
                      placeholder="Full Name"
                      value={formData.leaderName}
                      onChange={handleInputChange}
                      className={`w-full bg-white/5 border ${errors.leaderName ? 'border-red-500' : 'border-white/10'} rounded-lg p-3 text-white text-[13px] focus:border-[#DC2626] outline-none transition-all`}
                    />
                    {errors.leaderName && <p className="text-red-500 text-[10px] mt-1">{errors.leaderName}</p>}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[#EF4444] text-[10px] font-bold uppercase tracking-[2px] mb-2">ROLL NUMBER *</label>
                      <input 
                        type="text"
                        name="leaderRoll"
                        placeholder="Roll Number"
                        value={formData.leaderRoll}
                        onChange={handleInputChange}
                        className={`w-full bg-white/5 border ${errors.leaderRoll ? 'border-red-500' : 'border-white/10'} rounded-lg p-3 text-white text-[13px] focus:border-[#DC2626] outline-none transition-all`}
                      />
                      {errors.leaderRoll && <p className="text-red-500 text-[10px] mt-1">{errors.leaderRoll}</p>}
                    </div>
                    <div>
                      <label className="block text-[#EF4444] text-[10px] font-bold uppercase tracking-[2px] mb-2">DEPARTMENT *</label>
                      <select 
                        name="leaderDept"
                        value={formData.leaderDept}
                        onChange={handleInputChange}
                        className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white text-[13px] focus:border-[#DC2626] outline-none transition-all"
                      >
                        {departments.map(d => <option key={d} value={d} className="bg-[#0D1B2A]">{d}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[#EF4444] text-[10px] font-bold uppercase tracking-[2px] mb-2">YEAR *</label>
                      <select 
                        name="leaderYear"
                        value={formData.leaderYear}
                        onChange={handleInputChange}
                        className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white text-[13px] focus:border-[#DC2626] outline-none transition-all"
                      >
                        {years.map(y => <option key={y} value={y} className="bg-[#0D1B2A]">{y}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[#EF4444] text-[10px] font-bold uppercase tracking-[2px] mb-2">MOBILE *</label>
                      <input 
                        type="text"
                        name="leaderMobile"
                        placeholder="Mobile"
                        value={formData.leaderMobile}
                        onChange={handleInputChange}
                        className={`w-full bg-white/5 border ${errors.leaderMobile ? 'border-red-500' : 'border-white/10'} rounded-lg p-3 text-white text-[13px] focus:border-[#DC2626] outline-none transition-all`}
                      />
                      {errors.leaderMobile && <p className="text-red-500 text-[10px] mt-1">{errors.leaderMobile}</p>}
                    </div>
                    <div>
                      <label className="block text-[#EF4444] text-[10px] font-bold uppercase tracking-[2px] mb-2">EMAIL (OPTIONAL)</label>
                      <input 
                        type="email"
                        name="leaderEmail"
                        placeholder="Email"
                        value={formData.leaderEmail}
                        onChange={handleInputChange}
                        className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white text-[13px] focus:border-[#DC2626] outline-none transition-all"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Member 2 */}
              <div className="pt-4">
                <h3 className="text-white font-bold text-[14px] mb-6">Member 2 (Optional)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[#EF4444] text-[10px] font-bold uppercase tracking-[2px] mb-2">FULL NAME</label>
                    <input 
                      type="text"
                      name="member2Name"
                      placeholder="Full Name"
                      value={formData.member2Name}
                      onChange={handleInputChange}
                      className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white text-[13px] focus:border-[#DC2626] outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[#EF4444] text-[10px] font-bold uppercase tracking-[2px] mb-2">ROLL NUMBER</label>
                    <input 
                      type="text"
                      name="member2Roll"
                      placeholder="Roll Number"
                      value={formData.member2Roll}
                      onChange={handleInputChange}
                      className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white text-[13px] focus:border-[#DC2626] outline-none transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Member 3 */}
              <div className="pt-4">
                <h3 className="text-white font-bold text-[14px] mb-6">Member 3 (Optional)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[#EF4444] text-[10px] font-bold uppercase tracking-[2px] mb-2">FULL NAME</label>
                    <input 
                      type="text"
                      name="member3Name"
                      placeholder="Full Name"
                      value={formData.member3Name}
                      onChange={handleInputChange}
                      className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white text-[13px] focus:border-[#DC2626] outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[#EF4444] text-[10px] font-bold uppercase tracking-[2px] mb-2">ROLL NUMBER</label>
                    <input 
                      type="text"
                      name="member3Roll"
                      placeholder="Roll Number"
                      value={formData.member3Roll}
                      onChange={handleInputChange}
                      className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white text-[13px] focus:border-[#DC2626] outline-none transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Transaction ID */}
              <div className="pt-4">
                <label className="block text-[#EF4444] text-[10px] font-bold uppercase tracking-[2px] mb-2">TRANSACTION ID *</label>
                <input 
                  type="text"
                  name="transactionId"
                  placeholder="UPI Transaction ID after payment"
                  value={formData.transactionId}
                  onChange={handleInputChange}
                  className={`w-full bg-white/5 border ${errors.transactionId ? 'border-red-500' : 'border-white/10'} rounded-lg p-3 text-white text-[13px] focus:border-[#DC2626] outline-none transition-all`}
                />
                {errors.transactionId && <p className="text-red-500 text-[10px] mt-1">{errors.transactionId}</p>}
              </div>

              <div className="bg-[#DC2626]/6 border-l-4 border-[#DC2626] p-4 rounded-r-lg">
                <p className="text-[#EF4444] text-[13px]">
                  💡 Reminder: Pay ₹300 to UPI ID <span className="font-bold">8309030400-id8e@axl</span> first, then enter your Transaction ID above.
                </p>
              </div>

              <div className="bg-[#22C55E]/6 border-l-4 border-[#22C55E] p-4 rounded-r-lg">
                <p className="text-[#22C55E] text-[13px]">
                  🟢 On Submit: You'll be redirected to WhatsApp to send your registration details to the coordinator for confirmation.
                </p>
              </div>

              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileHover={{ scale: 1.01, backgroundColor: '#B91C1C' }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-[18px] bg-[#DC2626] text-white font-bold text-[15px] rounded-xl shadow-[0_0_30px_rgba(220,38,38,0.4)] transition-all flex items-center justify-center gap-3"
              >
                {isSubmitting ? "Processing..." : "⊕ Submit Registration & Open WhatsApp →"}
              </motion.button>

              <p className="text-center text-[#6e7681] text-[11px] px-4">
                By submitting, you agree to the event rules and confirm that your payment has been made. All decisions by the organizing committee are final.
              </p>
            </form>
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="relative bg-black py-20 px-6 overflow-hidden">
        {/* Watermark */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
          <div className="text-white/[0.03] font-[900] text-[clamp(60px,12vw,160px)] tracking-[8px] whitespace-nowrap">
            TECH FEST 2027
          </div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-white font-bold text-[28px]">NEED HELP?</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Faculty Coordinators */}
            <div>
              <h3 className="text-white/30 text-[10px] font-bold uppercase tracking-[3px] mb-6">FACULTY COORDINATORS</h3>
              <div className="space-y-2">
                {[
                  { name: "Dr. V.V. Appaji", phone: "9949062386" },
                  { name: "Mr. M. Eswara Rao", phone: "8143848778" }
                ].map((coord, i) => (
                  <div key={i} className="bg-[#0D1117] border border-[#21262d] rounded-lg p-4 flex justify-between items-center">
                    <span className="text-white font-bold text-[14px]">{coord.name}</span>
                    <span className="text-white/20 text-[12px]">{coord.phone}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Student Coordinators */}
            <div>
              <h3 className="text-white/30 text-[10px] font-bold uppercase tracking-[3px] mb-6">STUDENT COORDINATORS</h3>
              <div className="space-y-2">
                {/* Main Student Coordinator */}
                <a 
                  href="https://wa.me/918309030400" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block bg-[#1A0500] border-l-4 border-[#DC2626] rounded-r-lg p-4 flex justify-between items-center group transition-all"
                >
                  <div>
                    <div className="text-[#DC2626]/60 text-[8px] font-bold uppercase mb-1">STUDENT COORDINATOR</div>
                    <div className="text-[#EF4444] font-bold text-[16px]">GATTU ABHINAY</div>
                  </div>
                  <div className="text-[#EF4444] font-bold text-[13px] group-hover:translate-x-1 transition-transform">
                    8309030400 ↗
                  </div>
                </a>

                {[
                  { name: "Nithish", phone: "6210232345" },
                  { name: "Akhil", phone: "9035673455" }
                ].map((coord, i) => (
                  <div key={i} className="bg-[#0D1117] border border-[#21262d] rounded-lg p-4 flex justify-between items-center">
                    <div>
                      <div className="text-white/20 text-[8px] font-bold uppercase">STUDENT COORDINATOR</div>
                      <div className="text-white font-bold text-[14px]">{coord.name}</div>
                    </div>
                    <span className="text-white/20 text-[12px]">{coord.phone}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-20 pt-6 border-t border-white/7 flex flex-col md:flex-row justify-between items-center gap-4 text-white/20 text-[10px]">
            <div>Developed by the Department of CSM</div>
            <div>© 2027 NNRG Fest. All rights reserved.</div>
            <a 
              href="https://wa.me/918309030400" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[#EF4444] hover:underline"
            >
              Designed by GATTU ABHINAY ↗
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
