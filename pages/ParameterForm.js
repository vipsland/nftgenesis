import React, { useState } from 'react';

const FILTER = {
  earring: '1',
  eye: '0',
  facialShape: '0',
  hair: '0',
  mouth: '0',
  necklace: '0',
  nose: '0',
  pet: '1',
  rosyCheek: '0',
  shirt: '0',
  skinColor: '0',
  spectacles: '1',
  hat: '0',
  itemsTotal: '2',
}
function ParameterForm() {
  const [formData, setFormData] = useState(FILTER);

  const [images, setImages] = useState([]);
  const [total, setTotal] = useState(0);

  const [selectedformData, setSelectedFormData] = useState({

  });

  const mapedKeys = {
    earring: 'r',
    eye: 'e',
    facialShape: 'f',
    hair: 'h',
    mouth: 'm',
    necklace: 'n',
    nose: 'o',
    pet: 'p',
    rosyCheek: 'y',
    shirt: 's',
    skinColor: 'k',
    spectacles: 't',
    hat: 'a',
    itemsTotal: 'i',
  }


  const handleImageClick = (image) => {
    // Handle image click here, e.g., show a larger version of the image.
    console.log(`Image clicked: ${image}`);
  }

  const handleClean = () => {
    setSelectedFormData({

    });

    setFormData(FILTER);

    setImages([]);
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    setSelectedFormData({
      ...selectedformData,
      [name]: value,
    });

    setFormData({
      ...formData,
      [name]: value,
    });


    console.log({ formData, selectedformData })

  };

  const generateQueryString = () => {
    const queryParams = Object.entries(selectedformData)
      .map(([key, value]) => `${mapedKeys[key]}=${value}`)
      .join('&');
    const q = `/?${queryParams}`;
    console.log({ q })
    return q
  };


  const [loading, setLoading] = useState(false); // Initialize loading state


  const handleSubmit = async (event) => {
    setImages([]);
    event.preventDefault();
    const queryString = generateQueryString();
    // You can use the queryString in your application for making API requests or updating the URL.
    const apiUrl = `/api/nft${queryString}`;



    try {
      setLoading(true);
      const response = await fetch(apiUrl);

      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.status}`);
      }

      const data = await response.json();
      // Handle the data as needed (e.g., update state with the fetched data)
      const [total, ...rest] = data.data;
      const images = rest
      setTotal(total)
      setImages(images)
      console.log('Fetched total:', { total, images });

    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false); // Set loading back to false when the request completes
    }

  };

  return (
    <>
      <form onSubmit={handleSubmit} className="mt-10 mb-10 flex flex-wrap gap-4">
        <div className="flex items-center">
          <label htmlFor="earring" className="text-white mr-3">Earring</label>
          <select name="earring" onChange={handleChange} value={formData.earring}>
            {Array.from({ length: 10 }, (_, i) => i + 1).map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center">
          <label htmlFor="eye" className="text-white mr-3">Eye</label>
          <select name="eye" onChange={handleChange} value={formData.eye}>
            {Array.from({ length: 5 }, (_, i) => i).map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center">
          <label htmlFor="facialShape" className="text-white mr-3">Facial Shape</label>
          <select name="facialShape" onChange={handleChange} value={formData.facialShape}>
            {[0, 2, 4, 6].map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center">
          <label htmlFor="hair" className="text-white mr-3">Hair</label>
          <select name="hair" onChange={handleChange} value={formData.hair}>
            {Array.from({ length: 16 }, (_, i) => i).map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center">
          <label htmlFor="mouth" className="text-white mr-3">Mouth</label>
          <select name="mouth" onChange={handleChange} value={formData.mouth}>
            {Array.from({ length: 18 }, (_, i) => i).map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center">
          <label htmlFor="necklace" className="text-white mr-3">Necklace</label>
          <select name="necklace" onChange={handleChange} value={formData.necklace}>
            {Array.from({ length: 8 }, (_, i) => i).map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center">
          <label htmlFor="nose" className="text-white mr-3">Nose</label>
          <select name="nose" onChange={handleChange} value={formData.nose}>
            {Array.from({ length: 9 }, (_, i) => i).map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center">
          <label htmlFor="pet" className="text-white mr-3">Pet</label>
          <select name="pet" onChange={handleChange} value={formData.pet}>
            {Array.from({ length: 21 }, (_, i) => i).filter(i => i != 0).map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center">
          <label htmlFor="rosyCheek" className="text-white mr-3">Rosy Cheek</label>
          <select name="rosyCheek" onChange={handleChange} value={formData.rosyCheek}>
            {Array.from({ length: 2 }, (_, i) => i).map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center">
          <label htmlFor="shirt" className="text-white mr-3">Shirt</label>
          <select name="shirt" onChange={handleChange} value={formData.shirt}>
            {Array.from({ length: 28 }, (_, i) => i).map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center">
          <label htmlFor="skinColor" className="text-white mr-3">Skin Color</label>
          <select name="skinColor" onChange={handleChange} value={formData.skinColor}>
            {Array.from({ length: 8 }, (_, i) => i).map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center">
          <label htmlFor="spectacles" className="text-white mr-3">Spectacles</label>
          <select name="spectacles" onChange={handleChange} value={formData.spectacles}>
            {Array.from({ length: 8 }, (_, i) => i + 1).map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center">
          <label htmlFor="hat" className="text-white mr-3">Hat</label>
          <select name="hat" onChange={handleChange} value={formData.hat}>
            {Array.from({ length: 9 }, (_, i) => i).map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center">
          <label htmlFor="itemsTotal" className="text-white mr-3">Items Total</label>
          <select name="itemsTotal" onChange={handleChange} value={formData.itemsTotal}>
            {[2, 3, 4, 5, 6, 7].map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </div>



        <div>
          <button type="submit" disabled={loading} className="bg-green-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            <span className={` ${loading ? 'animate-pulse opacity-50' : ''}`}>{loading ? 'Loading...' : 'Search'}</span>
          </button>
          <button type="button" onClick={() => handleClean()} className="bg-yellow-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-4">
            <span>{'Reset'}</span>
          </button>
        </div>
      </form>

      <div className="flex flex-wrap mb-5" >
        {total > 0 ? (
          <div className="w-full text-center p-5 text-white">{`Total ${total}`}</div>
        ) : null}
      </div>


      <div className="flex flex-wrap -m-5" >
        {images.length > 0 ? (
          images.map((image, index) => (
            <div key={index} className="p-5 flex flex-start">
              <img
                src={`https://ipfs.vipsland.com/nft/col/pfp/img/${image}.gif`}
                alt={`Image ${index}`}
                width="100"
                height="125"
                className="cursor-pointer"
                onClick={() => handleImageClick(image)}
              />
            </div>
          ))
        ) : null}
      </div>
      <div className="flex flex-wrap ml-5">
        {images.length === 0 ? (
          <div className="w-full text-center p-5 text-white">
            No result ☹️
          </div>
        ) : null}
      </div>


    </>

  );
}

export default ParameterForm;
