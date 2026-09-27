import React, { useState, useRef } from 'react';
import axios from 'axios';
import {
  Volume2,
  Loader2,
  Pause,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

const campaigns = [
  {
    id: 'samuel_01',
    name: 'Samuel Adekoya',
    title: 'School-Fees',
    subtitle:
      'Samuel Adekoya Is Starting Again, This Time with a Dream He Truly Believes In.',
    image:
      'https://images.unsplash.com/photo-1522529599102-193c0d76b5b6?q=80&w=800&auto=format&fit=crop',
    story: [
      "Sometimes, starting over isn't a sign that you have failed. Sometimes, it is the courage to choose a different path after life has taken you somewhere you never expected.",
      "For Samuel Adekoya, the journey through university has been anything but easy. Samuel gained admission to the University of Benin in 2021 to study chemical engineering, but just months before he began his university journey, his father passed away.",
      "His father had been the family's breadwinner. Suddenly, the responsibility of keeping the family going fell largely on his mother, a trader, while Samuel and his four younger siblings had to navigate life without the person who had been supporting them.",
      "Getting into university was therefore not a simple transition for Samuel. His family had to sell belongings and find different ways to raise money just to get him started. Accommodation, feeding, school fees and other expenses became constant challenges.",
      "The weight of everything eventually began to affect his academics. By 200 level, Samuel was struggling with several carryovers. There were courses he couldn't register for because he couldn't afford the required payments. He was also trying to find ways to make money while keeping up with school, leaving him stretched between survival and his education.",
      "At one point, he received about ₦45,000 for accommodation. Hoping to turn the money into something that could help him become financially independent, he invested it into trying to build a small setup for himself. Unfortunately, things did not work out as planned, and the money was lost.",
      "By 300 level, his academic situation had deteriorated significantly, and probation became a real possibility. Eventually, Samuel made the difficult decision to start again, but this time around, he wants to pursue something closer to who he truly is.",
      "Samuel has always been drawn to software, technology and AI. Even while navigating his struggles in school, he has been building an AI video business and developing his skills in the technology space.",
      "He now hopes to use the JUPEB programme as a fresh start, with the goal of returning to 200 level and studying data science, a field that aligns more closely with his interests and the future he sees for himself.",
      "The JUPEB programme and associated expenses will cost approximately ₦470,000. Samuel has already managed to save ₦200,000 but he still has a significant gap to cover.",
      "For Samuel, this isn't simply about returning to school. It is about rebuilding after losing his father, recovering from years of academic setbacks, and finally pursuing a path that reflects his passion and potential.",
      "He knows he has lost some time, but he doesn't want those years to define the rest of his life. Samuel is ready to start again, and this time, he wants to build a future in a field he genuinely believes in.",
      "Can we support him in starting again?",
    ],
  },
  {
    id: 'aisha_02',
    name: 'Aisha Bello',
    title: 'Clinical Fees',
    subtitle:
      'Help Aisha cross the finish line of medical school.',
    image:
      'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?q=80&w=800&auto=format&fit=crop',
    story: [
      "The final year of medical school is usually a time of triumph, but for Aisha Bello, it has become a race against time.",
      "Aisha is a 500-level Medicine and Surgery student at the University of Lagos. For the past five years, she has maintained excellent grades while juggling multiple part-time tutoring jobs to support her education.",
      "However, the recent increase in clinical fees and mandatory medical equipment costs has pushed her budget beyond its breaking point. She needs ₦350,000 to clear her final year clinical postings and graduate.",
      "Without these funds, Aisha faces an automatic deferment, delaying her dream of becoming a pediatrician and helping under-resourced communities.",
      "Let's help Aisha cross the finish line.",
    ],
  },
  {
    id: 'chinedu_03',
    name: 'Chinedu Okafor',
    title: 'Architecture Workstation',
    subtitle: 'Designing a better tomorrow requires the right tools today.',
    image: 'https://images.unsplash.com/photo-1506803682981-6e718a9dd3ee?q=80&w=800&auto=format&fit=crop',
    story: [
      "Architecture is about building the future, but right now, Chinedu Okafor's future is on pause.",
      "Chinedu is a brilliant 300-level Architecture student whose primary tool—his rendering laptop—was severely damaged during a flood at his off-campus hostel.",
      "In architecture, missing a functioning workstation means missing project deadlines, which directly impacts his grades. He has been borrowing friends' laptops at 2 AM just to keep up, but it is taking a heavy toll on his health and academic performance.",
      "He needs ₦400,000 to replace his workstation and cover his outstanding studio fees for the semester.",
      "Your support will ensure Chinedu can get back to designing a better tomorrow."
    ]
  },
  {
    id: 'fatima_04',
    name: 'Fatima Yusuf',
    title: 'Law School Tuition',
    subtitle:
      'From a small farming community to the Nigerian Bar.',
    image:
      'https://images.unsplash.com/photo-1589156229687-496a31ad1d1f?q=80&w=800&auto=format&fit=crop',
    story: [
      "Fatima Yusuf has fought against all odds to secure her law degree, graduating top of her class. Now, only the Nigerian Law School stands between her and the Bar.",
      "Coming from a small farming community, Fatima is the first female in her extended family to attend university. Her community pooled resources to see her through her undergraduate studies, but the mandatory Law School campus fees are too steep for them to cover.",
      "The total cost for tuition, accommodation, and required textbooks is ₦600,000.",
      "Fatima wants to specialize in human rights law to protect vulnerable women in rural areas. By funding her Law School fees, you are empowering an advocate who will fight for those who cannot fight for themselves.",
    ],
  },
];

export default function App() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [audioData, setAudioData] = useState(null);
  const audioRef = useRef(null);

  const activeCampaign = campaigns[currentIndex];

  const visibleStory = isExpanded
    ? activeCampaign.story
    : activeCampaign.story.slice(0, 3);

  const handleNext = () => {
    stopAudio();
    setIsExpanded(false);
    setCurrentIndex((prev) =>
      prev === campaigns.length - 1 ? 0 : prev + 1
    );
  };

  const handlePrev = () => {
    stopAudio();
    setIsExpanded(false);
    setCurrentIndex((prev) =>
      prev === 0 ? campaigns.length - 1 : prev - 1
    );
  };

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }

    setIsPlaying(false);
    setAudioData(null);
  };

  const handleToggleAudio = async () => {
    if (audioData && audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
      }

      return;
    }

    try {
      setLoading(true);
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5001';

      const response = await axios.post(
        'http://localhost:5001/api/generate-audio',
        { student_id: activeCampaign.id }
      );

      const base64Audio = response.data.audioBase64;

      if (!base64Audio) {
        throw new Error(
          'Backend did not return audio data.'
        );
      }

      const safeAudioSrc =
        `data:audio/mpeg;base64,${base64Audio}`;

      setAudioData(safeAudioSrc);

      const audio = new Audio(safeAudioSrc);
      audioRef.current = audio;

      audio.onended = () => setIsPlaying(false);

      audio.onerror = (e) => {
        console.error('Audio object error:', e);
        setIsPlaying(false);
      };

      await audio.play();
      setIsPlaying(true);
    } catch (error) {
      console.error('Full error:', error);

      const serverMessage =
        error.response?.data?.error || error.message;

      alert(`Error playing voice: ${serverMessage}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.dashboardBackground}>
      <div style={styles.mainCard}>

        {/* Navigation Controls */}
        <div style={styles.navControls}>
          <button
            onClick={handlePrev}
            style={styles.navButton}
          >
            <ChevronLeft size={16} />
            Prev
          </button>

          <div style={styles.navIndicator}>
            <span style={styles.navStudentName}>
              {activeCampaign.name}
            </span>

            <span style={styles.navCount}>
              {currentIndex + 1} of {campaigns.length}
            </span>
          </div>

          <button
            onClick={handleNext}
            style={styles.navButton}
          >
            Next
            <ChevronRight size={16} />
          </button>
        </div>

        {/* Profile Image Box */}
        <div style={styles.imageBox}>
          <img
            src={activeCampaign.image}
            alt={activeCampaign.name}
            style={styles.profileImage}
          />
        </div>

        {/* Story Section */}
        <div style={styles.contentPadding}>
          <div style={styles.storyHeader}>
            <div style={styles.headerText}>
              <h1 style={styles.title}>
                {activeCampaign.title}
              </h1>

              <p style={styles.subtitle}>
                {activeCampaign.subtitle}
              </p>
            </div>

            <button
              onClick={handleToggleAudio}
              disabled={loading}
              style={{
                ...styles.audioButton,
                backgroundColor: loading
                  ? '#f3f4f6'
                  : isPlaying
                  ? '#059669'
                  : '#ecfdf5',
                color: isPlaying
                  ? '#ffffff'
                  : '#047857',
                cursor: loading
                  ? 'not-allowed'
                  : 'pointer',
              }}
            >
              {loading ? (
                <>
                  <Loader2
                    size={17}
                    style={styles.spinner}
                  />
                  Generating...
                </>
              ) : isPlaying ? (
                <>
                  <Pause size={17} />
                  Pause
                </>
              ) : (
                <>
                  <Volume2 size={17} />
                  Listen
                </>
              )}
            </button>
          </div>

          <div style={styles.divider}></div>

          <div style={styles.storyContent}>
            {visibleStory.map((paragraph, index) => (
              <p
                key={index}
                style={styles.paragraph}
              >
                {paragraph}
              </p>
            ))}

            {activeCampaign.story.length > 3 && (
              <div style={styles.readMoreWrapper}>
                <button
                  onClick={() =>
                    setIsExpanded(!isExpanded)
                  }
                  style={styles.readMoreButton}
                >
                  {isExpanded ? (
                    <>
                      Read Less
                      <ChevronUp size={16} />
                    </>
                  ) : (
                    <>
                      Read Full Story
                      <ChevronDown size={16} />
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  dashboardBackground: {
    minHeight: '100vh',
    backgroundColor: '#f3f4f6',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    padding: '40px 24px',
    fontFamily:
      '"Inter", system-ui, -apple-system, sans-serif',
  },

  mainCard: {
    maxWidth: '680px',
    width: '100%',
    backgroundColor: '#ffffff',
    borderRadius: '24px',
    boxShadow:
      '0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01)',
    overflow: 'hidden',
  },

  navControls: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 24px',
    borderBottom: '1px solid #f3f4f6',
    backgroundColor: '#ffffff',
  },

  navButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    background: '#f9fafb',
    border: '1px solid #e5e7eb',
    color: '#374151',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
    padding: '6px 12px',
    borderRadius: '20px',
    transition: 'all 0.2s ease',
  },

  navIndicator: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },

  navStudentName: {
    fontSize: '14px',
    fontWeight: '700',
    color: '#111827',
  },

  navCount: {
    fontSize: '12px',
    color: '#6b7280',
    fontWeight: '500',
  },

  imageBox: {
    width: '100%',
    height: '340px',
    backgroundColor: '#e5e7eb',
  },

  profileImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    objectPosition: 'center 20%',
  },

  contentPadding: {
    padding: '32px',
  },

  storyHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: '24px',
  },

  headerText: {
    flex: 1,
  },

  title: {
    fontSize: '26px',
    fontWeight: '800',
    color: '#111827',
    margin: '0 0 8px 0',
    letterSpacing: '-0.02em',
  },

  subtitle: {
    fontSize: '15px',
    color: '#6b7280',
    margin: 0,
    lineHeight: '1.5',
    fontWeight: '500',
  },

  audioButton: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    border: 'none',
    borderRadius: '12px',
    padding: '12px 20px',
    fontSize: '14px',
    fontWeight: '600',
    transition: 'all 0.2s ease',
    whiteSpace: 'nowrap',
    boxShadow:
      '0 4px 6px -1px rgba(5, 150, 105, 0.2)',
  },

  spinner: {
    animation: 'spin 1s linear infinite',
  },

  divider: {
    height: '1px',
    backgroundColor: '#f3f4f6',
    margin: '24px 0',
  },

  storyContent: {
    color: '#374151',
    lineHeight: '1.8',
    fontSize: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },

  paragraph: {
    margin: 0,
  },

  readMoreWrapper: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '12px',
    paddingTop: '16px',
    borderTop: '1px dashed #e5e7eb',
  },

  readMoreButton: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    background: '#f0fdf4',
    border: '1px solid #bbf7d0',
    color: '#059669',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    padding: '8px 16px',
    borderRadius: '20px',
    transition: 'all 0.2s ease',
  },
};