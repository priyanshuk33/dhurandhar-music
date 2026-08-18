import React, { useState, useEffect } from 'react';
import { Calendar, ListMusic } from 'lucide-react';

interface HeaderProps {
  onOpenPlaylist: () => void;
  onOpenAbout: () => void;
  onOpenFAQ: () => void;
  onOpenSpotify: () => void;
  onOpenYTMusic: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenPlaylist,
  onOpenAbout,
  onOpenFAQ,
  onOpenSpotify,
  onOpenYTMusic,
}) => {
  const [dateTimeStr, setDateTimeStr] = useState<string>('');

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      
      const dayName = days[now.getDay()];
      const monthName = months[now.getMonth()];
      const dateNum = now.getDate();

      let hours = now.getHours();
      const minutes = now.getMinutes();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12;
      const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;

      setDateTimeStr(`${dayName}, ${dateNum} ${monthName} • ${hours}:${formattedMinutes} ${ampm}`);
    };

    updateDateTime();
    const timer = setInterval(updateDateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="w-full px-4 sm:px-10 py-4 sm:py-5 flex flex-wrap items-center justify-between gap-3 z-30 select-none">
      {/* Left: Dark Charcoal Filled Date & Time Pill + Playlist Viewer Pill */}
      <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
        {/* Live Date & Time Pill with Darker Balanced Shade */}
        <div
          id="live-datetime-badge"
          className="bg-black/75 hover:bg-black/85 px-3.5 sm:px-4 py-2 rounded-full border border-white/20 backdrop-blur-2xl text-xs font-mono tracking-wider text-white flex items-center gap-2 transition-all shadow-lg shadow-black/40"
        >
          <Calendar className="w-3.5 h-3.5 text-white/80" />
          <span>{dateTimeStr || 'Loading...'}</span>
        </div>

        {/* Playlist Viewer Pill Button with Darker Balanced Shade */}
        <button
          id="nav-playlist-btn"
          onClick={onOpenPlaylist}
          className="bg-black/75 hover:bg-black/90 px-3.5 sm:px-4 py-2 rounded-full border border-white/20 backdrop-blur-2xl text-xs font-mono tracking-wider text-white flex items-center gap-2 transition-all cursor-pointer active:scale-95 shadow-lg shadow-black/40"
          title="Open Playlist Viewer"
        >
          <ListMusic className="w-3.5 h-3.5 text-white/90" />
          <span>Playlist</span>
        </button>
      </div>

      {/* Right: Dark Aesthetic Pill Navigation Buttons */}
      <div className="flex items-center gap-2 sm:gap-2.5 text-[11px] font-medium flex-wrap">
        {/* About Pill */}
        <button
          id="nav-about-btn"
          onClick={onOpenAbout}
          className="px-3.5 sm:px-4 py-2 rounded-full bg-black/75 hover:bg-black/90 border border-white/20 text-white/90 hover:text-white backdrop-blur-2xl active:scale-95 transition-all cursor-pointer shadow-lg shadow-black/40"
        >
          About
        </button>

        {/* FAQ Pill */}
        <button
          id="nav-faq-btn"
          onClick={onOpenFAQ}
          className="px-3.5 sm:px-4 py-2 rounded-full bg-black/75 hover:bg-black/90 border border-white/20 text-white/90 hover:text-white backdrop-blur-2xl active:scale-95 transition-all cursor-pointer shadow-lg shadow-black/40"
        >
          FAQ
        </button>

        {/* Spotify Pill with Deep Dark Rich Emerald Shade */}
        <button
          id="nav-spotify-btn"
          onClick={onOpenSpotify}
          className="px-3.5 sm:px-4 py-2 rounded-full bg-[#071d0e]/95 hover:bg-[#0c2f18] border border-[#1DB954]/50 hover:border-[#1DB954]/80 text-[#1ed760] hover:text-[#22e769] backdrop-blur-2xl text-[10px] font-mono font-semibold uppercase tracking-wider flex items-center gap-1.5 active:scale-95 transition-all cursor-pointer shadow-lg shadow-black/40"
        >
          <svg className="w-3.5 h-3.5 text-[#1ed760] fill-current" viewBox="0 0 24 24">
            <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.516 17.305c-.218.358-.68.472-1.038.254-2.846-1.74-6.428-2.133-10.65-1.168-.41.094-.82-.162-.914-.572-.094-.41.162-.82.572-.914 4.623-1.055 8.583-.604 11.776 1.35.358.218.472.68.254 1.05zm1.472-3.275c-.274.446-.86.588-1.306.314-3.258-2.003-8.225-2.584-12.078-1.413-.5.152-1.03-.134-1.182-.634-.152-.5.134-1.03.634-1.182 4.408-1.338 9.89-.693 13.618 1.609.446.274.588.86.314 1.306zm.126-3.41c-3.906-2.32-10.347-2.534-14.076-1.402-.598.182-1.23-.16-1.412-.758-.182-.598.16-1.23.758-1.412 4.29-1.303 11.403-1.052 15.894 1.614.538.32.712 1.02.392 1.558-.32.538-1.02.712-1.556.392z"/>
          </svg>
          <span>Spotify</span>
        </button>

        {/* YT Music Pill with Deep Dark Rich Ruby Shade */}
        <button
          id="nav-ytmusic-btn"
          onClick={onOpenYTMusic}
          className="px-3.5 sm:px-4 py-2 rounded-full bg-[#240608]/95 hover:bg-[#380b0e] border border-[#FF0000]/50 hover:border-[#FF0000]/80 text-[#ff5555] hover:text-[#ff7777] backdrop-blur-2xl text-[10px] font-mono font-semibold uppercase tracking-wider flex items-center gap-1.5 active:scale-95 transition-all cursor-pointer shadow-lg shadow-black/40"
        >
          <div className="w-2.5 h-2.5 rounded-full bg-[#FF0000] flex items-center justify-center">
            <svg className="w-1.5 h-1.5 text-white fill-current ml-0.5" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
          <span>YT Music</span>
        </button>
      </div>
    </header>
  );
};
