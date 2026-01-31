import { APIProvider, Map, Marker, useMapsLibrary } from '@vis.gl/react-google-maps';
import { CountryCode, parsePhoneNumberWithError } from "libphonenumber-js";
import { formatAddress } from 'localized-address-format';
import { Address, OrderMember } from "../../utilities/types";
import { InformationTableRow } from "../InformationTableRow/InformationTableRow";
import { InformationTable } from "../InformationTable/InformationTable";
import { useEffect, useState } from 'react';
import { countryToCountryCode } from '../../utilities/geolocation';

export function ProfileContactDetails({ om }: { om: OrderMember }) {
  if (!om.contact) {
    return <></>;
  }

  return (
    <>
      <InformationTable className="mb-4">
        {om.contact.personalEmail && (
          <InformationTableRow label={om.contact.workEmail ? "Personal Email" : "Email"}>
            <a className="text-indigo-600" href={"mailto:" + om.contact.personalEmail}>{om.contact.personalEmail}</a>
          </InformationTableRow>
        )}
        {om.contact.workEmail && (
          <InformationTableRow label="Work Email">
            <a className="text-indigo-600" href={"mailto:" + om.contact.workEmail}>{om.contact.workEmail}</a>
          </InformationTableRow>
        )}
        {om.contact.mobilePhone && (
          <InformationTableRow label={om.contact.homePhone || om.contact.workPhone ? "Mobile Phone" : "Phone"}>
            <PhoneNumberDisplay phoneNumber={om.contact.mobilePhone} country={om.contact.address?.country ?? undefined} />
          </InformationTableRow>
        )}
        {om.contact.homePhone && (
          <InformationTableRow label="Home Phone">
            <PhoneNumberDisplay phoneNumber={om.contact.homePhone} country={om.contact.address?.country ?? undefined} />
          </InformationTableRow>
        )}
        {om.contact.workPhone && (
          <InformationTableRow label="Work Phone">
            <PhoneNumberDisplay phoneNumber={om.contact.workPhone} country={om.contact.address?.country ?? undefined} />
          </InformationTableRow>
        )}
        {om.contact.address && (
          <InformationTableRow label="Address">
            <APIProvider apiKey={process.env.GOOGLE_MAPS_API_KEY ?? ''}>
              <AddressDisplay address={om.contact.address} />
            </APIProvider>
          </InformationTableRow>
        )}
      </InformationTable>
    </>
  );
}

function PhoneNumberDisplay({ phoneNumber, country }: { phoneNumber: string, country?: string; }) {
  try {
    const countryCode = country ? countryToCountryCode(country) : undefined;
    const options = countryCode ? { defaultCountry: countryCode as CountryCode } : {};
    const parsedPhoneNumber = parsePhoneNumberWithError(phoneNumber, options);
    return (
      <a className="text-indigo-600" href={parsedPhoneNumber.getURI()}>{parsedPhoneNumber.formatInternational()}</a>
    )
  } catch (err) {
    console.warn(err);
    return (
      <>{phoneNumber}</>
    )
  };
}

function AddressDisplay({ address }: { address: Address }) {
  const formattedAddress = formatAddress({
    postalCountry: address.country ? countryToCountryCode(address.country) : undefined,
    administrativeArea: address.state ?? undefined,
    locality: address.city ?? undefined,
    postalCode: address.postcode ?? undefined,
    addressLines: address.addressLines ?? undefined
  });
  if (address.country) {
    formattedAddress.push(address.country);
  }
  const addressString = formattedAddress.join('\n');

  const [coordinates, setCoordinates] = useState<google.maps.LatLngLiteral | undefined>(undefined);
  const geocodingLibrary = useMapsLibrary('geocoding');
  useEffect(() => {
    if (addressString && geocodingLibrary) {
      const geocoder = new geocodingLibrary.Geocoder();
      geocoder.geocode({ address: addressString }, (results, status) => {
        if (status === 'OK' && results) {
          setCoordinates({ lat: results[0].geometry.location.lat(), lng: results[0].geometry.location.lng() });
        }
      });
    }
  }, [addressString, geocodingLibrary]);

  return coordinates ? (
    <>
      <div style={{ whiteSpace: "pre-wrap" }}>{addressString}</div>
      <div className="pt-3">
        <Map
          style={{ width: '100%', height: 300 }}
          center={coordinates}
          defaultZoom={6}
          gestureHandling='none'
          disableDefaultUI
        >
          <Marker position={coordinates} />
        </Map>
      </div>
    </>
  ) : (
    <div style={{ whiteSpace: "pre-wrap" }}>{addressString}</div>
  );
}