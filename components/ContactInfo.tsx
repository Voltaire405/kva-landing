import type { ContactInfo } from '@/db/schema';

interface ContactInfoProps {
  contactInfo: ContactInfo;
}

export default function ContactInfoDisplay({ contactInfo }: ContactInfoProps) {
  const phoneLines = contactInfo.phone.split('\n').filter(Boolean);

  return (
    <div className="flex flex-col justify-center">
      <div className="flex items-center mb-5 sm:mb-6 md:mb-[25px]">
        <div className="text-xl sm:text-2xl text-primary mr-3 sm:mr-[15px] bg-gray-medium w-[45px] h-[45px] sm:w-[50px] sm:h-[50px] rounded-full flex items-center justify-center flex-shrink-0">
          <i className="material-icons">phone</i>
        </div>
        <div>
          <h3 className="font-semibold text-sm sm:text-base">Teléfonos</h3>
          {phoneLines.map((line) => (
            <p key={line} className="text-sm sm:text-base">
              {line}
            </p>
          ))}
        </div>
      </div>
      <div className="flex items-center mb-5 sm:mb-6 md:mb-[25px]">
        <div className="text-xl sm:text-2xl text-primary mr-3 sm:mr-[15px] bg-gray-medium w-[45px] h-[45px] sm:w-[50px] sm:h-[50px] rounded-full flex items-center justify-center flex-shrink-0">
          <i className="material-icons">email</i>
        </div>
        <div>
          <h3 className="font-semibold text-sm sm:text-base">Email</h3>
          <p className="text-sm sm:text-base break-all">{contactInfo.email}</p>
        </div>
      </div>
      <div className="flex items-center mb-5 sm:mb-6 md:mb-[25px]">
        <div className="text-xl sm:text-2xl text-primary mr-3 sm:mr-[15px] bg-gray-medium w-[45px] h-[45px] sm:w-[50px] sm:h-[50px] rounded-full flex items-center justify-center flex-shrink-0">
          <i className="material-icons">location_on</i>
        </div>
        <div>
          <h3 className="font-semibold text-sm sm:text-base">Dirección</h3>
          <p className="text-sm sm:text-base">{contactInfo.address}</p>
        </div>
      </div>
    </div>
  );
}
