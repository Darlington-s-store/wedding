import * as React from "react";
import { motion } from "framer-motion";
import { MapPin, Phone, Calendar, Clock, Copy, Download } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import generateICS from "@/lib/calendar";
import champagne from "@/assets/champagne.jpg";
import car from "@/assets/car.jpg";

interface EventDetailsProps {
  title: string;
  date: string; // ISO date/time
  time: string;
  address: string;
  phone: string;
  mapUrl: string;
  icon: React.ReactNode;
  noBg?: boolean;
  index: number;
}

  const EventDetails: React.FC<EventDetailsProps> = ({
  title,
  date,
  time,
  address,
  phone,
  mapUrl,
  icon,
  noBg = false,
  index,
}) => {
  // Use Variants typing and an easing curve compatible with Transition types
  const itemVariants: import("framer-motion").Variants = {
    hidden: { opacity: 0, y: 50 },
    visible: (i: number = 0) => ({
      opacity: 1,
      y: 0,
      // ease: [0.16, 1, 0.3, 1] approximates an easeOut curve
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: i * 0.2 },
    }),
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(address);
      toast({ title: "Address copied", description: "Event address copied to clipboard." });
    } catch {
      toast({ title: "Copy failed", description: "Could not copy address to clipboard." });
    }
  };

  const handleAddToCalendar = () => {
    try {
      const ics = generateICS({
        title,
        description: address,
        start: date,
        end: date,
        location: address,
        // default reminders: 1 day (1440) and 1 hour (60) before
        reminders: [1440, 60],
      });
      const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${title.replace(/\s+/g, "_")}.ics`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      toast({ title: "Calendar saved", description: "An .ics file was downloaded." });
    } catch {
      toast({ title: "Download failed", description: "Could not create calendar file." });
    }
  };

  const googleCalendarUrl = () => {
    // Google Calendar event URL builder
    const startIso = new Date(date).toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
    const endIso = startIso; // using same end as start; Google will allow editing
    const details = new URLSearchParams({
      text: title,
      dates: `${startIso}/${endIso}`,
      details: address,
      location: address,
    });
    return `https://calendar.google.com/calendar/u/0/r/eventedit?${details.toString()}`;
  };

  return (
    <motion.div
      custom={index}
      variants={itemVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      className="flex justify-center w-full lg:w-1/2 px-4"
    >
      
  <div className="text-center max-w-xs sm:max-w-sm">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          whileInView={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.6, ease: "backOut", delay: index * 0.2 + 0.3 }}
          className={`${noBg ? "" : "bg-wedding-cream-100"} w-[110px] h-[110px] rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg`}
          style={{ boxShadow: "rgba(0, 0, 0, 0.75) 0px 10px 32px -30px" }}
        >
          <div className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center overflow-hidden">
            {icon}
          </div>
        </motion.div>

        <motion.h3 className="text-2xl lg:text-[28px] leading-tight mb-2 text-wedding-terracotta-600 font-semibold" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: index * 0.2 + 0.5 }}>
          {title}
        </motion.h3>

        <motion.div className="mb-4 text-wedding-cream-500" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: index * 0.2 + 0.6 }}>
          <div className="flex items-center justify-center gap-2 mb-1">
            <Calendar className="w-4 h-4" />
            <span>{new Date(date).toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" })}</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <Clock className="w-4 h-4" />
            <span>{time}</span>
          </div>
        </motion.div>

        <motion.p className="mb-4 text-wedding-cream-500 leading-relaxed" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: index * 0.2 + 0.7 }}>
          <MapPin className="w-4 h-4 inline mr-1" />
          {address}
        </motion.p>

        <motion.p className="mb-4" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: index * 0.2 + 0.8 }}>
          <a href={`tel:${phone}`} className="transition-colors duration-300 hover:opacity-80 text-wedding-terracotta-600">
            <Phone className="w-4 h-4 inline mr-1" />
            {phone}
          </a>
        </motion.p>

        <motion.div className="flex flex-col sm:flex-row items-center justify-center gap-3" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: index * 0.2 + 0.9 }}>
          <a href={mapUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold uppercase tracking-wider transition-all duration-300 hover:opacity-80 text-wedding-terracotta-600 border-b border-wedding-terracotta-300 w-full sm:w-auto">
            <span>See Map</span>
          </a>

          <button onClick={handleCopy} className="inline-flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold uppercase tracking-wider bg-yellow-500 text-white rounded shadow-sm hover:opacity-90 w-full sm:w-auto">
            <Copy className="w-4 h-4" />
            <span>Copy Address</span>
          </button>

          <div className="flex gap-2 w-full sm:w-auto">
            <button onClick={handleAddToCalendar} className="inline-flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold uppercase tracking-wider bg-yellow-500 text-white rounded shadow-sm hover:opacity-90 w-full sm:w-auto">
              <Download className="w-4 h-4" />
              <span>Download .ics</span>
            </button>

            <a href={googleCalendarUrl()} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold uppercase tracking-wider bg-wedding-terracotta-600 text-wedding-cream-500 rounded shadow-sm hover:opacity-90 w-full sm:w-auto">
              <Calendar className="w-4 h-4" />
              <span>Add to Google Calendar</span>
            </a>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

interface WhenWhereSectionProps {
  className?: string;
}

const WhenWhereSection: React.FC<WhenWhereSectionProps> = ({ className = "" }) => {
  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.8, staggerChildren: 0.2 } } } as const;

  return (
    <div className={`py-12 px-4 ${className}`} style={{ backgroundColor: "#333333" }}>
      <motion.div variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} className="flex flex-wrap -mx-4">
        <div className="w-full px-4 mb-6 text-center">
          <motion.span initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="inline-block text-sm font-black uppercase tracking-wider mb-2 px-2 border-b border-dashed text-wedding-terracotta-500 border-wedding-terracotta-300">Planning</motion.span>
          <motion.h2 initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }} className="font-rochester text-4xl lg:text-6xl xl:text-[80px] leading-tight text-wedding-cream-500">When &amp; Where</motion.h2>
        </div>

        <div className="flex flex-wrap lg:flex-nowrap gap-8 lg:gap-4 justify-center w-full px-4">
          <EventDetails title="Parking Location" date="2026-03-07T13:00:00" time="1:00 PM - 3:00 PM" address="Charlotte Street Car Park, Charlotte St, Bath BA1 2NE, United Kingdom" phone="‪+44 (7984) 004626" mapUrl="https://maps.app.goo.gl/Ua2QC5WvXWQzkqen8" icon={<img src={car} alt="Parking Car" className="w-full h-full object-cover rounded-full" />} index={0} />
          <EventDetails title="The Reception" date="2026-03-07T15:30:00" time="3:30 PM - 9:00 PM" address="Percy Community Centre, New King St, Bath BA1 2BN, United Kingdom" phone="+‪+44 (7984) 004626" mapUrl="https://maps.app.goo.gl/nDgwxcxTP9i5JkEi7" icon={<img src={champagne} alt="Champagne" className="w-full h-full object-cover rounded-full" />} index={1} />
        </div>

        <div className="w-full px-4 mt-12">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.6 }} className="bg-wedding-cream-100 rounded-lg shadow-lg overflow-hidden">
            <iframe className="w-full h-64 sm:h-96" style={{ border: 0 }} loading="lazy" allowFullScreen referrerPolicy="no-referrer-when-downgrade" title="Percy Community Centre, Bath" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2506.216240197166!2d-2.3595092844524716!3d51.38130997962559!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x48718f0f3c5b1f3d%3A0x2f3f6f6c5e0a1a6b!2sPercy%20Community%20Centre%2C%20New%20King%20St%2C%20Bath%20BA1%202BN%2C%20UK!5e0!3m2!1sen!2sus!4v1697625600000" />
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default WhenWhereSection;
