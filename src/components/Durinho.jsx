import React, { useState, useEffect } from "react";
import FAQItem from "../components/FAQItem";
import RightSidebar from "../components/durhino_siderbar/code"; 
import "../styles/durhino.css";
import "../components/durhino_siderbar/style.css";
import VideoWithCover from "./videoWithCover";
import { supabase } from "./../lib/supabase";

function DurinhoPage() {
  const [showSidebar, setShowSidebar] = useState(false);
  const [currentFto, setCurrentFto] = useState(null);
  const [loading,setLoading] = useState(true);
  useEffect(() => {
    fetchCurrentFto();
  }, []);

  const fetchCurrentFto = async () => {
    const now = new Date().toISOString();
    
    const { data, error } = await supabase
      .from('Ftos')
      .select(`
        *,
        Atheletes (*)
      `)
      .lte('startDate', now)
      .gte('endDate', now)
      .single();

    if (error) {
      console.error('Error fetching FTO:', error);
      return;
    }

    if (data) {
      setCurrentFto(data);
    }
    setLoading(false);
  };

  if (loading) {
    return <div>Loading...</div>;
  }
  if (!currentFto) {
    return <div>No Current Fto On Sale</div>;
  }

  const tokensLeft =100;

  return (
    <>
      <div className="header-logo">
        <img src="/sixer.gif" width={80} height={70} alt="Logo" />
      </div>
      <div className="header">
        <h1>{currentFto.Atheletes.fanTokenSymbol}  Day (Round {currentFto.roundNumber})</h1>
      </div>

      <div className="durinho-wrapper">
        <div className="durinho-container">
          {/* Left: Video + Progress */}
          <div className="durinho-left">
            <div className="video-wrapper">
              <VideoWithCover
                coverImage={currentFto.coverImageUrl}
                videoSrc={currentFto.videoUrl}
                endDate={currentFto.endDate}
              />
              {/* {timeRemaining && (
                <div className='timer-overlay'>
                  The sale will end in <strong>{timeRemaining}</strong>
                </div>
              )} */}
            </div>

            <div className="tokens-left">
              Tokens left: <strong>{tokensLeft.toFixed(1)}%</strong>
              <div className="token-bar">
                <div className="filled" style={{ width: `${tokensLeft}%` }}></div>
              </div>
            </div>
          </div>

          {/* Right: Info Card */}
          <div className="durinho-right">
            <div className="profile">
              <div className="pMain">
                <div
                  style={{
                    width: "81px",
                    height: "81px",
                    borderRadius: "50%",
                    marginRight: "7px"
                  }}
                >
                  <img src={currentFto.Atheletes.profilePicture} alt={`${currentFto.Atheletes.firstName} ${currentFto.Atheletes.lastName}`} />
                </div>
                <div style={{ marginLeft: "10px" }}>
                  <h2 style={{ fontSize: "25px", fontWeight: "550" }}>
                    ${currentFto.Atheletes.fanTokenSymbol} {currentFto.Atheletes.country}
                  </h2>
                  <p className="label">Athlete {currentFto.Atheletes.sport}</p>
                </div>
              </div>

              <div className="publish">
                <strong>{new Date(currentFto.startDate).toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase()}</strong>
                <span>Publication time</span>
              </div>
            </div>

            <div className="name-block">
              <h3
                style={{
                  fontWeight: "550",
                  fontSize: "33px",
                }}
              >
                {currentFto.Atheletes.firstName} "{currentFto.Atheletes.nickName}" {currentFto.Atheletes.lastName}
              </h3>
              <p className="name-block-p">
                {currentFto.Atheletes.description}
              </p>
            </div>

            <div className="token-info">
              <div
                className="token-infoo"
                style={{
                  backgroundColor: "#fafafa",
                  textAlign: "center",
                  borderRadius: "4px",
                }}
              >
                <strong style={{ fontSize: "26px", fontWeight: "550" }}>
                  {currentFto.tokensForSale} ${currentFto.Atheletes.fanTokenSymbol}
                </strong>
                <p style={{ fontSize: "20px", fontWeight: 550 }}>
                  Tokens for sale
                </p>
              </div>

              <div
                style={{
                  backgroundColor: "#fafafa",
                  textAlign: "center",
                  borderRadius: "4px",
                }}
                className="token-infoo"
              >
                <strong style={{ fontSize: "26px", fontWeight: "550" }}>
                  {new Date(currentFto.startDate).toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' })}
                </strong>
                <p style={{ fontSize: "20px", fontWeight: 550 }}>
                  Token sale start date
                </p>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-around",
                alignItems: "center",
              }}
            >
              <h3
                className="price"
                style={{  fontSize: "50px", fontWeight: 800 }}
              >
                ${currentFto.Atheletes.fanTokenInitialPrice}.00
              </h3>

              <div
                className="fto-button-border-gradient"
                style={{ marginLeft: "0px", fontSize: "50px" }}
              >
                <div
                  className="fto-button-wrappr"
                  onClick={() => setShowSidebar(true)}
                >
                  <a
                    href="#"
                    className="button mt-80 bdr m-hide button-show w-button"
                  >
                    <strong className="bold-text-2">Buy ${currentFto.Atheletes.fanTokenSymbol}</strong>
                  </a>
                </div>
              </div>
            </div>

            <div className="faq-section">
              <FAQItem
                question={`What is $${currentFto.Atheletes.fanTokenSymbol}?`}
                answer={`${currentFto.Atheletes.fanTokenSymbol} is ${currentFto.Atheletes.firstName} ${currentFto.Atheletes.lastName}' fan token. By owning $${currentFto.Atheletes.fanTokenSymbol}, you will be able to engage with the athlete and other fan token holders, participate in contests, earn rewards, and vote in polls to influence significant decisions ${currentFto.Atheletes.firstName} has to make!`}
              />
              <FAQItem
                question={`How do I buy $${currentFto.Atheletes.fanTokenSymbol}?`}
                answer={`Click the Buy $${currentFto.Atheletes.fanTokenSymbol} button, enter your email, choose quantity, then either store in Winter wallet or your ETH wallet. Finally, pay with card.`}
              />
              <FAQItem
                question="How do I participate in events?"
                answer="Once the FTO ends, events will appear. You can join using your fan tokens. They’re not consumed, so you can reuse them."
              />

              {/* <FAQItem question="" answer="" />
              <FAQItem question="" answer="" />
              <FAQItem question="" answer="" /> */}
            </div>
          </div>
        </div>
      </div>

      {/* --- RIGHT SIDEBAR --- */}
      {showSidebar && (
        <>
          <div
            className="sidebar-overlay"
            onClick={() => setShowSidebar(false)}
          />

          <RightSidebar
            isOpen={showSidebar}
            currentFto={currentFto}
            onClose={() => setShowSidebar(false)}
          />
        </>
      )}
    </>
  );
}

export default DurinhoPage;
