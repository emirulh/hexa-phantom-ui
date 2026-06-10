import React, { useState, useEffect } from 'react';
import { 
  Wifi, Clock, Thermometer, Shield, ArrowUpRight, MapPin, Search,
  Battery, Zap, CloudRain, Droplets, Eye, ChevronRight, Navigation,
  LayoutDashboard, Compass, Minus, Plus, CheckCircle, AlertTriangle, Wind
} from 'lucide-react';

export default function App() {
  // Navigation State Management Core Engine
  // '1.1' = Drive Mode, '1.2' = Find Nearest Charger, '1.3' = Active Charging, 
  // '1.4' = Temp Controls, '1.5' = Defogger, '1.6' = Air Circ
  // '1.7' = Set Destination (Normal Map view), '1.7.1' = Set Destination (Recent Destinations table view)
  const [activeState, setActiveState] = useState('1.1');
  
  // Interactive Live State Anchors
  const [isCharging, setIsCharging] = useState(false);
  const [chargeProgress, setChargeProgress] = useState(48);
  const [cabinTemp, setCabinTemp] = useState(24);
  const [defoggerActive, setDefoggerActive] = useState(false);
  const [airCircMode, setAirCircMode] = useState('fresh');

  // HVAC Button Active Toggle States
  const [hvacSettings, setHvacSettings] = useState({
    sync: false,
    ac: true, 
    maxCool: false,
    maxHeat: false
  });

  // Smooth Battery Level Simulation Loop
  useEffect(() => {
    let interval;
    if (isCharging) {
      interval = setInterval(() => {
        setChargeProgress(prev => {
          if (prev >= 75) return 75; 
          return prev + 1;
        });
      }, 1500);
    }
    return () => clearInterval(interval);
  }, [isCharging]);

  // Temp Setpoint Limit Controls [16°C min - 28°C max parameters]
  const handleTempIncrement = () => { 
    if (cabinTemp < 28) {
      const nextTemp = cabinTemp + 1;
      setCabinTemp(nextTemp);
      setHvacSettings(prev => ({ ...prev, maxCool: nextTemp === 16, maxHeat: nextTemp === 28 }));
    }
  };
  
  const handleTempDecrement = () => { 
    if (cabinTemp > 16) {
      const nextTemp = cabinTemp - 1;
      setCabinTemp(nextTemp);
      setHvacSettings(prev => ({ ...prev, maxCool: nextTemp === 16, maxHeat: nextTemp === 28 }));
    }
  };

  // HVAC Mode Toggles
  const handleHvacToggle = (field) => {
    setHvacSettings(prev => {
      const updated = { ...prev, [field]: !prev[field] };
      if (field === 'maxCool' && updated.maxCool) {
        setCabinTemp(16);     
        updated.maxHeat = false; 
      }
      if (field === 'maxHeat' && updated.maxHeat) {
        setCabinTemp(28);     
        updated.maxCool = false; 
      }
      return updated;
    });
  };

  return (
    <div className="w-full max-w-[1400px] h-[780px] bg-[#b8b8b8] text-black flex flex-col justify-between overflow-hidden p-4 select-none font-sans mx-auto">
      
      {/* ========================================================= */}
      {/* HEADER BAR STATUS OVERVIEWS                               */}
      {/* ========================================================= */}
      <section id="section-header" className="w-full pb-2">
        <div className="bg-[#d9d9d9] rounded-[17px] shadow-[0_4px_4px_rgba(0,0,0,0.25)] px-6 py-4 flex justify-between items-center min-h-[90px]">
          <div className="flex items-center gap-6">
            <button 
              onClick={() => { setActiveState('1.1'); setIsCharging(false); }}
              className="bg-[#b2c7af] hover:bg-[#a0b59d] transition-colors rounded-[18px] shadow-[0_4px_4px_rgba(0,0,0,0.25)] px-5 py-2 flex items-center gap-2 font-bold text-[#0c2d09] text-sm"
            >
              <span className="w-2.5 h-2.5 bg-emerald-800 rounded-full animate-pulse"></span>
              <span>Home</span>
            </button>
            <div className="flex items-center gap-2 text-[#928c8c] font-bold text-sm">
              <Wifi size={18} />
              <span>Connected</span>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center">
            <div className="text-4xl font-black text-black tracking-tight leading-none">21:00</div>
            <div className="text-[10px] text-black font-semibold tracking-widest mt-1 uppercase">Tue 02 June</div>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-1.5 text-black font-black text-sm">
              <Thermometer size={18} className="text-orange-600" />
              <span>25°C</span>
            </div>
            <div className="bg-[#b2c7af] rounded-[18px] shadow-[0_4px_4px_rgba(0,0,0,0.25)] px-4 py-2 flex items-center gap-2 font-bold text-[#0c2d09] text-xs uppercase tracking-wider">
              <span>Autopilot Ready</span>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* CENTRAL CONSOLE SYSTEM INTERACTION CORE                   */}
      {/* ========================================================= */}
      <section id="section-main" className="w-full py-2 flex-1 flex overflow-hidden">
        <div className="w-full flex flex-col lg:flex-row gap-6 h-full">
          
          {/* PERSISTENT LEFT BAR PANEL: VEHICLE STATUS FRAME */}
          <div className="w-[318px] shrink-0 bg-[#d9d9d9] rounded-[17px] shadow-[0_4px_4px_rgba(0,0,0,0.25)] p-6 flex flex-col justify-between">
            <div>
              <h2 className="text-[#928c8c] text-xs font-black tracking-wider mb-5 uppercase text-left">
                {activeState === '1.1' ? 'VEHICLE STATUS' : activeState === '1.7' || activeState === '1.7.1' ? 'VEHICLE STATUS' : 'CURRENT BATTERY STATUS'}
              </h2>
              
              <div className="w-full flex justify-center items-center py-2 mb-4">
                <img 
                  src="/car-render.png" 
                  className="w-full max-w-[220px] object-contain drop-shadow-[0_10px_15px_rgba(0,0,0,0.25)]" 
                  alt="Hexa Phantom Car Frame" 
                />
              </div>

              <div className="w-full space-y-4 px-1 text-sm font-bold text-[#5c5454]">
                <div className="flex justify-between items-center border-b border-black/10 pb-2">
                  <span>Battery</span>
                  <span className="font-black text-[#459a3e]">{chargeProgress}%</span>
                </div>
                <div className="flex justify-between items-center border-b border-black/10 pb-2">
                  <span>{activeState === '1.5' || activeState === '1.6' ? 'Humidity' : 'Range'}</span>
                  <span className="font-black text-[#459a3e]">{activeState === '1.5' || activeState === '1.6' ? '74%' : activeState === '1.3' ? '228km' : '188km'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>{activeState === '1.4' ? 'Cabin Temp' : 'Power'}</span>
                  <span className="font-black text-[#459a3e]">{activeState === '1.4' ? `${cabinTemp}°C` : '12.4kW'}</span>
                </div>
              </div>
            </div>

            <button 
              onClick={() => setActiveState('1.2')}
              className="w-full bg-[#b2c7af] hover:bg-[#a0b59d] transition-colors rounded-[18px] py-3.5 flex items-center justify-center gap-2 shadow-[0_4px_4px_rgba(0,0,0,0.25)] font-black text-[#0c2d09] text-xs uppercase tracking-wider"
            >
              <span>{activeState === '1.7' || activeState === '1.7.1' ? 'NAVIGATION READY' : 'SELECT CHARGER'}</span>
            </button>
          </div>

          {/* ----------------------------------------------------- */}
          {/* FLEXIBLE CENTRAL SLOTS COMPONENT CONTROLLER           */}
          {/* ----------------------------------------------------- */}
          <div className="flex-1 bg-[#d9d9d9] rounded-[17px] shadow-[0_4px_4px_rgba(0,0,0,0.25)] p-6 flex flex-col justify-between relative overflow-hidden">
            
            {/* FIGMA VIEW 1.1: DRIVE MODE HOME CARD */}
            {activeState === '1.1' && (
              <div className="w-full h-full flex flex-col justify-between flex-1">
                <div>
                  <div className="text-emerald-700 text-xl font-black text-center mt-2">In 300 m</div>
                  <div className="flex justify-center my-4"><ArrowUpRight size={76} className="text-emerald-600 stroke-[3.5]" /></div>
                  <div className="text-3xl font-black text-black text-center tracking-tight">Unimas Campus</div>
                  <div className="text-slate-500 text-[10px] font-black text-center tracking-widest uppercase mt-0.5">Next Turn</div>
                </div>
                <div className="border-t border-black/10 my-2"></div>
                <div className="flex items-center gap-2 text-slate-600 font-bold text-xs justify-center"><MapPin size={14} /><span>Via Kota Samarahan</span></div>
                <div className="flex gap-4 mt-2">
                  <div className="bg-[#b8b8b8] text-center rounded-[14px] p-3 flex-1 shadow-sm"><span className="text-emerald-700 font-black text-lg block">21:24</span><span className="text-[9px] text-slate-600 font-bold uppercase block mt-0.5">Arrival</span></div>
                  <div className="bg-[#b8b8b8] text-center rounded-[14px] p-3 flex-1 shadow-sm"><span className="text-black font-black text-lg block">24 <span className="text-xs text-slate-500">min</span></span><span className="text-[9px] text-slate-600 font-bold uppercase block mt-0.5">Time Left</span></div>
                  <div className="bg-[#b8b8b8] text-center rounded-[14px] p-3 flex-1 shadow-sm"><span className="text-black font-black text-lg block">12.3 <span className="text-xs text-slate-500">km</span></span><span className="text-[9px] text-slate-600 font-bold uppercase block mt-0.5">Distance</span></div>
                </div>
              </div>
            )}

            {/* FIGMA VIEW 1.2: FIND NEAREST CHARGING STATION (MAP + SIDE LIST) */}
            {activeState === '1.2' && (
              <div className="w-full h-full flex flex-col justify-between flex-1">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-[#928c8c] text-xs font-black tracking-wider uppercase">NEAREST CHARGING STATION</h2>
                  <button onClick={() => setActiveState('1.7')} className="bg-[#b2c7af] hover:bg-[#a0b59d] transition-colors rounded-[18px] px-4 py-2 flex items-center gap-2 shadow-[0_4px_4px_rgba(0,0,0,0.25)] font-bold text-[#0c2d09] text-xs uppercase tracking-wide"><Search size={14} /><span>Search Station</span></button>
                </div>
                <div className="w-full flex-1 flex flex-col xl:flex-row gap-6 overflow-hidden">
                  <div className="flex-1 bg-[#09122C] rounded-[17px] relative overflow-hidden shadow-inner min-h-[260px] border border-slate-400/40">
                    <img src="/map-render.png" className="w-full h-full object-cover" alt="Figma Charging Pins Map" />
                  </div>
                  <div className="w-full xl:w-[360px] shrink-0 bg-[#d9d9d9] rounded-[17px] p-2 flex flex-col justify-start">
                    <div className="flex items-center gap-2 mb-4 px-1"><div className="w-7 h-7 bg-emerald-600 text-white rounded flex items-center justify-center font-black shadow-sm">⚡</div><h3 className="text-black font-black text-base">Nearby Chargers</h3><span className="text-[#5c5454] text-xs ml-auto font-black uppercase">3 found</span></div>
                    <div className="space-y-3 flex-1 overflow-y-auto pr-1">
                      <div onClick={() => setActiveState('1.3')} className="bg-white/95 hover:bg-slate-100 transition p-3 rounded-xl flex justify-between items-center border border-slate-300/30 cursor-pointer shadow-sm">
                        <div><div className="text-black font-black text-xs">ChargeSINI Charging Station</div><div className="flex items-center gap-2 text-[10px] text-[#459a3e] font-black mt-1"><span>▰▰▰▰▰▰▱▱▱▱</span><span>6/10 Slots</span></div></div>
                        <div className="text-right text-xs font-black text-slate-800">10 km</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* FIGMA VIEW 1.3: INTERACTIVE POWER CHARGING SLOTS HUD */}
            {activeState === '1.3' && (
              <div className="w-full h-full flex flex-col justify-between flex-1">
                <span className="text-[#928c8c] text-xs font-black tracking-wider uppercase mb-1">{isCharging ? 'STOP CHARGING' : 'START CHARGING'}</span>
                <div className="w-full flex-1 flex flex-col xl:flex-row gap-8 items-center justify-between my-auto">
                  <div className="flex-1 flex flex-col items-center justify-center w-full">
                    <div className="w-full max-w-[380px] h-[130px] border-[8px] border-[#22c55e] rounded-[24px] p-2 bg-slate-300/10 shadow-inner flex items-center relative mb-8">
                      <div className="h-full bg-[#22c55e] rounded-[10px] transition-all duration-500 shadow-[0_0_15px_rgba(34,197,94,0.5)]" style={{ width: `${isCharging ? 75 : 48}%` }}></div>
                    </div>
                    <button onClick={() => setIsCharging(!isCharging)} className={`w-[240px] py-4 rounded-[22px] font-black text-lg uppercase tracking-widest shadow-[0_4px_12px_rgba(0,0,0,0.3)] transition-all active:scale-95 ${isCharging ? 'bg-[#ff383c] text-white' : 'bg-[#22c55e] text-white'}`}>{isCharging ? 'STOP' : 'CHARGE'}</button>
                  </div>
                  <div className="w-full xl:w-[300px] space-y-4 flex flex-col justify-center">
                    <div className="bg-[#b8b8b8] p-4 border border-white/10 rounded-xl font-bold text-sm flex justify-between shadow-sm"><span className="text-slate-600">Time to Full</span><span className="font-black text-black">: 35 min</span></div>
                    <div className="bg-[#b8b8b8] p-4 border border-white/10 rounded-xl font-black text-black text-sm text-center shadow-sm">95km Added</div>
                    <div className="bg-[#b8b8b8] p-4 border border-white/10 rounded-xl font-black text-slate-800 text-sm text-center shadow-sm">RM14.20</div>
                  </div>
                </div>
              </div>
            )}

            {/* FIGMA VIEW 1.4: TEMPERATURE REGULATOR SLOTS */}
            {activeState === '1.4' && (
              <div className="w-full h-full flex flex-col justify-between flex-1">
                <span className="text-[#928c8c] text-xs font-black tracking-wider uppercase">ADJUST TEMPERATURE</span>
                <div className="flex items-center justify-center gap-12 my-auto">
                  <button onClick={handleTempDecrement} className="w-[95px] h-[95px] bg-[#b8b8b8] border-2 border-white/20 rounded-[20px] flex items-center justify-center shadow-[4px_4px_10px_rgba(0,0,0,0.25),_inset_-2px_-2px_6px_rgba(0,0,0,0.15)] font-sans text-4xl font-black text-white hover:bg-slate-300/40 transition active:scale-95">-</button>
                  <div className="text-center font-black text-5xl tracking-tighter select-text">{cabinTemp}°C</div>
                  <button onClick={handleTempIncrement} className="w-[95px] h-[95px] bg-[#b8b8b8] border-2 border-white/20 rounded-[20px] flex items-center justify-center shadow-[4px_4px_10px_rgba(0,0,0,0.25),_inset_-2px_-2px_6px_rgba(0,0,0,0.15)] font-sans text-4xl font-black text-white hover:bg-slate-300/40 transition active:scale-95">+</button>
                </div>
                <div className="w-full grid grid-cols-4 gap-4 pt-2">
                  <button onClick={() => handleHvacToggle('sync')} className={`py-4 font-black text-xs uppercase rounded-xl transition-all shadow ${hvacSettings.sync ? 'bg-[#22c55e] text-white shadow-inner' : 'bg-[#b8b8b8] text-black hover:bg-slate-300'}`}>Sync</button>
                  <button onClick={() => handleHvacToggle('ac')} className={`py-4 font-black text-xs uppercase rounded-xl transition-all shadow ${hvacSettings.ac ? 'bg-[#22c55e] text-white shadow-inner' : 'bg-[#b8b8b8] text-black hover:bg-slate-300'}`}>AC ON/OFF</button>
                  <button onClick={() => handleHvacToggle('maxCool')} className={`py-4 font-black text-xs uppercase rounded-xl transition-all shadow ${hvacSettings.maxCool ? 'bg-[#22c55e] text-white shadow-inner' : 'bg-[#b8b8b8] text-black hover:bg-slate-300'}`}>MAX COOL</button>
                  <button onClick={() => handleHvacToggle('maxHeat')} className={`py-4 font-black text-xs uppercase rounded-xl transition-all shadow ${hvacSettings.maxHeat ? 'bg-[#22c55e] text-white shadow-inner' : 'bg-[#b8b8b8] text-black hover:bg-slate-300'}`}>MAX HEAT</button>
                </div>
              </div>
            )}

            {/* FIGMA VIEW 1.5: DEFOGGER CONTROLLER */}
            {activeState === '1.5' && (
              <div className="w-full h-full flex flex-col justify-between items-center py-6 text-center">
                <span className="text-[#928c8c] text-xs font-black tracking-wider uppercase w-full text-left">VISIBILITY WARNING</span>
                <div className="my-auto space-y-5">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <img src={defoggerActive ? "/defog-icon.png" : "/fog-alert.png"} className={`w-14 h-14 object-contain ${!defoggerActive && 'animate-pulse'}`} alt="" />
                    <span className={`text-2xl font-black tracking-tight mt-2 ${defoggerActive ? 'text-[#459a3e]' : 'text-red-600'}`}>{defoggerActive ? 'Defogger Active' : 'Fog Detected'}</span>
                  </div>
                  <p className="text-2xl text-slate-500 font-medium tracking-tight">{defoggerActive ? 'Front Windshield Clear' : 'Front Windshield Visibility Poor'}</p>
                  <div className="pt-2">
                    <button onClick={() => setDefoggerActive(!defoggerActive)} style={{ backgroundColor: defoggerActive ? '#B2C7AF' : '#D5C779' }} className="px-8 py-3.5 rounded-[18px] font-black text-sm uppercase tracking-wider shadow text-[#0c2d09] transition active:scale-95">
                      <span>{defoggerActive ? 'TURN OFF DEFOG' : 'TURN ON DEFOG'}</span>
                    </button>
                  </div>
                </div>
                <p className="text-xs text-slate-400 font-bold uppercase mt-4">{defoggerActive ? 'Visibility restored for safer driving' : 'Recommendation : Activate defogger to improve driving visibility'}</p>
              </div>
            )}

            {/* FIGMA VIEW 1.6: AIR CIRCULATION */}
            {activeState === '1.6' && (
              <div className="w-full h-full flex flex-col justify-between items-center py-6 text-center">
                <span className="text-[#928c8c] text-xs font-black tracking-wider uppercase w-full text-left">AIR CIRCULATION CONTROL</span>
                <div className="my-auto space-y-4 w-full max-w-md">
                  <h3 className="text-2xl font-black text-slate-400">Air Circulation</h3>
                  <div className="flex justify-center text-slate-600 py-2">{airCircMode === 'fresh' ? <CloudRain size={52} /> : <Wind size={52} className="text-emerald-600" />}</div>
                  <div className="flex justify-center gap-6 text-base font-bold text-slate-800"><span>Current Mode</span><span className="text-black font-black uppercase bg-white/50 px-2 rounded">{airCircMode === 'fresh' ? 'Fresh Air' : 'Recirculate'}</span></div>
                  <p className="text-sm text-slate-500 font-medium">{airCircMode === 'fresh' ? 'Outside air entering cabin' : 'Cabin air recirculating'}</p>
                  <div className="pt-2">
                    <button onClick={() => setAirCircMode(prev => prev === 'fresh' ? 'recirc' : 'fresh')} className="px-8 py-3.5 bg-[#b2c7af] rounded-[18px] font-black text-xs text-[#0c2d09] uppercase tracking-wider shadow">{airCircMode === 'fresh' ? 'SWITCH TO RECIRCULATE' : 'SWITCH TO FRESH AIR'}</button>
                  </div>
                </div>
                <p className="text-xs text-slate-400 font-bold uppercase">Recommended for normal driving conditions</p>
              </div>
            )}

            {/* ========================================================================================= */}
            {/* FIGMA FRAME 1.7: 1:1 MAP SECTION VIEW - RENDERS THE CLEAN ROUTE BLUEPRINT MAP RENDER       */}
            {/* ========================================================================================= */}
            {activeState === '1.7' && (
              <div className="w-full h-full flex flex-col xl:flex-row gap-6 flex-1 overflow-hidden">
                {/* Left Area Layout Slot: Maps Graphic Frame containing search header panel */}
                <div className="flex-1 flex flex-col justify-between h-full">
                  <div className="w-full mb-3">
                    <div 
                      onClick={() => setActiveState('1.7.1')}
                      className="bg-[#b2c7af]/80 hover:bg-[#b2c7af] transition px-4 py-2.5 rounded-[14px] shadow-sm flex items-center gap-2 font-black text-xs uppercase text-[#0c2d09] cursor-pointer"
                    >
                      <Search size={14} />
                      <span>Navigate</span>
                    </div>
                  </div>
                  {/* Clean Road Vector Blueprint Background layout */}
                  <div className="w-full flex-1 bg-[#09122C] rounded-[17px] relative overflow-hidden shadow-inner border border-slate-400/30">
                    <img src="/normal-map.png" className="w-full h-full object-cover" alt="Figma Normal Roadmap Render" />
                  </div>
                </div>

                {/* Right Area Layout Slot: Yellow weather summary card + start route launcher base floor */}
                <div className="w-[340px] shrink-0 flex flex-col justify-between h-full gap-4">
                  {/* Yellow Alert Box Panel Layer from screen 1.7 blueprint */}
                  <div className="bg-dashboard-yellow rounded-[17px] shadow-[0_4px_4px_rgba(0,0,0,0.25)] p-4 border border-amber-400/20">
                    <div className="flex justify-between items-center mb-2 px-1 text-dashboard-yellowText text-xs font-black uppercase tracking-wide">
                      <span>⚠️ Rain in 14 min</span><span>Reduce Speed</span>
                    </div>
                    <div className="bg-[#f6f6f6] rounded-[18px] p-4 border border-slate-300/40">
                      <div className="flex justify-between items-center px-1">
                        <div><div className="text-black text-4xl font-black">18°C</div><div className="text-slate-500 text-xs font-bold uppercase mt-1">Rain showers</div></div>
                        <CloudRain size={40} className="text-slate-600" />
                      </div>
                      <div className="border-t border-slate-300 my-4"></div>
                      <div className="flex justify-between items-center text-center text-xs font-bold text-black">
                        <div>23 <span className="text-[9px] text-slate-400 block">Wind</span></div>
                        <div className="h-5 w-px bg-slate-300"></div>
                        <div>74% <span className="text-[9px] text-slate-400 block">Humidity</span></div>
                        <div className="h-5 w-px bg-slate-300"></div>
                        <div>8 km <span className="text-[9px] text-slate-400 block">Visibility</span></div>
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={() => setActiveState('1.1')}
                    className="w-full py-4 bg-[#b2c7af] text-[#0c2d09] font-black text-sm uppercase rounded-xl shadow-[0_4px_4px_rgba(0,0,0,0.15)] mt-auto"
                  >
                    Start Route
                  </button>
                </div>
              </div>
            )}

            {/* ========================================================================================= */}
            {/* FIGMA FRAME 1.7.1 / 1.7.2: RECENT DESTINATIONS TABLE SHEET GRID SELECTION PANEL VIEW      */}
            {/* ========================================================================================= */}
            {activeState === '1.7.1' && (
              <div className="w-full h-full flex flex-col xl:flex-row gap-6 flex-1 overflow-hidden">
                {/* Left Area Layout Slot: Recent Destinations Grid Box */}
                <div className="flex-1 flex flex-col h-full">
                  <div className="w-full mb-3">
                    <div 
                      onClick={() => setActiveState('1.7')}
                      className="bg-[#b2c7af]/80 hover:bg-[#b2c7af] transition px-4 py-2.5 rounded-[14px] shadow-sm flex items-center gap-2 font-black text-xs uppercase text-[#0c2d09] cursor-pointer"
                    >
                      <Search size={14} />
                      <span>Home</span>
                    </div>
                  </div>

                  {/* Gray Table Housing Matrix Sheet matching your exact requested Figma screenshots */}
                  <div className="w-full flex-1 bg-slate-300/40 border border-black/5 rounded-[17px] p-5 shadow-inner overflow-y-auto">
                    <div className="pb-2 border-b border-black/10 mb-4 text-[11px] font-black text-slate-400 uppercase tracking-wider">
                      Recent Destination :
                    </div>
                    <div className="space-y-2.5 font-bold text-sm text-black">
                      <div onClick={() => setActiveState('1.7')} className="p-3 bg-white hover:bg-slate-50 border border-slate-200/60 rounded-xl flex justify-between items-center cursor-pointer shadow-sm transition">
                        <span className="flex items-center gap-2">📍 Home</span><span className="text-slate-400 text-xs">32km</span>
                      </div>
                      <div className="p-3 bg-white/90 rounded-xl flex justify-between items-center shadow-xs">
                        <span className="flex items-center gap-2">🛒 Supermarket</span><span className="text-slate-400 text-xs">5km</span>
                      </div>
                      <div className="p-3 bg-white/90 rounded-xl flex justify-between items-center shadow-xs">
                        <span className="flex items-center gap-2">🏋 Gym</span><span className="text-slate-400 text-xs">12km</span>
                      </div>
                      <div className="p-3 bg-white/90 rounded-xl flex justify-between items-center shadow-xs">
                        <span className="flex items-center gap-2">💼 Work</span><span className="text-slate-400 text-xs">13km</span>
                      </div>
                      <div className="p-3 bg-white/80 rounded-xl flex justify-between items-center opacity-75 border border-dashed border-red-300">
                        <span className="flex items-center gap-2 text-red-700">🏠 Village</span><span className="text-red-400 text-xs">240km</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Area Layout Slot: Weather notification + Start button panel alignment bounds */}
                <div className="w-[340px] shrink-0 flex flex-col justify-between h-full gap-4">
                  <div className="bg-dashboard-yellow rounded-[17px] shadow-[0_4px_4px_rgba(0,0,0,0.25)] p-4 border border-amber-400/20">
                    <div className="flex justify-between items-center mb-2 px-1 text-dashboard-yellowText text-xs font-black uppercase tracking-wide">
                      <span>⚠️ Rain in 14 min</span><span>Reduce Speed</span>
                    </div>
                    <div className="bg-[#f6f6f6] rounded-[18px] p-4 border border-slate-300/40">
                      <div className="flex justify-between items-center px-1">
                        <div><div className="text-black text-4xl font-black">18°C</div><div className="text-slate-500 text-xs font-bold uppercase mt-1">Rain showers</div></div>
                        <CloudRain size={40} className="text-slate-600" />
                      </div>
                      <div className="border-t border-slate-300 my-4"></div>
                      <div className="flex justify-between items-center text-center text-xs font-bold text-black">
                        <div>23 <span className="text-[9px] text-slate-400 block">Wind</span></div>
                        <div className="h-5 w-px bg-slate-300"></div>
                        <div>74% <span className="text-[9px] text-slate-400 block">Humidity</span></div>
                        <div className="h-5 w-px bg-slate-300"></div>
                        <div>8 km <span className="text-[9px] text-slate-400 block">Visibility</span></div>
                      </div>
                    </div>
                  </div>
                  <button className="w-full py-4 bg-[#c8c8c8] text-slate-500 font-black text-sm uppercase rounded-xl cursor-not-allowed mt-auto">
                    Start Route
                  </button>
                </div>
              </div>
            )}

          </div>

          {/* ========================================================= */}
          {/* SIDEBAR BLOCK: RENDERED FOR MAIN HOME SCREEN MODE ONLY     */}
          {/* ========================================================= */}
          {activeState === '1.1' && (
            <div className="w-full xl:w-[423px] shrink-0 flex flex-col gap-6">
              <div className="bg-[#d9d9d9] border border-white/10 rounded-[17px] shadow-[0_4px_4px_rgba(0,0,0,0.25)] p-4 flex flex-col">
                <div className="flex justify-between items-center mb-2 px-1 text-slate-700 text-xs font-black uppercase tracking-wide">
                  <span>⚠️ Rain in 14 min</span><span>Reduce Speed</span>
                </div>
                <div className="bg-[#f6f6f6] rounded-[18px] p-4 border border-slate-300/40">
                  <div className="flex justify-between items-center px-1">
                    <div><div className="text-black text-4xl font-black">18°C</div><div className="text-slate-500 text-xs font-bold uppercase mt-1">Rain showers</div></div>
                    <CloudRain size={40} className="text-slate-600" />
                  </div>
                  <div className="border-t border-slate-300 my-4"></div>
                  <div className="flex justify-between items-center text-center text-xs font-bold text-black">
                    <div>23 <span className="text-[9px] text-slate-400 block">Wind</span></div>
                    <div className="h-5 w-px bg-slate-300"></div>
                    <div>74% <span className="text-[9px] text-slate-400 block">Humidity</span></div>
                    <div className="h-5 w-px bg-slate-300"></div>
                    <div>8 km <span className="text-[9px] text-slate-400 block">Visibility</span></div>
                  </div>
                </div>
              </div>

              <div className="bg-[#d9d9d9] border border-white/10 rounded-[17px] shadow-[0_4px_4px_rgba(0,0,0,0.25)] p-5 flex-1 flex flex-col justify-between">
                <div className="flex items-center gap-3 mb-4"><div className="w-7 h-7 bg-[#459a3e] text-white rounded flex items-center justify-center font-black">⚡</div><h3 className="text-black font-black text-base">Nearby Chargers</h3><span className="text-[#5c5454] text-xs ml-auto font-black uppercase">3 found</span></div>
                <div className="space-y-2.5 flex-1 flex flex-col justify-center">
                  <div onClick={() => setActiveState('1.2')} className="bg-white p-3 rounded-xl border border-slate-300/30 flex justify-between items-center shadow-sm cursor-pointer hover:border-emerald-500 transition">
                    <div><div className="text-black font-black text-xs">ChargeSINI Charging Station</div><div className="flex items-center gap-2 text-[10px] text-[#459a3e] font-black mt-1"><span>▰▰▰▰▰▰▱▱▱▱</span><span>6/10 Slots</span></div></div>
                    <div className="text-right text-xs font-black text-slate-800">10 km</div>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </section>

      {/* ========================================================= */}
      {/* FOOTER BAR NAVIGATION DOCK COMPONENT LINKS                */}
      {/* ========================================================= */}
      <section id="section-footer" className="w-full pb-2 pt-1">
        <div className="bg-[#d9d9d9] rounded-[17px] shadow-[0_4px_4px_rgba(0,0,0,0.25)] px-8 lg:px-24 py-4 flex justify-between items-center min-h-[95px]">
          
          <button onClick={() => setActiveState('1.1')} className={`flex flex-col items-center gap-1.5 transition ${activeState === '1.1' ? 'text-[#459a3e] font-black scale-105' : 'text-[#5c5454] opacity-70'}`}>
            <LayoutDashboard size={26} />
            <span className="text-xs font-medium">Drive mode</span>
          </button>

          <button onClick={() => setActiveState('1.6')} className={`flex flex-col items-center gap-1.5 transition ${activeState === '1.6' ? 'text-[#459a3e] font-black scale-105' : 'text-[#5c5454] opacity-70'}`}>
            <Wind size={26} />
            <span className="text-xs font-medium">Air Circ</span>
          </button>

          <button onClick={() => setActiveState('1.5')} className={`flex flex-col items-center gap-1.5 transition ${activeState === '1.5' ? 'text-[#459a3e] font-black scale-105' : 'text-[#5c5454] opacity-70'}`}>
            <CheckCircle size={26} />
            <span className="text-xs font-medium">Defog</span>
          </button>

          <button onClick={() => setActiveState('1.7')} className={`flex flex-col items-center gap-1.5 transition ${activeState === '1.7' || activeState === '1.7.1' ? 'text-[#459a3e] font-black scale-105' : 'text-[#5c5454] opacity-70'}`}>
            <Compass size={26} />
            <span className="text-xs font-medium">Map</span>
          </button>

          <button onClick={() => setActiveState('1.2')} className={`flex flex-col items-center gap-1.5 transition ${activeState === '1.2' || activeState === '1.3' ? 'text-[#459a3e] font-black scale-105' : 'text-[#5c5454] opacity-70'}`}>
            <Zap size={26} fill={activeState === '1.2' || activeState === '1.3' ? 'currentColor' : 'none'} />
            <span className="text-xs font-medium">Charge</span>
          </button>

          <button onClick={() => setActiveState('1.4')} className={`flex flex-col items-center gap-1.5 transition ${activeState === '1.4' ? 'text-black font-black scale-105' : 'text-[#5c5454] opacity-70'}`}>
            <Thermometer size={26} />
            <span className="text-xs font-medium">Temp</span>
          </button>

        </div>
      </section>

    </div>
  );
}