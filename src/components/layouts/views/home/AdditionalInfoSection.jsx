import React from 'react';
import InfoBox from './InfoBox';

const AdditionalInfoSection = () => {
  return (
    <section className="py-16 px-6 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
      <InfoBox 
        title="Wide Selection" 
        description="Browse hundreds of supervisors in all fields."
        icon={<svg className="w-10 h-10 mx-auto" fill="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/></svg>}
      />
      <InfoBox 
        title="Easy Communication" 
        description="Connect with supervisors directly through our platform."
        icon={<svg className="w-10 h-10 mx-auto" fill="currentColor" viewBox="0 0 24 24"><rect width="20" height="20" x="2" y="2" rx="5"/></svg>}
      />
      <InfoBox 
        title="Project Success" 
        description="Get expert guidance to complete your final year project."
        icon={<svg className="w-10 h-10 mx-auto" fill="currentColor" viewBox="0 0 24 24"><polygon points="12 2 22 22 2 22"/></svg>}
      />
    </section>
  );
};

export default AdditionalInfoSection;
