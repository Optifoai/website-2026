import React, { useReducer, useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { EMPTY_OBJECT, notify } from '../../utils/helpers';

import { uploadBackground } from '../../Redux/Actions/carAction';
import { useAuth } from '../../context/AuthContext';
import LoaderSpiner from '../../hooks/LoaderSpiner';
import { useTranslation } from 'react-i18next';
import { FaCheck, FaPlus } from 'react-icons/fa';
// import Swal from 'sweetalert2';


function CreateBackground(props) {
   const { t } = useTranslation();
      const { user,getUserData } = useAuth();   
      const { dispatch, loader } = props
      const [formdata, setFormdata] = useReducer((state, newState) => ({ ...state, ...newState }),
          {
              // This state is not used in the rectified component, but kept for potential future use.
          }
      );

  //create background code 
    const DIMENSIONS = {
        upper: { width: 1600, height: 720 },
        lower: { width: 1600, height: 480 },
        logo: { width: 363, height: 140 },
        divider: { width: 1600, height: 20 },
    };
  
    const DIMENSIONS_MIN = {
        upper: { width: 800, height: 360 },
        lower: { width: 800, height: 240 },
        logo: { width: 175, height: 70 },
        divider: { width: 1600, height: 20 },
    };
  
    const [upperImage, setUpperImage] = useState(null);
    const [lowerImage, setLowerImage] = useState(null);
    const [logoImagee, setLogoImagee] = useState(null);
    const [createdBGImage, setCreatedBGImage] = useState(null);
    const [loading, setLoading] = useState(false);

    const dividerImage = '/images/divider.jpg'; // Replace with the correct static path

    function generateImage() {
        return new Promise((resolve) => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
    
            const CANVAS_WIDTH = 1600;
            const CANVAS_HEIGHT = 1200;
    
            const wall = new Image();
            const floor = new Image();
            const logo = new Image();
            const divider = new Image();
    
            const imagesToLoad = [wall, floor, divider]; // Logo is optional
    
            wall.src = upperImage || '';
            floor.src = lowerImage || '';
            logo.src = logoImagee || '';
            divider.src = '/images/divider.jpg'; // Replace with your static path

    
            let imagesLoaded = 0;
    
            const checkImagesLoaded = () => {
                imagesLoaded++;
                if (imagesLoaded >= imagesToLoad.length) {
                    canvas.width = CANVAS_WIDTH;
                    canvas.height = CANVAS_HEIGHT;
    
                    if (upperImage) {
                        ctx.drawImage(wall, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT * 0.6);
                    }
    
                    if (dividerImage) {
                        ctx.drawImage(divider, 0, CANVAS_HEIGHT * 0.6 - 10, CANVAS_WIDTH, 20);
                    }
    
                    if (lowerImage) {
                        ctx.drawImage(floor, 0, CANVAS_HEIGHT * 0.6, CANVAS_WIDTH, CANVAS_HEIGHT * 0.4);
                    }
    
                    if (logoImagee) {
                        const logoWidth = 363;
                        const logoHeight = 140;
                        const logoX = 60;
                        const logoY = 60;
                        ctx.drawImage(logo, logoX, logoY, logoWidth, logoHeight);
                    }
    
                    canvas.toBlob((blob) => {
                        const file = new File([blob], 'background.png', { type: 'image/png' });
                        setCreatedBGImage(file);
                        resolve(file);
                    }, 'image/png');
                }
            };
    
            imagesToLoad.forEach(image => {
                if (image.src) {
                    image.onload = checkImagesLoaded;
                } else {
                    checkImagesLoaded();
                }
            });
        });
    }

    function handleReset() {
        setUpperImage(null);
        setLowerImage(null);
        setLogoImagee(null);
        setCreatedBGImage(null);
    }

    function handleImageChange(event, setImage, type) {
        const file = event.target.files[0];
        if (!file) return;
      
        const img = new Image();
        const reader = new FileReader();
      
        reader.onload = function (e) {
          img.src = e.target.result;
        };
      
        img.onload = function () {
          const { width, height } = DIMENSIONS_MIN[type];
          if (img.width >= width && img.height >= height) {
            setImage(img.src);
          } else {
            // Swal.fire({
            //   icon: 'error',
            //   title: 'Invalid Image',
            //   text: `Minimum Size required ${width}x${height} pixels.`,
            // });
          }
        };
      
        reader.readAsDataURL(file);
      }
      
    async function uploadNewBackgroundImage() {
        setLoading(true);
        try {
            const backgroundFile = createdBGImage || await generateImage();
            const bg = new FormData();
            bg.append('bg', backgroundFile);
            let obj = `backgroundType=${'background'}`;

            dispatch(uploadBackground(bg, obj)).then((res) => {
                if (res?.statusCode == '1') {
                    getUserData();
                    notify('success', res.response?.data?.message ? res.response?.data?.message : 'Background uploaded successfully.');
                } else {
                    notify('error', res?.error?.responseMessage ? res?.error?.responseMessage : 'Something went wrong!');
                }
            }).catch((err) => {
                notify('error', err?.message ? err?.message : 'Something went wrong!');
            });
        } catch (error) {
            notify('error', 'Error uploading background');
        } finally {
            setLoading(false);
        }
    }
    async function downloadImage() {
        const file = await generateImage();
        const link = document.createElement('a');
        link.href = URL.createObjectURL(file);
        link.download = 'background.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

  return ( <>

      {loader ? <LoaderSpiner /> : 
     
        <div className="account-tab">
            <div className="account-list border-bottom-0" style={{ gridTemplateColumns:'70% 30%',display: 'grid', paddingBottom:'1rem'}}>

                <div className="image-container" style={{ 
                  
                    height: '600px', 
                    border: '1px solid black', 
                    backgroundColor: '#ccc', 
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center', 
                    borderRadius: "30px",
                    position: 'relative',
                    overflow: 'hidden',
                    flexDirection: 'column', // Stacked images
                    }}>

                    {/* WALL IMAGE */}
                    <div id="upperImageContainer" style={{ 
                        // height: '60%', 
                        width: '100%', 
                        objectFit: 'cover', 
                        overflow:'hidden',
                        maxWidth:'100%'
                        }}>
                    {upperImage && <img src={upperImage} alt="Upper Image" style={{ 
                        objectFit: 'cover', 
                        borderTopLeftRadius: '30px',
                        borderTopRightRadius: '30px',
                        maxWidth:' 100%'
                        }} />}
                    </div>

                    {/* LOGO */}
                    {logoImagee && <img src={logoImagee} alt="Logo Image" style={{ 
                        width: '80px', 
                        position: 'absolute', 
                        top: '20px', 
                        left: '20px' ,
                        objectFit: 'cover', 
                        }} />}

                    {/* Divider */}
                    <img src="/images/divider.jpg" alt="Divider Image" style={{ 
                        width: '100%', 
                        height: '4px', 
                        objectFit: 'cover', 
                        }} />

                    {/* FLOOR IMAGE */}
                    <div id="lowerImageContainer" style={{ 
                        height: '40%', 
                        width: '100%',
                         }}>
                    {lowerImage && <img src={lowerImage} alt="Lower Image" style={{ 
                        objectFit: 'cover',  
                        borderBottomLeftRadius: '30px',
                        borderBottomRightRadius: '30px',
                        maxWidth:'100%'    
                        }} />}
                    </div>
                
                </div>

                {/* Button Container */}
                <div className="side-bar" style={{ 
                    paddingLeft:'1.5rem'
                    }}>

                    <div className="mb-3">
                        <button
                            className=""
                            onClick={() => document.getElementById("logoImageInput").click()}
                            title={`Accepted Dimensions: ${DIMENSIONS.logo.width}x${DIMENSIONS.logo.height}`}
                            style={{ border: "none", backgroundColor: "transparent", color:"#fff", fontSize:'14px', fontWeight:300 }}
                        >
                            <div className="icon-circle" style={{ marginRight:'12px', position: "relative", display: "inline-block" }}>
                            {logoImagee ? (
                                <FaCheck
                                size={15}
                                color="green"
                                style={{
                                    padding:'2px',
                                    backgroundColor: "white",
                                    borderRadius: "50%",
                                }}
                                />
                            ) : (
                                <FaPlus
                                size={15}
                                color="black"
                                style={{
                                    padding:'2px',
                                    backgroundColor: "white",
                                    borderRadius: "50%",
                                }}
                                />
                            )}
                        </div>
                            Choose Logo Image
                    </button>
                    <input type="file" id="logoImageInput" onChange={(e) => handleImageChange(e, setLogoImagee, 'logo')} style={{ display: 'none' }} />
                </div>

                <div className="mb-3">
                    <button
                    className=""
                    onClick={() => document.getElementById('upperImageInput').click()}
                    title={`Accepted Dimensions: ${DIMENSIONS.upper.width}x${DIMENSIONS.upper.height}`}
                    style={{ border: 'none', color:"#fff", backgroundColor: 'transparent', fontSize:'14px', fontWeight:300 }}
                    >
                     <div className="icon-circle" style={{marginRight:'12px', position: "relative", display: "inline-block" }}>
                            {upperImage ? (
                                <FaCheck
                                size={15}
                                color="green"
                                style={{
                                    padding:'2px',
                                    backgroundColor: "white",
                                    borderRadius: "50%",
                                }}
                                />
                            ) : (
                                <FaPlus
                                size={15}
                                color="black"
                                style={{
                                    padding:'2px',
                                    backgroundColor: "white",
                                    borderRadius: "50%",
                                }}
                                />
                            )}
                        </div>
                    Choose Wall Image
                    </button>
                    <input type="file" id="upperImageInput" onChange={(e) => handleImageChange(e, setUpperImage, 'upper')} style={{ display: 'none' }} />
                </div>

                <div className="mb-3">
                    <button
                    className=""
                    onClick={() => document.getElementById('lowerImageInput').click()}
                    title={`Accepted Dimensions: ${DIMENSIONS.lower.width}x${DIMENSIONS.lower.height}`}
                    style={{ border: 'none',  color:"#fff", backgroundColor: 'transparent', fontSize:'14px', fontWeight:300 }}
                    >
                     <div className="icon-circle" style={{ marginRight:'12px',position: "relative", display: "inline-block" }}>
                            {lowerImage ? (
                                <FaCheck
                                size={15}
                                color="green"
                                style={{
                                    padding:'2px',
                                    backgroundColor: "white",
                                    borderRadius: "50%",
                                }}
                                />
                            ) : (
                                <FaPlus
                                size={15}
                                color="black"
                                style={{
                                     padding:'2px',
                                    backgroundColor: "white",
                                    borderRadius: "50%",
                                }}
                                />
                            )}
                        </div>
                    Choose Floor Image
                    </button>
                    <input type="file" id="lowerImageInput" onChange={(e) => handleImageChange(e, setLowerImage, 'lower')} style={{ display: 'none' }} />
                </div>

                {upperImage && lowerImage && (<div className="mb-3">
                    <button
                    className="buy-btn position-relative px-0"
                    onClick={downloadImage}
                    >
                    Download Image
                    </button>
                </div>)}

                <div className="mb-3">
                    <button
                    className="buy-btn position-relative"
                    onClick={handleReset}
                    >
                   
                    Reset
                    </button>
                </div>

                {upperImage && lowerImage && (<div className="mb-3">
                    <button
                    className="buy-btn position-relative px-0"
                    onClick={uploadNewBackgroundImage}
                    >
                    Upload Background 
                    </button>
                </div>)}

                {loading && <div className="loader" style={{ marginTop: "20px",marginLeft: "20px" }}>Processing...</div>}
                </div>

            </div>
            </div>

      }
    </>
  ); }

CreateBackground.propTypes = {
  dispatch: PropTypes.func,
  data: PropTypes.object,
  loader: PropTypes.bool,

}

CreateBackground.defaulProps = {
  dispatch: PropTypes.func,
  data: EMPTY_OBJECT,
  loader: PropTypes.bool,

}

function mapStateToProps({ login }) {
  return {
    isUserLogin: login?.isUserLogin,
    userDetails: login?.userDetails,
    loader: login?.loader
  }
}

export default connect(mapStateToProps)(CreateBackground)