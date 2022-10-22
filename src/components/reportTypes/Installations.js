import React, {useState, useEffect} from 'react';
import useBaseImg from '../../hooks/useBaseImg';
import useFetch from '../../hooks/useFetch';

import "./ReportsStyling.css";
import BackButton from '../BackButton';
import { useNavigate } from 'react-router-dom';
import BeatLoader from "react-spinners/BeatLoader";

export default function Installations({filteredReport, reportId, onReportsModalToggleClick, reportModalOpen, onCloseReportsModalClick, onSideMenuClose}) {
  const [streetName, setStreetName] = useState(filteredReport.location.split(', ')[0] || "");
  const [postalCode, setPostalCode] = useState(filteredReport.location.split(', ')[1] || "");
  const [city, setCity] = useState(filteredReport.location.split(', ')[2] || "");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState(filteredReport.date || "");
  const [approved, setApproved] = useState(filteredReport.approved || "");
  const [installationType, setInstallationType] = useState(filteredReport.installationType || "default");
  const [reportedMalfunction, setReportedMalfunction] = useState(filteredReport.reportedMalfunction || "");
  const [testProcedure, setTestProcedure] = useState(filteredReport.testProcedure || "");
  const [description, setDescription] = useState(filteredReport.description || "");
  const [pictures, setPictures] = useState(filteredReport.pictures || "");
  const [loading, setLoading] = useState(false);
  const { put } = useFetch();
  const { uploadImage, srcEncoded } = useBaseImg();
  const navigate = useNavigate();

  let locationArr = [];

  useEffect(() => {
    if (streetName && postalCode && city) {
      setLocation([]);
      locationArr = [];
      locationArr.push(streetName, postalCode, city);
      setLocation(locationArr.join(", "));   
    }
  
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [streetName, postalCode, city])

  useEffect(() => {
    if (srcEncoded !== "") {
        setPictures(srcEncoded);
    }
  }, [srcEncoded]) 

  const handleDamagesSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    onSideMenuClose();

    const doc = {category: "installations", location, date, installationType, reportedMalfunction, testProcedure, approved, description, pictures, completed: "true"};

    if (reportModalOpen) {
      onCloseReportsModalClick();
    }

    setTimeout(() => {
      //prevents a bug on mobile where images don't get uploaded when pressing the submit button to quickly after uploading the image.
      put("reports", reportId, doc);
      navigate('/');
      setLoading(false);
      onSideMenuClose();
      onCloseReportsModalClick();
    }, 1500)
  }

  return (
    <section className="reports__container__default">
      <BackButton onReportsModalToggleClick={onReportsModalToggleClick}/>
      <h4 className="reports__header__default">Technische installaties inspecteren</h4>
      <form className="reports__inspection__form__default" onSubmit={handleDamagesSubmit}>
        <div className="report__form__default">
          <div className="report__form__location__container__default">
            <label>Straatnaam:</label>
            <label>Postcode:</label>
            <label>Plaats:</label>
          </div>
          <div className="report__form__location__default">
            <input type="text" name="modifications__report" size="25" placeholder="Dummystraat 125"  value={streetName} onChange={(e) => setStreetName(e.target.value)} required />
            <input type="text" name="modifications__report" size="25" placeholder="1234AB" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} required />
            <input type="text" name="modifications__report" size="25" placeholder="Amsterdam" value={city} onChange={(e) => setCity(e.target.value)} required />
          </div>
        </div>
        <div className="report__form__default">
          <label>Datum:</label>
          <input type="datetime-local" name="installations__report" value={date} onChange={(e) => setDate(e.target.value)} required />
        </div>
        <div className="report__form__default">
          <label>Soort installatie:</label>
          <select name="installations__report" value={installationType} onChange={(e) => setInstallationType(e.target.value)} className="report__select__default" required>
            <option value="default" disabled>Maak je keuze</option>
            <option value="koeling">Koeling</option>
            <option value="verwarming">Verwarming</option>
            <option value="luchtverversing">Luchtverversing</option>
            <option value="elektra">Elektra</option>
            <option value="beveiliging">Beveiliging</option>
          </select>
        </div>
        <div className="report__form__description__default">
          <label>Gemelde storing(en):</label>
          <textarea rows="4" cols="42" value={reportedMalfunction} onChange={(e) => setReportedMalfunction(e.target.value)} />
        </div>
        <div className="report__form__description__default">
          <label>Testprocedure:</label>
          <div className="report__form__test__procedure__default">
            <input type="text" name="installations__report" size="42" placeholder="https://www.testprocedure.nl/elektra" value={testProcedure} onChange={(e) => setTestProcedure(e.target.value)} />
          </div>
        </div>
        <div className="report__form__default">
          <label>Goedgekeurd:</label>
          <div className="report__form__radio__default__container">
            <div className="report__form__radio__default">
              <label>Ja</label>
              <input type="radio" name="installations__report" checked={approved === "ja"} value="ja" onChange={(e) => setApproved(e.target.value)} />
            </div>
            <div className="report__form__radio__default">
              <label>Nee</label>
              <input type="radio" name="installations__report" checked={approved === "nee"} value="nee" onChange={(e) => setApproved(e.target.value)} />
            </div>
          </div>
        </div>
        <div className="report__form__description__default">
          <label>Opmerkingen:</label>
          <textarea rows="4" cols="42" value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>
        <div className="report__form__file__type__default">
          <label>Foto toevoegen:</label>
          <input type="file" accept="image/*" id="report__file__input" onChange={(e) => uploadImage(e)} />
          <span><span style={{fontWeight: "600", fontSize: "1em"}}>Tip: </span>zorg ervoor dat de foto goed ingeladen is op uw telefoon alvorens u deze selecteert.</span>
        </div>
        <div className="reports__submit__button__wrapper">
          <input type="submit" value={loading ? "" : "Inspectie registreren"} disabled={loading} className="reports__button__default" />
          <div className="reports__submit__button__loader">
            <BeatLoader loading={loading} />
          </div>
        </div>
      </form>
    </section>
  )
}
